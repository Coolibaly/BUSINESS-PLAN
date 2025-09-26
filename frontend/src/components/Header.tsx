import { Sparkles, User } from 'lucide-react';

export function Header() {
  const username = localStorage.getItem('username') || 'Utilisateur';

  return (
    <header className="sticky top-0 z-10 backdrop-blur bg-white/90 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo + Titre */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Générateur Business Plan</h1>
              <p className="text-sm text-gray-600">Orange Bank - Côte d'Ivoire</p>
            </div>
          </div>

          {/* Profil utilisateur */}
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>Connecté en tant que <span className="font-medium text-gray-800">{username}</span></span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
