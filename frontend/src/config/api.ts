
// =============================
//  src/config/api.ts
// =============================
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';

export const apiClient = {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  },

  async downloadFile(endpoint: string): Promise<Blob> {
    const token = localStorage.getItem('access_token');
    
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      throw new Error(`Download Error: ${response.status}`);
    }

    return response.blob();
  }
};