import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import PublicLayout from '../../components/layouts/PublicLayout';
import ResponsiveImage from '../../components/ResponsiveImage';
import { AlertCircle, Loader2, Linkedin, Twitter, Mail } from 'lucide-react';

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
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
        </div>
      </PublicLayout>
    );
  }

  if (error) {
    return (
      <PublicLayout>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <div className="bg-gradient-to-b from-teal-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-6">
            Our Team
          </h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            Meet the dedicated professionals committed to supporting your mental health journey.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {teamMembers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No team members to display at this time.</p>
          </div>
        ) : (
          <div className="space-y-16">
            {(['FOUNDER', 'LEADERSHIP', 'STAFF'] as const).map((category) => {
              const members = groupedMembers[category];
              if (!members || members.length === 0) return null;

              return (
                <section key={category}>
                  <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                    {categoryLabels[category]}
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {members.map((member) => (
                      <div
                        key={member.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                      >
                        {member.photo_url ? (
                          <ResponsiveImage
                            src={member.photo_url}
                            alt={member.name}
                            aspectRatio="portrait"
                            containerClassName="w-full rounded-t-lg"
                          />
                        ) : (
                          <div className="w-full h-64 bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center rounded-t-lg">
                            <span className="text-5xl font-bold text-white">
                              {member.name.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {member.name}
                          </h3>
                          <p className="text-teal-600 font-medium mb-3">
                            {member.role_title}
                          </p>
                          {member.bio && (
                            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                              {member.bio}
                            </p>
                          )}
                          {member.socials_json && Object.keys(member.socials_json).length > 0 && (
                            <div className="flex gap-3">
                              {member.socials_json.linkedin && (
                                <a
                                  href={member.socials_json.linkedin}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-400 hover:text-teal-600 transition-colors"
                                  aria-label="LinkedIn"
                                >
                                  <Linkedin className="h-5 w-5" />
                                </a>
                              )}
                              {member.socials_json.twitter && (
                                <a
                                  href={member.socials_json.twitter}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-400 hover:text-teal-600 transition-colors"
                                  aria-label="Twitter"
                                >
                                  <Twitter className="h-5 w-5" />
                                </a>
                              )}
                              {member.socials_json.email && (
                                <a
                                  href={`mailto:${member.socials_json.email}`}
                                  className="text-gray-400 hover:text-teal-600 transition-colors"
                                  aria-label="Email"
                                >
                                  <Mail className="h-5 w-5" />
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

      <div className="bg-teal-50 mt-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Join Our Team
          </h2>
          <p className="text-gray-600 mb-6">
            Interested in making a difference? Learn about volunteer opportunities.
          </p>
          <a
            href="/partner"
            className="inline-block px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors font-medium"
          >
            Partner With Us
          </a>
        </div>
      </div>
    </PublicLayout>
  );
}
