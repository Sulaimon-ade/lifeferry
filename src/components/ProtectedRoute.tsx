import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
}

export function ProtectedRoute({ children, requiredRole = 'EDITOR' }: ProtectedRouteProps) {
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
    SUPER_ADMIN: 3,
    ADMIN: 2,
    EDITOR: 1,
  };

  if (roleHierarchy[user.role] < roleHierarchy[requiredRole]) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return <>{children}</>;
}
