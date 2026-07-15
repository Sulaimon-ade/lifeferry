// Supabase Edge Function — send email notifications via Resend
// Deploy: supabase functions deploy send-notification
// Env vars needed: RESEND_API_KEY, ADMIN_EMAIL, FROM_EMAIL

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: CORS_HEADERS });
  }

  try {
    const { type, data } = await req.json();

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? '';
    const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL') ?? '';
    const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'notifications@lifeferry.org';

    if (!RESEND_API_KEY || !ADMIN_EMAIL) {
      console.warn('send-notification: missing RESEND_API_KEY or ADMIN_EMAIL — skipping');
      return new Response(JSON.stringify({ ok: true, skipped: true }), {
        status: 200,
        headers: { ...CORS_HEADERS, 'Content-Type': 'application/json' },
      });
    }

    let subject = '';
    let html = '';

    if (type === 'contact') {
      subject = `New Contact Message — ${data.subject || 'General Inquiry'}`;
      html = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#0f766e;margin-bottom:16px;">📬 New Contact Message</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <tr><td style="padding:8px 0;font-weight:600;width:120px;">Name</td><td style="padding:8px 0;">${data.name}</td></tr>
            <tr><td style="padding:8px 0;font-weight:600;">Email</td><td style="padding:8px 0;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
            ${data.phone ? `<tr><td style="padding:8px 0;font-weight:600;">Phone</td><td style="padding:8px 0;">${data.phone}</td></tr>` : ''}
            ${data.subject ? `<tr><td style="padding:8px 0;font-weight:600;">Subject</td><td style="padding:8px 0;">${data.subject}</td></tr>` : ''}
          </table>
          <div style="background:#f3f4f6;border-radius:8px;padding:16px;">
            <p style="margin:0 0 8px;font-weight:600;">Message:</p>
            <p style="margin:0;white-space:pre-wrap;">${data.message}</p>
          </div>
          <p style="margin-top:24px;font-size:12px;color:#6b7280;">
            View in admin: <a href="https://lifeferry.org/admin/contact">lifeferry.org/admin/contact</a>
          </p>
        </div>
      `;
    } else if (type === 'volunteer') {
      subject = `New Volunteer Application — ${data.name}`;
      html = `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;">
          <h2 style="color:#0f766e;margin-bottom:16px;">🙋 New Volunteer Application</h2>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <tr><td style="padding:8px 0;font-weight:600;width:160px;">Name</td><td style="padding:8px 0;">${data.name}</td></tr>
            <tr><td style="padding:8px 0;font-weight:600;">Email</td><td style="padding:8px 0;"><a href="mailto:${data.email}">${data.email}</a></td></tr>
            ${data.phone ? `<tr><td style="padding:8px 0;font-weight:600;">Phone</td><td style="padding:8px 0;">${data.phone}</td></tr>` : ''}
            ${data.interest_area ? `<tr><td style="padding:8px 0;font-weight:600;">Area of Interest</td><td style="padding:8px 0;">${data.interest_area}</td></tr>` : ''}
          </table>
          ${data.message ? `
          <div style="background:#f3f4f6;border-radius:8px;padding:16px;">
            <p style="margin:0 0 8px;font-weight:600;">About them:</p>
            <p style="margin:0;white-space:pre-wrap;">${data.message}</p>
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
          <p><strong>${data.email}</strong> just subscribed to the newsletter.</p>
          <p style="margin-top:24px;font-size:12px;color:#6b7280;">
            View all subscribers: <a href="https://lifeferry.org/admin/newsletters">lifeferry.org/admin/newsletters</a>
          </p>
        </div>
      `;
    } else {
      console.warn('send-notification: unknown type', type);
      return new Response(JSON.stringify({ ok: true }), { status: 200, headers: CORS_HEADERS });
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: FROM_EMAIL, to: ADMIN_EMAIL, subject, html }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error('Resend API error:', errText);
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
