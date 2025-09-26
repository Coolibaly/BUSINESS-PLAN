// src/utils/responseGenerator.ts

export const generateContextualResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase();
  
  // Réponses sur les modifications du business plan
  if (lowerMessage.includes('modification') || lowerMessage.includes('changer') || lowerMessage.includes('modifier')) {
    return "Je peux vous aider à modifier certains aspects de votre business plan. Que souhaitez-vous ajuster spécifiquement ?\n\n• Les projections financières\n• La stratégie commerciale\n• L'analyse de marché\n• Le plan opérationnel\n• L'analyse des risques\n\nPrécisez-moi la section qui vous intéresse et les changements souhaités.";
  }
  
  // Réponses sur le financement et les banques
  if (lowerMessage.includes('financement') || lowerMessage.includes('banque') || lowerMessage.includes('prêt')) {
    return "Pour présenter votre dossier de financement aux institutions financières, voici les documents essentiels à préparer :\n\n📋 **Documents requis :**\n• Ce business plan complet\n• Vos documents d'identité\n• CV détaillé du porteur de projet\n• Justificatifs de garanties (si disponibles)\n• Relevés bancaires personnels\n• Attestations de domicile et de revenus\n\n💡 **Conseils pour la présentation :**\n• Maîtrisez parfaitement votre projet\n• Préparez-vous aux questions sur la rentabilité\n• Montrez votre engagement personnel\n\nSouhaitez-vous que je vous aide à préparer votre pitch de présentation ?";
  }
  
  // Réponses sur les risques
  if (lowerMessage.includes('risque') || lowerMessage.includes('problème') || lowerMessage.includes('difficulté')) {
    return "L'analyse des risques est cruciale pour la réussite de votre projet. Voici les principaux domaines à surveiller :\n\n⚠️ **Risques identifiés :**\n• **Marché :** Évolution de la demande, concurrence\n• **Financier :** Trésorerie, retards de paiement\n• **Opérationnel :** Approvisionnement, personnel\n• **Réglementaire :** Changements de lois\n\n✅ **Stratégies de mitigation :**\n• Diversification des sources de revenus\n• Constitution d'un fonds de réserve\n• Partenariats solides\n• Veille concurrentielle\n\nSur quel risque spécifique souhaitez-vous approfondir l'analyse ?";
  }
  
  // Réponses sur le marketing
  if (lowerMessage.includes('marketing') || lowerMessage.includes('client') || lowerMessage.includes('vente')) {
    return "La stratégie marketing est essentielle pour développer votre clientèle. Voici mes recommandations :\n\n🎯 **Stratégies recommandées :**\n• **Marketing digital :** Réseaux sociaux, site web, référencement local\n• **Marketing traditionnel :** Flyers, radio locale, partenariats\n• **Marketing relationnel :** Fidélisation, parrainage, événements\n\n📊 **Actions prioritaires :**\n• Définir votre clientèle cible précisément\n• Créer une identité visuelle forte\n• Développer une présence en ligne\n• Mettre en place un système de suivi client\n\nQuel aspect du marketing vous intéresse le plus ?";
  }
  
  // Réponses sur les projections financières
  if (lowerMessage.includes('chiffre') || lowerMessage.includes('finance') || lowerMessage.includes('rentabilité') || lowerMessage.includes('bénéfice')) {
    return "Les projections financières sont le cœur de votre business plan. Voici les éléments clés à retenir :\n\n💰 **Points d'attention :**\n• Les projections sont basées sur des hypothèses moyennes\n• Elles doivent être affinées avec des données de marché réelles\n• Le seuil de rentabilité dépend de votre secteur d'activité\n• La trésorerie mensuelle doit être suivie de près\n\n📈 **Recommandations :**\n• Préparez des scénarios optimiste, réaliste et pessimiste\n• Planifiez votre trésorerie mois par mois\n• Identifiez vos coûts fixes et variables\n• Prévoyez une marge de sécurité\n\nVoulez-vous que nous détaillions un aspect financier particulier ?";
  }
  
  // Réponses sur la concurrence
  if (lowerMessage.includes('concurrence') || lowerMessage.includes('concurrent') || lowerMessage.includes('marché')) {
    return "L'analyse concurrentielle est fondamentale pour positionner votre projet. Voici comment procéder :\n\n🔍 **Analyse à réaliser :**\n• **Concurrence directe :** Mêmes produits/services, même zone\n• **Concurrence indirecte :** Solutions alternatives pour vos clients\n• **Analyse SWOT :** Forces, faiblesses, opportunités, menaces\n\n📋 **Éléments à étudier :**\n• Prix pratiqués par la concurrence\n• Qualité des produits/services offerts\n• Stratégies marketing utilisées\n• Points forts et faiblesses identifiés\n\n💡 **Votre différenciation :**\nIdentifiez ce qui vous rendra unique sur votre marché !\n\nSur quel aspect de la concurrence souhaitez-vous plus d'informations ?";
  }
  
  // Réponse générale par défaut
  return "Je suis votre assistant spécialisé en business plan et développement d'entreprise. Je peux vous aider sur tous les aspects de votre projet :\n\n🎯 **Mes domaines d'expertise :**\n• Analyse et amélioration du business plan\n• Projections financières et rentabilité\n• Stratégies marketing et commerciales\n• Gestion des risques et solutions\n• Préparation des dossiers de financement\n• Conseils opérationnels et organisationnels\n\nN'hésitez pas à me poser des questions spécifiques sur votre projet. Plus vous serez précis, plus mes conseils seront adaptés à votre situation !";
};