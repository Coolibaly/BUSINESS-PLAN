// =============================
// src/components/Tips.tsx
// =============================
import { Lightbulb, MessageCircle, FileText, Download } from 'lucide-react';
import { Card } from './ui/Card';

export function Tips() {
  const tips = [
    {
      icon: MessageCircle,
      title: 'Utilisez la voix',
      description: 'Dictez votre projet rapidement grâce à la reconnaissance vocale.',
    },
    {
      icon: FileText,
      title: 'Plan automatique',
      description: 'Générez un business plan professionnel en quelques clics.',
    },
    {
      icon: Download,
      title: 'Export multiple',
      description: 'Téléchargez votre plan en PDF ou PowerPoint.',
    },
  ];

  return (
    <Card title="Conseils d'utilisation" className="border-l-4 border-l-orange-600">
      <div className="space-y-4">
        {tips.map((tip, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <tip.icon className="w-4 h-4 text-orange-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">{tip.title}</h4>
              <p className="text-sm text-gray-600">{tip.description}</p>
            </div>
          </div>
        ))}
        
        <div className="mt-6 p-4 bg-orange-50 rounded-lg">
          <div className="flex items-start gap-2">
            <Lightbulb className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-orange-800">
                <strong>Astuce :</strong> Après la génération du plan, revenez dans le chat 
                pour affiner votre étude de marché et vos hypothèses financières.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
