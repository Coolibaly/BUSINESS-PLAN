// src/components/MessageList.tsx
import type { RefObject } from 'react';
import type { Message, ProjectData } from '../types';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  projectData: ProjectData | null;
  messagesEndRef: RefObject<HTMLDivElement>;
  navigate: (path: string) => void;
}

function MessageList({
  messages,
  isLoading,
  projectData,
  messagesEndRef,
  navigate,
}: MessageListProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {!projectData && (
        <div className="text-center py-8">
          <div className="bg-orange-100 p-6 rounded-lg max-w-md mx-auto">
            <p className="text-orange-800 font-medium mb-2">
              Aucun projet sélectionné
            </p>
            <p className="text-sm text-orange-600 mb-4">
              Créez un nouveau projet ou sélectionnez un projet existant dans le
              menu latéral pour commencer à analyser votre business plan.
            </p>
            <button
              onClick={() => navigate('/project-creation')}
              className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
            >
              Créer un nouveau projet
            </button>
          </div>
        </div>
      )}

      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-4xl p-4 rounded-2xl ${
              message.isUser
                ? 'bg-orange-600 text-white'
                : message.isBusinessPlan
                ? 'bg-white shadow-lg border business-plan-container'
                : 'bg-gray-100 text-gray-900'
            }`}
          >
            {message.isBusinessPlan ? (
              <div
                dangerouslySetInnerHTML={{
                  __html: String(message.content),
                }}
                className="business-plan-content"
              />
            ) : (
              <div className="whitespace-pre-line">
                {String(message.content)}
              </div>
            )}
            <div
              className={`text-xs mt-3 ${
                message.isUser ? 'text-orange-100' : 'text-gray-500'
              }`}
            >
              {message.timestamp.toLocaleTimeString('fr-FR', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
          </div>
        </div>
      ))}

      {isLoading && (
        <div className="flex justify-start">
          <div className="bg-gray-100 p-4 rounded-2xl">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-75"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse delay-150"></div>
              <span className="ml-2 text-gray-600">
                L&apos;IA analyse votre projet...
              </span>
            </div>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;
