import { useEffect, useState } from 'react';
import AdminLayout from '../../components/layouts/AdminLayout';
import { supabase } from '../../lib/supabase';
import {
  CalendarCheck,
  Mail,
  Calendar,
  FileText,
  UserPlus,
  TrendingUp,
} from 'lucide-react';

interface DashboardStats {
  newBookings: number;
  unreadMessages: number;
  upcomingEvents: number;
  draftPosts: number;
  newVolunteers: number;
  totalSubscribers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    newBookings: 0,
    unreadMessages: 0,
    upcomingEvents: 0,
    draftPosts: 0,
    newVolunteers: 0,
    totalSubscribers: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const [bookings, messages, events, posts, volunteers, subscribers] = await Promise.all([
        supabase
          .from('booking_requests')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'NEW'),
        supabase
          .from('contact_messages')
          .select('id', { count: 'exact', head: true })
          .eq('is_read', false),
        supabase
          .from('program_events')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'UPCOMING')
          .eq('is_active', true),
        supabase
          .from('blog_posts')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'DRAFT'),
        supabase
          .from('volunteer_applications')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'NEW'),
        supabase
          .from('subscribers')
          .select('id', { count: 'exact', head: true })
          .eq('is_active', true),
      ]);

      setStats({
        newBookings: bookings.count || 0,
        unreadMessages: messages.count || 0,
        upcomingEvents: events.count || 0,
        draftPosts: posts.count || 0,
        newVolunteers: volunteers.count || 0,
        totalSubscribers: subscribers.count || 0,
      });
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      name: 'New Bookings',
      value: stats.newBookings,
      icon: CalendarCheck,
      color: 'bg-blue-500',
      href: '/admin/bookings',
    },
    {
      name: 'Unread Messages',
      value: stats.unreadMessages,
      icon: Mail,
      color: 'bg-green-500',
      href: '/admin/contact',
    },
    {
      name: 'Upcoming Events',
      value: stats.upcomingEvents,
      icon: Calendar,
      color: 'bg-purple-500',
      href: '/admin/programs',
    },
    {
      name: 'Draft Posts',
      value: stats.draftPosts,
      icon: FileText,
      color: 'bg-orange-500',
      href: '/admin/blog',
    },
    {
      name: 'New Volunteers',
      value: stats.newVolunteers,
      icon: UserPlus,
      color: 'bg-pink-500',
      href: '/admin/volunteers',
    },
    {
      name: 'Subscribers',
      value: stats.totalSubscribers,
      icon: TrendingUp,
      color: 'bg-teal-500',
      href: '/admin/newsletters',
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {statCards.map((card) => (
            <a
              key={card.name}
              href={card.href}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{card.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{card.value}</p>
                </div>
                <div className={`${card.color} p-3 rounded-lg`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </a>
          ))}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/admin/services"
              className="px-4 py-3 bg-teal-50 text-teal-700 rounded-lg hover:bg-teal-100 transition-colors text-center font-medium"
            >
              Manage Services
            </a>
            <a
              href="/admin/blog"
              className="px-4 py-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-center font-medium"
            >
              Create Blog Post
            </a>
            <a
              href="/admin/programs"
              className="px-4 py-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors text-center font-medium"
            >
              Add Event
            </a>
            <a
              href="/admin/resources"
              className="px-4 py-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors text-center font-medium"
            >
              Upload Resource
            </a>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
