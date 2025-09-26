import React, { useState } from 'react';
import { MapPin, DollarSign, Briefcase } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { Card } from './ui/Card';
import { useProject } from '../hooks/useProject';

const SECTORS = [
  { value: 'agriculture', label: 'Agriculture' },
  { value: 'commerce', label: 'Commerce' },
  { value: 'artisanat', label: 'Artisanat' },
  { value: 'services', label: 'Services' },
  { value: 'technologie', label: 'Technologie' },
  { value: 'restauration', label: 'Restauration' },
];

const CITIES = [
  { value: 'abidjan', label: 'Abidjan' },
  { value: 'bouake', label: 'Bouaké' },
  { value: 'yamoussoukro', label: 'Yamoussoukro' },
  { value: 'korhogo', label: 'Korhogo' },
  { value: 'san-pedro', label: 'San-Pédro' },
  { value: 'daloa', label: 'Daloa' },
];

interface ProjectFormProps {
  projectId?: number;
  onProjectId: (id: number) => void;
}

export function ProjectForm({ projectId, onProjectId }: ProjectFormProps) {
  const { createProject, isLoading } = useProject();
  const [formData, setFormData] = useState({
    sector: '',
    city: '',
    funding_amount: '',
    business_summary: '',
    target_radius: '10',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const id = await createProject({
        sector: formData.sector,
        city: formData.city,
        funding_amount: parseInt(formData.funding_amount),
        business_summary: formData.business_summary,
        target_radius: parseInt(formData.target_radius),
      });
      
      onProjectId(id);
    } catch (error) {
      console.error('Erreur création projet:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <Card title="Nouveau Projet" className="border-l-4 border-l-orange-600">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Secteur d'activité"
            name="sector"
            value={formData.sector}
            onChange={handleChange}
            options={[{ value: '', label: 'Choisir un secteur' }, ...SECTORS]}
            required
          />
          
          <Select
            label="Ville"
            name="city"
            value={formData.city}
            onChange={handleChange}
            options={[{ value: '', label: 'Choisir une ville' }, ...CITIES]}
            required
          />
        </div>

        <Input
          label="Montant de financement (FCFA)"
          type="number"
          name="funding_amount"
          value={formData.funding_amount}
          onChange={handleChange}
          placeholder="500000"
          required
        />

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Résumé du projet
          </label>
          <textarea
            name="business_summary"
            value={formData.business_summary}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
            placeholder="Décrivez votre projet en quelques lignes..."
            required
          />
        </div>

        <Input
          label="Rayon de marché cible (km)"
          type="number"
          name="target_radius"
          value={formData.target_radius}
          onChange={handleChange}
          placeholder="10"
          min="1"
          max="100"
          required
        />

        <Button
          type="submit"
          isLoading={isLoading}
          className="w-full"
          size="lg"
        >
          <Briefcase className="w-5 h-5" />
          {projectId ? 'Projet créé' : 'Créer le projet'}
        </Button>

        {projectId && (
          <div className="text-center text-sm text-green-600 bg-green-50 p-3 rounded-lg">
            Projet #{projectId} créé avec succès
          </div>
        )}
      </form>
    </Card>
  );
}
