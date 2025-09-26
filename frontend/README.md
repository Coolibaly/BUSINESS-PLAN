# Générateur de Business Plan - Orange Bank CI

Interface React moderne pour la génération automatique de business plans bancaires destinés aux jeunes entrepreneurs en Côte d'Ivoire.

##  Fonctionnalités

- **Création de projet** : Formulaire dynamique avec secteurs et villes ivoiriennes
- **Chat IA** : Interaction texte et vocale avec l'assistant LLM
- **Génération automatique** : Business plan complet avec score de viabilité
- **Export multiple** : Téléchargement PDF et PowerPoint
- **Interface responsive** : Design adapté mobile et desktop
- **Thème Orange Bank** : Couleurs et identité visuelle officielles

##  Stack Technique

- **React 18** + TypeScript
- **Tailwind CSS** - Styling moderne
- **Lucide React** - Icônes
- **Vite** - Build tool rapide
- **Web Speech API** - Reconnaissance vocale

##  Installation

```bash
# Cloner le projet
git clone <votre-repo>
cd business-plan-frontend

# Installer les dépendances
npm install

# Configurer l'environnement
cp .env.example .env
# Modifier VITE_API_BASE avec l'URL de votre backend

# Lancer en développement
npm run dev
```

##  Structure du Projet

```
src/
├── components/          # Composants React
│   ├── ui/             # Composants UI réutilisables
│   ├── ChatLLM.tsx     # Interface de chat
│   ├── ProjectForm.tsx # Formulaire de création
│   ├── PlanPreview.tsx # Aperçu du plan
│   └── ...
├── hooks/              # Hooks personnalisés
│   ├── useChat.ts      # Gestion du chat
│   ├── useProject.ts   # Gestion des projets
│   └── ...
├── pages/              # Pages de l'application
├── types/              # Types TypeScript
├── config/             # Configuration API
└── App.tsx            # Composant principal
```

##  API Backend

L'application communique avec le backend FastAPI via les endpoints :

- `POST /projects` - Création de projet
- `POST /llm/chat` - Chat avec l'IA
- `POST /llm/generate-plan` - Génération du plan
- `GET /export/pdf` - Export PDF
- `GET /export/pptx` - Export PowerPoint

##  Personnalisation

Les couleurs Orange Bank sont définies dans `tailwind.config.js` et `src/index.css`. 
Modifiez ces fichiers pour adapter l'identité visuelle.

## 📱 Responsive Design

L'interface s'adapte automatiquement :
- **Desktop** : Layout 2 colonnes
- **Tablet** : Layout empilé
- **Mobile** : Interface optimisée tactile

##  Authentification

L'app vérifie la présence des tokens dans localStorage :
- `access_token` - Token JWT
- `username` - Nom utilisateur

Si absents, redirection vers la page de connexion.

##  Production

```bash
# Build de production
npm run build

# Prévisualisation
npm run preview
```

##  Contribution

1. Fork le projet
2. Créer une branche feature
3. Commit les changements
4. Push vers la branche
5. Ouvrir une Pull Request
