import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router'; // Use 'next/navigation' if using Next.js 13+ App Router
import { useEffect } from 'react';

/**
 * RoleGate restricts access to children based on authorized roles.
 * Usage: <RoleGate allowedRoles={['ngo', 'admin']}>...</RoleGate>
 */
export default function RoleGate({ children, allowedRoles }) {
  const { role, loading, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || (allowedRoles && !allowedRoles.includes(role)))) {
      router.push('/login'); // Redirect to login if unauthorized
    }
  }, [role, loading, user, router, allowedRoles]);

  if (loading) {
    return <div className="loader">Loading Security Clearance...</div>;
  }

  if (user && (!allowedRoles || allowedRoles.includes(role))) {
    return <>{children}</>;
  }

  return null;
}
