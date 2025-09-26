// src/pages/ProjectCreation.tsx
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Building2, MapPin, DollarSign, FileText, Menu, X } from "lucide-react";
import logo from "../assets/logo.jpeg";

function ProjectCreation() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [project, setProject] = useState({
    secteur: "",
    ville: "",
    financement: "",
    resume: "",
  });

  // Fonction pour gérer les changements dans les champs du formulaire
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProject({ ...project, [e.target.name]: e.target.value });
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Projet créé:", project);
    // Passer les données du projet à la page ChatLLM
    navigate("/ChatLLM", { 
      state: { 
        projectData: project 
      } 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <img src={logo} alt="Logo" className="w-8 h-8 rounded" />
              <span className="text-xl font-bold text-gray-900">Business Plan Generator</span>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-8">
              <button
                onClick={() => navigate("/welcome")}
                className="text-gray-600 hover:text-orange-600 transition-colors"
              >
                Accueil
              </button>
              <button
                onClick={() => navigate("/login")}
                className="text-gray-600 hover:text-orange-600 transition-colors"
              >
                Connexion
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200">
              <div className="flex flex-col space-y-4">
                <button
                  onClick={() => navigate("/welcome")}
                  className="text-left text-gray-600 hover:text-orange-600 transition-colors"
                >
                  Accueil
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="text-left text-gray-600 hover:text-orange-600 transition-colors"
                >
                  Connexion
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
      
      <div className="px-4 py-8">
        <div className="container mx-auto max-w-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-3 bg-orange-100 rounded-full mb-4">
              <img src={logo} alt="Logo" className="w-6 h-6 rounded" />
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Parlez nous de votre projet
            </h1>
            <p className="text-gray-600">
              Quelques informations pour personnaliser votre business plan
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Secteur d'activité */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <Building2 className="w-4 h-4 mr-2 text-orange-600" />
                  Secteur d'activité *
                </label>
                <input
                  type="text"
                  name="secteur"
                  placeholder="Ex: Commerce, Agriculture, Technologie, Services..."
                  value={project.secteur}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  required
                />
              </div>

              {/* Ville */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-orange-600" />
                  Localisation *
                </label>
                <input
                  type="text"
                  name="ville"
                  placeholder="Ex: Abidjan, Dakar, Lomé..."
                  value={project.ville}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  required
                />
              </div>

              {/* Montant de financement */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <DollarSign className="w-4 h-4 mr-2 text-orange-600" />
                  Montant de financement souhaité *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="financement"
                    placeholder="Ex: 5000000"
                    value={project.financement}
                    onChange={handleChange}
                    className="w-full px-4 py-3 pr-16 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    required
                    min="0"
                  />
                  <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">
                    FCFA
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Montant approximatif dont vous avez besoin pour lancer votre projet
                </p>
              </div>

              {/* Résumé du projet */}
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4 mr-2 text-orange-600" />
                  Décrivez brièvement votre projet *
                </label>
                <textarea
                  name="resume"
                  placeholder="Ex: Je veux ouvrir un restaurant de cuisine locale moderne dans le centre ville d'Abidjan, avec un service de livraison..."
                  value={project.resume}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors resize-none"
                  rows={4}
                  required
                  maxLength={500}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-gray-500">
                    Plus vous êtes précis, plus notre IA pourra vous aider efficacement
                  </p>
                  <span className="text-xs text-gray-400">
                    {project.resume.length}/500
                  </span>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  className="group w-full px-8 py-4 bg-orange-600 text-white rounded-xl shadow-lg hover:bg-orange-700 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-2 text-lg font-semibold"
                >
                  Envoyer à l'assistant IA
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                
                <p className="text-center text-xs text-gray-500 mt-4">
                  Vous pourrez modifier ces informations à tout moment
                </p>
              </div>
            </form>
            
            {/* Bouton Retour */}
            <div className="mt-6">
              <button
                onClick={() => navigate("/welcome")}
                className="inline-flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour
              </button>
            </div>
          </div>

          {/* Progress indicator */}
          <div className="mt-8 flex justify-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-2 bg-orange-600 rounded-full"></div>
              <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
              <div className="w-8 h-2 bg-gray-200 rounded-full"></div>
            </div>
            <p className="text-xs text-gray-500 ml-4 self-center">Étape 1 sur 3</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectCreation;