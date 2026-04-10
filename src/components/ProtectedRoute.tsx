import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({ children, requiredRole = 'user' }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

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

  if ((roleHierarchy[user.role] ?? 0) < (roleHierarchy[requiredRole] ?? 0)) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}
