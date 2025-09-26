// =============================
//  src/hooks/useProject.ts
// =============================
import { useState } from 'react';
import { apiClient } from '../config/api';
import type { Project, ApiResponse } from '../types';

export function useProject() {
  const [isLoading, setIsLoading] = useState(false);

  const createProject = async (projectData: Omit<Project, 'id'>): Promise<number> => {
    setIsLoading(true);
    try {
      const response = await apiClient.request<ApiResponse<{ id: number }>>('/projects', {
        method: 'POST',
        body: JSON.stringify(projectData),
      });
      
      if (!response.success || !response.data) {
        throw new Error(response.message || 'Erreur lors de la création du projet');
      }
      
      return response.data.id;
    } finally {
      setIsLoading(false);
    }
  };

  return { createProject, isLoading };
}