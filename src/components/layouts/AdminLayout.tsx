import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LayoutDashboard,
  FileText,
  Users,
  Briefcase,
  Calendar,
  FileDown,
  BookOpen,
  Image,
  Mail,
  MessageSquare,
  HelpCircle,
  Scale,
  Settings,
  UserCog,
  LogOut,
  Menu,
  X,
  Heart,
  CalendarCheck,
  UserPlus,
  Send,
} from 'lucide-react';
import { useState } from 'react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Pages', href: '/admin/pages', icon: FileText },
    { name: 'Team', href: '/admin/team', icon: Users },
    { name: 'Services', href: '/admin/services', icon: Briefcase },
    { name: 'Bookings', href: '/admin/bookings', icon: CalendarCheck },
    { name: 'Programs & Events', href: '/admin/programs', icon: Calendar },
    { name: 'Resources', href: '/admin/resources', icon: FileDown },
    { name: 'Blog', href: '/admin/blog', icon: BookOpen },
    { name: 'Newsletters', href: '/admin/newsletters', icon: Send },
    { name: 'Media', href: '/admin/media', icon: Image },
    { name: 'Contact Messages', href: '/admin/contact', icon: Mail },
    { name: 'Volunteers', href: '/admin/volunteers', icon: UserPlus },
    { name: 'FAQ', href: '/admin/faq', icon: HelpCircle },
    { name: 'Legal Pages', href: '/admin/legal', icon: Scale },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
    { name: 'Users', href: '/admin/users', icon: UserCog },
  ];

  const filteredNavigation = navigation;

  const Sidebar = ({ mobile = false }) => (
    <div className={`flex flex-col h-full ${mobile ? 'bg-gray-900' : ''}`}>
      <div className="flex items-center space-x-2 px-6 py-4 border-b border-gray-800">
        <Heart className="h-6 w-6 text-teal-400" fill="currentColor" />
        <div>
          <div className="text-sm font-semibold text-white">Lifeferry Admin</div>
          <div className="text-xs text-gray-400">{user?.role}</div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              onClick={() => mobile && setSidebarOpen(false)}
              className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-teal-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-gray-800 p-4">
        <div className="flex items-center justify-between px-3 py-2">
          <div className="text-sm">
            <div className="font-medium text-white">{user?.full_name || user?.email}</div>
            <div className="text-xs text-gray-400">{user?.email}</div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white transition-colors"
            title="Logout"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="hidden lg:flex lg:flex-shrink-0 lg:w-64 bg-gray-900">
        <Sidebar />
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-900/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-64 bg-gray-900">
            <Sidebar mobile />
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1 overflow-hidden">
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6">
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-700 hover:bg-gray-100"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="flex-1" />
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gray-600 hover:text-teal-600 font-medium"
            >
              View Public Site
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">{children}</main>
      </div>
    </div>
  );
}
