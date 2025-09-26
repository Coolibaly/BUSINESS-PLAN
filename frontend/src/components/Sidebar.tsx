// src/components/Sidebar.tsx
import { User, Menu, X, MessageCircle, Folder, Settings, LogOut, Building2, MapPin, Trash2, Plus } from 'lucide-react';
import type { SavedProject } from '../types';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  savedProjects: SavedProject[];
  currentProject: SavedProject | null;
  onLoadProject: (project: SavedProject) => void;
  onDeleteProject: (projectId: string) => void;
  navigate: (path: string) => void;
}

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
  savedProjects,
  currentProject,
  onLoadProject,
  onDeleteProject,
  navigate
}: SidebarProps) {
  
  // Récupérer les données utilisateur du localStorage ou d'un contexte
  const userData = {
    name: localStorage.getItem('userName') || 'Utilisateur',
    email: localStorage.getItem('userEmail') || 'user@example.com',

  };

  return (
    <div className={`${sidebarOpen ? 'w-80' : 'w-16'} transition-all duration-300 bg-white shadow-lg flex flex-col`}>
      {/* Header du sidebar */}
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {sidebarOpen && (
            <h2 className="text-lg font-semibold text-gray-800">Assistant IA</h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Profil utilisateur */}
      {sidebarOpen && (
        <div className="p-4 border-b bg-orange-50">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {userData.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {userData.email}
              </p>
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto p-4">
        {sidebarOpen ? (
          <>
            {/* Bouton créer nouveau projet */}
            <div className="mb-4">
              <button
                onClick={() => navigate('/project-creation')}
                className="w-full flex items-center gap-2 p-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Nouveau projet
              </button>
            </div>

            {/* Projets sauvegardés */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center">
                <Folder className="w-4 h-4 mr-2" />
                Mes projets ({savedProjects.length})
              </h3>
              {savedProjects.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  <p className="text-sm">Aucun projet créé</p>
                  <p className="text-xs mt-1">Créez votre premier projet</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {savedProjects.map((project) => (
                    <div
                      key={project.id}
                      className={`group relative p-3 rounded-lg border transition-colors ${
                        currentProject?.id === project.id
                          ? 'bg-orange-100 border-orange-200'
                          : 'hover:bg-gray-50 border-gray-200'
                      }`}
                    >
                      <button
                        onClick={() => onLoadProject(project)}
                        className="w-full text-left"
                      >
                        <div className="font-medium text-sm text-gray-900 mb-1">
                          {project.name}
                        </div>
                        <div className="flex items-center text-xs text-gray-500 space-x-3">
                          <span className="flex items-center">
                            <Building2 className="w-3 h-3 mr-1" />
                            {project.data.secteur}
                          </span>
                          <span className="flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {project.data.ville}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {project.lastModified.toLocaleDateString('fr-FR')}
                        </div>
                      </button>
                      
                      {/* Bouton supprimer */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (window.confirm('Êtes-vous sûr de vouloir supprimer ce projet ?')) {
                            onDeleteProject(project.id);
                          }
                        }}
                        className="absolute top-2 right-2 p-1 opacity-0 group-hover:opacity-100 hover:bg-red-100 rounded transition-opacity"
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

         
          </>
        ) : (
          <div className="space-y-4">
            <button 
              onClick={() => navigate('/project-creation')}
              className="p-3 w-full hover:bg-orange-100 rounded-lg"
            >
              <Plus className="w-5 h-5 mx-auto text-orange-600" />
            </button>
            <button className="p-3 w-full hover:bg-gray-100 rounded-lg">
              <Folder className="w-5 h-5 mx-auto" />
            </button>
            <button className="p-3 w-full hover:bg-gray-100 rounded-lg">
              <MessageCircle className="w-5 h-5 mx-auto" />
            </button>
          </div>
        )}
      </div>

      {/* Actions du bas */}
      {sidebarOpen && (
        <div className="p-4 border-t">
          <div className="space-y-2">
            <button className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg">
              <Settings className="w-4 h-4 mr-3" />
              Paramètres
            </button>
            <button 
              onClick={() => {
                localStorage.clear();
                navigate('/');
              }}
              className="w-full flex items-center px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Se déconnecter
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Sidebar;