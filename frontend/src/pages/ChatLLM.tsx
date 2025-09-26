// src/pages/ChatLLM.tsx
import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Send, Mic } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import ChatHeader from '../components/ChatHeader';
import MessageList from '../components/MessageList';
import type { ProjectData, Message, SavedProject } from '../types';
import { generateDetailedBusinessPlan } from '../utils/businessPlanGenerator';
import { generateContextualResponse } from '../utils/responseGenerator';
import './ChatLLM.css';

function ChatLLM() {
  const location = useLocation();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [projectData, setProjectData] = useState<ProjectData | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [savedProjects, setSavedProjects] = useState<SavedProject[]>([]);
  const [currentProject, setCurrentProject] = useState<SavedProject | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Récupérer les données du projet depuis la navigation (corrigé pour éviter duplication)
  useEffect(() => {
    const state = location.state as { projectData?: ProjectData };

    if (state?.projectData) {
      const exists = savedProjects.some(
        p =>
          p.data.secteur === state.projectData?.secteur &&
          p.data.ville === state.projectData?.ville &&
          p.data.financement === state.projectData?.financement &&
          p.data.resume === state.projectData?.resume
      );

      if (!exists) {
        const newProject: SavedProject = {
          id: Date.now().toString(),
          name: `${state.projectData.secteur} - ${state.projectData.ville}`,
          data: state.projectData,
          createdAt: new Date(),
          lastModified: new Date()
        };

        setSavedProjects(prev => [...prev, newProject]);
        loadProject(newProject);
      }
    }
  }, [location.state, savedProjects]);

  // Auto-scroll vers le bas
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Charger un projet
  const loadProject = (project: SavedProject) => {
    setCurrentProject(project);
    setProjectData(project.data);
    setMessages([]);
    generateBusinessPlan(project.data);
  };

  // Supprimer un projet
  const deleteProject = (projectId: string) => {
    setSavedProjects(prev => prev.filter(p => p.id !== projectId));
    if (currentProject?.id === projectId) {
      setCurrentProject(null);
      setProjectData(null);
      setMessages([]);
    }
  };

  // Génération automatique du business plan
  const generateBusinessPlan = async (data: ProjectData) => {
    setIsLoading(true);
    
    const welcomeMessage: Message = {
      id: Date.now().toString(),
      content: `Bonjour ! J'ai bien reçu les informations de votre projet. Je vais maintenant analyser vos données et générer un business plan professionnel complet pour votre projet dans le secteur "${data.secteur}" à "${data.ville}".`,
      isUser: false,
      timestamp: new Date()
    };

    setMessages([welcomeMessage]);

    await new Promise(resolve => setTimeout(resolve, 2000));

    const businessPlan = generateDetailedBusinessPlan(data);
    
    const businessPlanMessage: Message = {
      id: (Date.now() + 1).toString(),
      content: businessPlan,
      isUser: false,
      timestamp: new Date(),
      isBusinessPlan: true
    };

    setMessages(prev => [...prev, businessPlanMessage]);
    setIsLoading(false);
  };

  // Envoi de message utilisateur
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    await new Promise(resolve => setTimeout(resolve, 1000));

    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      content: generateContextualResponse(inputMessage),
      isUser: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiResponse]);
    setIsLoading(false);
  };

  // Télécharger le business plan
  const handleDownload = () => {
    const businessPlanMessage = messages.find(m => m.isBusinessPlan);
    if (businessPlanMessage) {
      const element = document.createElement('a');
      const file = new Blob([businessPlanMessage.content.replace(/<[^>]*>/g, '')], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `Business_Plan_${projectData?.secteur}_${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        savedProjects={savedProjects}
        currentProject={currentProject}
        onLoadProject={loadProject}
        onDeleteProject={deleteProject}
        navigate={navigate}
      />

      <div className="flex-1 flex flex-col">
        <ChatHeader
          currentProject={currentProject}
          projectData={projectData}
          messages={messages}
          onDownload={handleDownload}
        />

        <MessageList
          messages={messages}
          isLoading={isLoading}
          projectData={projectData}
          messagesEndRef={messagesEndRef}
          navigate={navigate}
        />

        {projectData && (
          <div className="border-t bg-white p-4">
            <div className="flex items-center gap-3 max-w-4xl mx-auto">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Posez vos questions sur votre business plan..."
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  disabled={isLoading}
                />
                <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <Mic className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="p-3 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatLLM;
