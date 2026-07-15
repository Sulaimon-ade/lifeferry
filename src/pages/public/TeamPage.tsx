import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import PublicLayout from '../../components/layouts/PublicLayout';
import PageHeader from '../../components/PageHeader';
import ResponsiveImage from '../../components/ResponsiveImage';
import { AlertCircle, Loader2, Linkedin, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TeamMember {
  id: string;
  name: string;
  role_title: string;
  category: 'FOUNDER' | 'LEADERSHIP' | 'STAFF';
  bio: string;
  photo_url: string;
  socials_json: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  };
  order_num: number;
}

const categoryLabels = {
  FOUNDER: 'Founder',
  LEADERSHIP: 'Leadership Team',
  STAFF: 'Staff',
};

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('order_num');

      if (error) throw error;
      setTeamMembers(data || []);
    } catch (err) {
      console.error('Error fetching team members:', err);
      setError('Failed to load team members. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const groupedMembers = teamMembers.reduce((acc, member) => {
    if (!acc[member.category]) {
      acc[member.category] = [];
    }
    acc[member.category].push(member);
    return acc;
  }, {} as Record<string, TeamMember[]>);

  if (loading) {
    return (
      <PublicLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-600" />
        </div>
      </PublicLayout>
    );
  }

  if (error) {
    return (
      <PublicLayout>
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <PageHeader
        kicker="Our People"
        title="Meet the team"
        description="Meet the dedicated professionals committed to supporting your mental health journey."
      />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        {teamMembers.length === 0 ? (
          <p className="py-12 text-center text-gray-500">No team members to display at this time.</p>
        ) : (
          <div className="space-y-20">
            {(['FOUNDER', 'LEADERSHIP', 'STAFF'] as const).map((category) => {
              const members = groupedMembers[category];
              if (!members || members.length === 0) return null;

              return (
                <section key={category}>
                  <h2 className="heading-md mb-10 text-center text-deep">
                    {categoryLabels[category]}
                  </h2>
                  <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="overflow-hidden rounded-2xl bg-white shadow-md transition-shadow duration-300 hover:shadow-xl"
                      >
                        {member.photo_url ? (
                          <ResponsiveImage
                            src={member.photo_url}
                            alt={`Portrait of ${member.name}`}
                            aspectRatio="portrait"
                            containerClassName="w-full"
                          />
                        ) : (
                          <div className="flex aspect-[3/4] w-full items-center justify-center bg-brand-800">
                            <span className="font-display text-6xl font-semibold text-brand-300">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="p-7">
                          <h3 className="font-display text-xl font-semibold text-deep">{member.name}</h3>
                          <p className="mt-1 text-sm font-extrabold uppercase tracking-wide text-accent-600">
                            {member.role_title}
                          </p>
                          {member.bio && (
                            <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-gray-600">
                              {member.bio}
                            </p>
                          )}
                          {member.socials_json && Object.keys(member.socials_json).length > 0 && (
                            <div className="mt-4 flex gap-3">
                              {member.socials_json.linkedin && (
                                <a
                                  href={member.socials_json.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded-full bg-brand-50 p-2 text-brand-700 transition-colors duration-200 hover:bg-brand-100"
                                  aria-label={`${member.name} on LinkedIn`}
                                >
                                  <Linkedin className="h-4 w-4" />
                                </a>
                              )}
                              {member.socials_json.twitter && (
                                <a
                                  href={member.socials_json.twitter}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="rounded-full bg-brand-50 p-2 text-brand-700 transition-colors duration-200 hover:bg-brand-100"
                                  aria-label={`${member.name} on Twitter`}
                                >
                                  <Twitter className="h-4 w-4" />
                                </a>
                              )}
                              {member.socials_json.email && (
                                <a
                                  href={`mailto:${member.socials_json.email}`}
                                  className="rounded-full bg-brand-50 p-2 text-brand-700 transition-colors duration-200 hover:bg-brand-100"
                                  aria-label={`Email ${member.name}`}
                                >
                                  <Mail className="h-4 w-4" />
                                </a>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      <section className="relative overflow-hidden">
        <img
          src="/images/volunteer.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-deep/80" />
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <h2 className="heading-lg text-white">Join our team</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-brand-100">
            Interested in making a difference? Learn about volunteer opportunities.
          </p>
          <div className="mt-9">
            <Link to="/partner" className="btn-primary">
              Partner with us
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
