// =============================
//  src/hooks/useBusinessPlan.ts
// =============================
import { useState } from 'react';
import { apiClient } from '../config/api';
import type { BusinessPlan, ApiResponse } from '../types';

export function useBusinessPlan() {
  const [plan, setPlan] = useState<BusinessPlan | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generatePlan = async (projectId: number) => {
    setIsLoading(true);
    try {
      const response = await apiClient.request<ApiResponse<BusinessPlan>>('/llm/generate-plan', {
        method: 'POST',
        body: JSON.stringify({ project_id: projectId }),
      });

      if (response.success && response.data) {
        setPlan(response.data);
      }
    } catch (error) {
      console.error('Erreur génération plan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportPDF = async (projectId: number) => {
    try {
      const blob = await apiClient.downloadFile(`/export/pdf?project_id=${projectId}`);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `business-plan-${projectId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur export PDF:', error);
    }
  };

  const exportPPTX = async (projectId: number) => {
    try {
      const blob = await apiClient.downloadFile(`/export/pptx?project_id=${projectId}`);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `business-plan-${projectId}.pptx`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur export PPTX:', error);
    }
  };

  return { plan, generatePlan, exportPDF, exportPPTX, isLoading };
}
