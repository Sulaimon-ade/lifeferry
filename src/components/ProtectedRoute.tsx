import { Navigate, Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

/**
 * Guards an admin route. Defaults to requiring 'admin' so a route that
 * forgets to declare a role fails closed rather than open.
 */
export function ProtectedRoute({ children, requiredRole = 'admin' }: ProtectedRouteProps) {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin" replace />;
  }

  const roleHierarchy: Record<UserRole, number> = {
    admin: 2,
    user: 1,
  };

  // Signed in but under-privileged. Render instead of redirecting: the login
  // page sends every signed-in user to /admin/dashboard, so redirecting here
  // would bounce between the two forever once the dashboard requires 'admin'.
  if ((roleHierarchy[user.role] ?? 0) < (roleHierarchy[requiredRole] ?? 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <ShieldAlert className="mx-auto h-10 w-10 text-amber-500" aria-hidden="true" />
          <h1 className="mt-4 text-xl font-semibold text-gray-900">Access denied</h1>
          <p className="mt-2 text-gray-600">
            Your account doesn't have permission to view this page. If you think
            this is a mistake, ask an administrator to review your access.
          </p>
          <div className="mt-6 space-y-3">
            <Link
              to="/"
              className="block w-full rounded-lg bg-teal-600 px-4 py-3 font-medium text-white transition-colors hover:bg-teal-700"
            >
              Back to site
            </Link>
            <button
              onClick={logout}
              className="block w-full rounded-lg border border-gray-300 px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Sign out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
