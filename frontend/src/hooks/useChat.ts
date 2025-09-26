// =============================
//  src/hooks/useChat.ts
// =============================
import { useState } from 'react';
import { apiClient } from '../config/api';
import type { ChatMessage, ApiResponse } from '../types';

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (content: string, projectId?: number) => {
    const userMessage: ChatMessage = { role: 'user', content, timestamp: new Date().toISOString() };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await apiClient.request<ApiResponse<{ response: string }>>('/llm/chat', {
        method: 'POST',
        body: JSON.stringify({ message: content, project_id: projectId }),
      });

      if (response.success && response.data) {
        const assistantMessage: ChatMessage = { 
          role: 'assistant', 
          content: response.data.response,
          timestamp: new Date().toISOString()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Erreur chat:', error);
      const errorMessage: ChatMessage = { 
        role: 'assistant', 
        content: 'Désolé, une erreur est survenue. Réessayez.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return { messages, sendMessage, isLoading };
}

