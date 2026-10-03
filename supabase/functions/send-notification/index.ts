// Supabase Edge Function — send form notifications over SMTP (cPanel mailbox)
// Deploy: supabase functions deploy send-notification
// Secrets needed: SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, ADMIN_EMAIL, FROM_EMAIL

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { SMTPClient } from 'https://deno.land/x/denomailer@1.6.0/mod.ts';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Escape user-supplied text before interpolating it into the email HTML
function esc(value: unknown): string {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    const { type, data } = await req.json();

    const SMTP_HOST = Deno.env.get('SMTP_HOST') ?? '';
    const SMTP_PORT = Number(Deno.env.get('SMTP_PORT') ?? '465');
    const SMTP_USER = Deno.env.get('SMTP_USER') ?? '';
    const SMTP_PASS = Deno.env.get('SMTP_PASS') ?? '';
    // Where notifications land. Defaults to the sending mailbox itself.
    const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') || SMTP_USER;
    // cPanel SMTP requires the From address to be the authenticated mailbox.
    const FROM_EMAIL = Deno.env.get('FROM_EMAIL') || SMTP_USER;

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !ADMIN_EMAIL) {
      console.warn('send-notification: SMTP not configured — skipping');
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    let subject = '';
    let html = '';
    // So the team can hit Reply in their inbox and answer the person directly
    const replyTo = typeof data?.email === 'string' ? data.email : '';

    if (type === 'contact') {
      subject = `New Contact Message — ${data.subject || 'General Inquiry'}`;
      html = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#0f766e;margin-bottom:16px;">📬 New Contact Message</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <tr><td style="padding:8px 0;font-weight:600;width:120px;">Name</td><td style="padding:8px 0;">${esc(data.name)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:600;">Email</td><td style="padding:8px 0;"><a href="mailto:${esc(data.email)}">${esc(data.email)}</a></td></tr>
            ${data.phone ? `<tr><td style="padding:8px 0;font-weight:600;">Phone</td><td style="padding:8px 0;">${esc(data.phone)}</td></tr>` : ''}
            ${data.subject ? `<tr><td style="padding:8px 0;font-weight:600;">Subject</td><td style="padding:8px 0;">${esc(data.subject)}</td></tr>` : ''}
          </table>
          <div style="background:#f3f4f6;border-radius:8px;padding:16px;">
            <p style="margin:0 0 8px;font-weight:600;">Message:</p>
            <p style="margin:0;white-space:pre-wrap;">${esc(data.message)}</p>
          </div>
          <p style="margin-top:24px;font-size:12px;color:#6b7280;">
            View in admin: <a href="https://lifeferry.org/admin/contact">lifeferry.org/admin/contact</a>
          </p>
        </div>
      `;
    } else if (type === 'booking') {
      subject = `New Session Booking — ${data.name}`;
      html = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#0f766e;margin-bottom:16px;">🗓️ New Session Booking</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <tr><td style="padding:8px 0;font-weight:600;width:170px;">Name</td><td style="padding:8px 0;">${esc(data.name)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:600;">Email</td><td style="padding:8px 0;"><a href="mailto:${esc(data.email)}">${esc(data.email)}</a></td></tr>
            <tr><td style="padding:8px 0;font-weight:600;">Phone</td><td style="padding:8px 0;"><a href="tel:${esc(data.phone)}">${esc(data.phone)}</a></td></tr>
            <tr><td style="padding:8px 0;font-weight:600;">Service</td><td style="padding:8px 0;">${esc(data.service_title || 'Not specified')}</td></tr>
            <tr><td style="padding:8px 0;font-weight:600;">Preferred time</td><td style="padding:8px 0;"><strong>${esc(data.preferred_datetime)}</strong></td></tr>
          </table>
          ${data.message ? `
          <div style="background:#f3f4f6;border-radius:8px;padding:16px;">
            <p style="margin:0 0 8px;font-weight:600;">Their note:</p>
            <p style="margin:0;white-space:pre-wrap;">${esc(data.message)}</p>
          </div>` : ''}
          <p style="margin-top:20px;padding:12px 16px;background:#ecfdf5;border-left:4px solid #0f766e;border-radius:4px;font-size:14px;color:#374151;">
            This person is waiting to hear back. Reply to this email to reach them directly.
          </p>
          <p style="margin-top:24px;font-size:12px;color:#6b7280;">
            View in admin: <a href="https://lifeferry.org/admin/bookings">lifeferry.org/admin/bookings</a>
          </p>
        </div>
      `;
    } else if (type === 'volunteer') {
      subject = `New Volunteer Application — ${data.name}`;
      html = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#0f766e;margin-bottom:16px;">🙋 New Volunteer Application</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <tr><td style="padding:8px 0;font-weight:600;width:160px;">Name</td><td style="padding:8px 0;">${esc(data.name)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:600;">Email</td><td style="padding:8px 0;"><a href="mailto:${esc(data.email)}">${esc(data.email)}</a></td></tr>
            ${data.phone ? `<tr><td style="padding:8px 0;font-weight:600;">Phone</td><td style="padding:8px 0;">${esc(data.phone)}</td></tr>` : ''}
            ${data.interest_area ? `<tr><td style="padding:8px 0;font-weight:600;">Area of Interest</td><td style="padding:8px 0;">${esc(data.interest_area)}</td></tr>` : ''}
          </table>
          ${data.message ? `
          <div style="background:#f3f4f6;border-radius:8px;padding:16px;">
            <p style="margin:0 0 8px;font-weight:600;">About them:</p>
            <p style="margin:0;white-space:pre-wrap;">${esc(data.message)}</p>
          </div>` : ''}
          <p style="margin-top:24px;font-size:12px;color:#6b7280;">
            View in admin: <a href="https://lifeferry.org/admin/volunteers">lifeferry.org/admin/volunteers</a>
          </p>
        </div>
      `;
    } else if (type === 'newsletter') {
      subject = `New Newsletter Subscriber — ${data.email}`;
      html = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#0f766e;margin-bottom:16px;">📧 New Newsletter Subscriber</h2>
          <p><strong>${esc(data.email)}</strong> just subscribed to the newsletter.</p>
          <p style="margin-top:24px;font-size:12px;color:#6b7280;">
            View all subscribers: <a href="https://lifeferry.org/admin/newsletters">lifeferry.org/admin/newsletters</a>
          </p>
        </div>
      `;
    } else {
      console.warn('send-notification: unknown type', type);
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: CORS_HEADERS });
    }

    // Port 465 uses implicit TLS; 587 negotiates STARTTLS instead.
    const client = new SMTPClient({
      connection: {
        hostname: SMTP_HOST,
        port: SMTP_PORT,
        tls: SMTP_PORT === 465,
        auth: { username: SMTP_USER, password: SMTP_PASS },
      },
    });

    try {
      await client.send({
        from: FROM_EMAIL,
        to: ADMIN_EMAIL,
        subject,
        html,
        content: 'auto',
        ...(replyTo ? { replyTo } : {}),
      });
    } finally {
      await client.close();
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('send-notification error:', err);
    // Always return 200 so the frontend doesn't show an error
    return new Response(JSON.stringify({ ok: false }), {
      status: 200,
      headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
    });
  }
});
