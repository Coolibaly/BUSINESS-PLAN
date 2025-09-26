import React from 'react';
import { FileText, Download, TrendingUp, DollarSign } from 'lucide-react';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { useBusinessPlan } from '../hooks/useBusinessPlan';

interface PlanPreviewProps {
  projectId?: number;
}

export function PlanPreview({ projectId }: PlanPreviewProps) {
  const { plan, generatePlan, exportPDF, exportPPTX, isLoading } = useBusinessPlan();

  const handleGenerate = () => {
    if (projectId) {
      generatePlan(projectId);
    }
  };

  const handleExportPDF = () => {
    if (projectId) {
      exportPDF(projectId);
    }
  };

  const handleExportPPTX = () => {
    if (projectId) {
      exportPPTX(projectId);
    }
  };

  return (
    <Card title="Aperçu du Business Plan" className="border-l-4 border-l-orange-600">
      {!projectId && (
        <div className="text-center p-6 text-gray-500">
          <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p>Créez un projet pour générer votre business plan</p>
        </div>
      )}

      {projectId && !plan && (
        <div className="text-center p-6">
          <Button
            onClick={handleGenerate}
            isLoading={isLoading}
            size="lg"
            className="w-full"
          >
            <TrendingUp className="w-5 h-5" />
            Générer le Business Plan
          </Button>
        </div>
      )}

      {plan && (
        <div className="space-y-6">
          {/* Score de viabilité */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-orange-800">Score de viabilité</span>
              <span className="text-2xl font-bold text-orange-600">{plan.viability_score}%</span>
            </div>
            <div className="w-full bg-orange-200 rounded-full h-2 mt-2">
              <div 
                className="bg-orange-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${plan.viability_score}%` }}
              ></div>
            </div>
          </div>

          {/* Sections du plan */}
          <div className="space-y-4">
            <Section title="Résumé exécutif" content={plan.plan?.executive_summary} />
            <Section title="Description de l'activité" content={plan.plan?.business_description} />
            
            <Section title="Analyse de marché">
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded">
                {JSON.stringify(plan.plan?.market_analysis, null, 2)}
              </pre>
            </Section>

            <Section title="Plan marketing" content={plan.plan?.marketing_plan} />
            <Section title="Plan opérationnel" content={plan.plan?.operations_plan} />
            <Section title="Plan RH" content={plan.plan?.hr_plan} />

            <Section title="Prévisionnel financier">
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded">
                {JSON.stringify(plan.plan?.financials, null, 2)}
              </pre>
            </Section>

            <Section title="Plan de financement & ROI">
              <pre className="whitespace-pre-wrap text-sm bg-gray-50 p-3 rounded">
                {JSON.stringify({ 
                  financing_plan: plan.plan?.financing_plan, 
                  roi: plan.plan?.roi 
                }, null, 2)}
              </pre>
            </Section>
          </div>

          {/* Actions d'export */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 border-t">
            <Button onClick={handleExportPDF} variant="outline" className="w-full">
              <Download className="w-4 h-4" />
              Télécharger PDF
            </Button>
            
            <Button onClick={handleExportPPTX} variant="outline" className="w-full">
              <Download className="w-4 h-4" />
              Télécharger PPTX
            </Button>
          </div>

          {/* Mise à jour */}
          <Button
            onClick={handleGenerate}
            isLoading={isLoading}
            variant="secondary"
            className="w-full"
          >
            <TrendingUp className="w-4 h-4" />
            Mettre à jour le plan
          </Button>
        </div>
      )}
    </Card>
  );
}

function Section({ title, content, children }: { 
  title: string; 
  content?: string; 
  children?: React.ReactNode; 
}) {
  return (
    <div className="space-y-2">
      <h4 className="font-semibold text-gray-900">{title}</h4>
      {content && <p className="text-sm text-gray-700 leading-relaxed">{content}</p>}
      {children}
    </div>
  );
}
