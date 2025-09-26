import React from 'react';

const Register: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white border border-gray-200 shadow-lg rounded-xl p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-orange-600">Créer un compte</h2>
          <p className="mt-2 text-sm text-gray-500">Rejoignez BoostPlan dès aujourd'hui</p>
        </div>

        <form className="space-y-5">
          <div>
            <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">
              Nom complet
            </label>
            <input
              id="fullname"
              type="text"
              placeholder="Olivia Coulibaly"
              className="mt-1 w-full px-4 py-2 border rounded-md text-gray-900 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Adresse email
            </label>
            <input
              id="email"
              type="email"
              placeholder="exemple@domaine.com"
              className="mt-1 w-full px-4 py-2 border rounded-md text-gray-900 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="mt-1 w-full px-4 py-2 border rounded-md text-gray-900 border-gray-300 focus:ring-orange-500 focus:border-orange-500"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-md shadow focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
            >
              S'inscrire
            </button>
          </div>

          <div className="text-center text-sm text-gray-600">
            Vous avez déjà un compte ?{' '}
            <a href="/login" className="text-orange-600 hover:underline">
              Se connecter
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
