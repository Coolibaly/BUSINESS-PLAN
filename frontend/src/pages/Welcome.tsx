// src/pages/Welcome.tsx
import { useNavigate } from "react-router-dom";
import { ArrowRight, Target, Brain, FileText, CheckCircle, Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "../assets/logo.jpeg";

function Welcome() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const features = [
    {
      icon: Target,
      title: "Comprendre le fonctionnement",
      description: "Découvrez comment notre IA vous accompagne dans la création de votre business plan"
    },
    {
      icon: FileText,
      title: "Créer votre projet", 
      description: "Renseignez les informations essentielles de votre projet entrepreneurial"
    },
    {
      icon: Brain,
      title: "Affiner avec l'assistant IA",
      description: "Dialoguez avec notre IA pour préciser et améliorer votre business plan"
    },
    {
      icon: CheckCircle,
      title: "Obtenir votre business plan complet",
      description: "Téléchargez un document professionnel prêt à être présenté"
    }
  ];

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
              <a href="#fonctionnalites" className="text-gray-600 hover:text-orange-600 transition-colors">Fonctionnalités</a>
              <a href="#apropos" className="text-gray-600 hover:text-orange-600 transition-colors">À propos</a>
              <a href="#contact" className="text-gray-600 hover:text-orange-600 transition-colors">Contact</a>
              <button
                onClick={() => navigate("/login")}
                className="text-gray-600 hover:text-orange-600 transition-colors"
              >
                Connexion
              </button>
              <button
                onClick={() => navigate("/create-project")}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                Commencer
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
                <a href="#fonctionnalites" className="text-gray-600 hover:text-orange-600 transition-colors">Fonctionnalités</a>
                <a href="#apropos" className="text-gray-600 hover:text-orange-600 transition-colors">À propos</a>
                <a href="#contact" className="text-gray-600 hover:text-orange-600 transition-colors">Contact</a>
                <button
                  onClick={() => navigate("/login")}
                  className="text-left text-gray-600 hover:text-orange-600 transition-colors"
                >
                  Connexion
                </button>
                <button
                  onClick={() => navigate("/create-project")}
                  className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors w-fit"
                >
                  Commencer
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-16">
          <div className="inline-block p-3 bg-orange-100 rounded-full mb-6">
            <img src={logo} alt="Logo" className="w-8 h-8 rounded" />
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Générateur de <span className="text-orange-600">Business Plan</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Créez votre business plan professionnel en quelques minutes grâce à notre assistant IA. 
            Simple, rapide et adapté au marché africain.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-center w-12 h-12 bg-orange-100 rounded-lg mb-4">
                <feature.icon className="w-6 h-6 text-orange-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 lg:p-12 max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Prêt à lancer votre projet ?
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Rejoignez des milliers d'entrepreneurs qui ont fait confiance à notre plateforme 
              pour concrétiser leurs idées d'affaires.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => navigate("/create-project")}
                className="group px-8 py-4 bg-orange-600 text-white rounded-xl shadow-lg hover:bg-orange-700 transition-all duration-300 transform hover:scale-105 flex items-center gap-2 text-lg font-semibold"
              >
                Commencer maintenant
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <div className="text-sm text-gray-500 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Gratuit • Sans engagement • Résultats immédiats
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <img src={logo} alt="Logo" className="w-8 h-8 rounded" />
                <span className="text-xl font-bold text-gray-900">Business Plan Generator</span>
              </div>
              <p className="text-gray-600 mb-4">
                Créez votre business plan professionnel en quelques minutes grâce à notre assistant IA spécialement conçu pour le marché africain.
              </p>
              <div className="text-sm text-gray-500">
                © 2024 Business Plan Generator. Tous droits réservés.
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Fonctionnalités</h3>
              <ul className="space-y-2 text-gray-600">
                <li>Assistant IA</li>
                <li>Templates personnalisés</li>
                <li>Export PDF</li>
                <li>Support 24/7</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-4">Contact</h3>
              <ul className="space-y-2 text-gray-600">
                <li>support@businessplan.com</li>
                <li>+225 XX XX XX XX</li>
                <li>Abidjan, Côte d'Ivoire</li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Welcome;