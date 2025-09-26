// src/pages/Dashboard.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, MessageCircle, FileText, Lightbulb } from 'lucide-react';
import logo from '../assets/logo.jpeg';

export function Dashboard() {
  const navigate = useNavigate();
  const [projects] = useState([
    { id: 1, name: "Restaurant Local", sector: "Restauration", city: "Abidjan", status: "En cours" },
    { id: 2, name: "E-commerce", sector: "Commerce", city: "Dakar", status: "Terminé" },
  ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Logo" className="w-8 h-8 rounded" />
              <span className="text-xl font-bold text-gray-900">Business Plan Generator</span>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/welcome')}
                className="text-gray-600 hover:text-orange-600 transition-colors"
              >
                Accueil
              </button>
              <button
                onClick={() => navigate('/login')}
                className="text-gray-600 hover:text-orange-600 transition-colors"
              >
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        {/* En-tête du dashboard */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Tableau de Bord
          </h1>
          <p className="text-gray-600">
            Gérez vos projets et générez des business plans professionnels
          </p>
        </div>

        {/* Actions rapides */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <button
            onClick={() => navigate('/project-creation')}
            className="group bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-left"
          >
            <div className="inline-block p-3 bg-orange-100 rounded-full mb-4 group-hover:bg-orange-200 transition-colors">
              <Plus className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Nouveau Projet
            </h3>
            <p className="text-gray-600">
              Créez un nouveau business plan avec l'aide de notre IA
            </p>
          </button>

          <button
            onClick={() => navigate('/ChatLLM')}
            className="group bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-left"
          >
            <div className="inline-block p-3 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
              <MessageCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Assistant IA
            </h3>
            <p className="text-gray-600">
              Discutez avec notre IA spécialisée en business plan
            </p>
          </button>

          <button
            onClick={() => navigate('/preview')}
            className="group bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-all duration-300 transform hover:scale-105 text-left"
          >
            <div className="inline-block p-3 bg-green-100 rounded-full mb-4 group-hover:bg-green-200 transition-colors">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Mes Documents
            </h3>
            <p className="text-gray-600">
              Consultez et téléchargez vos business plans
            </p>
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Projets récents */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Projets Récents
                </h2>
                <button
                  onClick={() => navigate('/project-creation')}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Nouveau
                </button>
              </div>

              {projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium text-gray-900">{project.name}</h3>
                          <p className="text-sm text-gray-600">{project.sector} • {project.city}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            project.status === 'Terminé' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-orange-100 text-orange-800'
                          }`}>
                            {project.status}
                          </span>
                          <button
                            onClick={() => navigate('/ChatLLM')}
                            className="text-orange-600 hover:text-orange-700"
                          >
                            Voir
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Aucun projet créé pour le moment</p>
                  <button
                    onClick={() => navigate('/project-creation')}
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Créer mon premier projet
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Conseils et astuces */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Lightbulb className="w-5 h-5 text-yellow-600" />
                <h2 className="text-lg font-semibold text-gray-900">
                  Conseils du Jour
                </h2>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h3 className="font-medium text-orange-900 mb-2">
                    💡 Étude de marché
                  </h3>
                  <p className="text-sm text-orange-700">
                    Une étude de marché approfondie augmente vos chances d'obtenir un financement de 65%.
                  </p>
                </div>
                
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h3 className="font-medium text-blue-900 mb-2">
                    📊 Projections financières
                  </h3>
                  <p className="text-sm text-blue-700">
                    Soyez réaliste dans vos prévisions. Les banques préfèrent des projections conservatrices.
                  </p>
                </div>
                
                <div className="p-4 bg-green-50 rounded-lg">
                  <h3 className="font-medium text-green-900 mb-2">
                    ✅ Documentation
                  </h3>
                  <p className="text-sm text-green-700">
                    Préparez tous vos justificatifs avant votre rendez-vous bancaire.
                  </p>
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Statistiques
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Projets créés</span>
                  <span className="font-semibold text-gray-900">{projects.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Business plans générés</span>
                  <span className="font-semibold text-gray-900">
                    {projects.filter(p => p.status === 'Terminé').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Taux de réussite</span>
                  <span className="font-semibold text-green-600">89%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <img src={logo} alt="Logo" className="w-6 h-6 rounded" />
              <span className="font-bold text-gray-900">Business Plan Generator</span>
            </div>
            <p className="text-gray-600 text-sm">
              © 2024 Business Plan Generator. Votre partenaire pour réussir vos projets.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}