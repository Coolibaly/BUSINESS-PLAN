import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  // Pour l'instant, on laisse passer tout le monde
  // Vous implémenterez la logique d'authentification plus tard
  return <>{children}</>;
};

export default ProtectedRoute;
