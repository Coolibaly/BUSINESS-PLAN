// src/components/ChatHeader.tsx
import { Download, Building2, MapPin, DollarSign, FileText } from "lucide-react";
import type { ProjectData, Message, SavedProject } from "../types";
import { downloadBusinessPlanAsPDF, downloadBusinessPlanAsPPTX } from "../utils/businessPlanGenerator";

interface ChatHeaderProps {
  currentProject: SavedProject | null;
  projectData: ProjectData | null;
  messages: Message[];
  onDownload: () => void;
}

function ChatHeader({ currentProject, projectData, messages }: ChatHeaderProps) {
  // Récupérer le dernier message contenant le business plan (HTML)
  const businessPlanMessage = messages.find((m) => m.isBusinessPlan);

  const handleDownloadPDF = () => {
    if (businessPlanMessage && projectData) {
      downloadBusinessPlanAsPDF(businessPlanMessage.content, projectData.secteur || "projet");
    }
  };

  const handleDownloadPPTX = () => {
    if (projectData) {
      downloadBusinessPlanAsPPTX(projectData, projectData.secteur || "projet");
    }
  };

  return (
    <div className="bg-white shadow-sm border-b p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              {currentProject ? currentProject.name : "Assistant IA Business Plan"}
            </h1>
            <p className="text-sm text-gray-500">
              {currentProject
                ? `Créé le ${new Date(currentProject.createdAt).toLocaleDateString("fr-FR")}`
                : "Spécialiste en business plan"}
            </p>
          </div>
        </div>

        {/* Boutons de téléchargement */}
        {businessPlanMessage && (
          <div className="flex gap-2">
            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-3 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
            <button
              onClick={handleDownloadPPTX}
              className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              PowerPoint
            </button>
          </div>
        )}
      </div>

      {/* Informations du projet */}
      {projectData && (
        <div className="mt-4 p-3 bg-orange-50 rounded-lg">
          <div className="text-sm text-orange-800 mb-2 font-medium">
            Projet en cours d'analyse :
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div className="flex items-center gap-1">
              <Building2 className="w-3 h-3 text-orange-600" />
              <span className="font-medium">Secteur:</span>
              <span>{projectData.secteur}</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-orange-600" />
              <span className="font-medium">Ville:</span>
              <span>{projectData.ville}</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-3 h-3 text-orange-600" />
              <span className="font-medium">Budget:</span>
              <span>
                {Number(projectData.financement || 0).toLocaleString("fr-FR")} FCFA
              </span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-3 h-3 text-orange-600" />
              <span className="font-medium">Résumé:</span>
              <span className="truncate" title={projectData.resume}>
                {projectData.resume && projectData.resume.length > 30
                  ? `${projectData.resume.substring(0, 30)}...`
                  : projectData.resume}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatHeader;