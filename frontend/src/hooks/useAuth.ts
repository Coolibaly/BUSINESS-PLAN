// src/hooks/useAuth.ts
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../store';
import { logout, clearError } from '../store/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // On récupère les infos de l'utilisateur depuis Redux
  const {
    user,
    token,
    isAuthenticated,
    isLoading,
    error
  } = useSelector((state: RootState) => state.auth);

  // Déconnexion : on vide les infos dans Redux + redirection
  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Nettoyer l'erreur de l'authentification (utile après un échec)
  const clearAuthError = () => {
    dispatch(clearError());
  };

  // Protéger les routes privées : redirige vers /login si pas connecté
  const requireAuth = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return false;
    }
    return true;
  };

  return {
    // État de l'utilisateur
    user,
    token,
    isAuthenticated,
    isLoading,
    error,

    // Actions utiles
    logout: handleLogout,
    clearError: clearAuthError,
    requireAuth,
  };
};
