// src/pages/auth/Login.tsx
import React from 'react';
import { FiUser, FiLock } from 'react-icons/fi'; // pour les icônes
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-sm bg-white shadow-lg rounded-xl p-8 border border-orange-500">
        <h2 className="text-2xl font-bold text-center text-black mb-6">Connexion</h2>
        
        <form className="space-y-4">
          <div className="relative">
            <FiUser className="absolute left-3 top-3 text-orange-500" />
            <input
              type="email"
              placeholder="Email"
              className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-orange-500" />
            <input
              type="password"
              placeholder="Mot de passe"
              className="pl-10 w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center justify-between text-sm text-gray-600">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2 accent-orange-500" />
              Se souvenir de moi
            </label>
            <Link to="/forgot-password" className="text-orange-600 hover:underline">
              Mot de passe oublié ?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition-colors"
          >
            Connexion
          </button>

          <Link
            to="/register"
            className="w-full block text-center border border-orange-500 text-orange-600 py-2 rounded-md mt-2 hover:bg-orange-50"
          >
            Créer un compte
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;
