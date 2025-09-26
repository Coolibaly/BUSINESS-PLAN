// src/utils/businessPlanGenerator.ts
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import type { ProjectData } from "../types";


export const generateDetailedBusinessPlan = (data: ProjectData): string => {
  const financement = Number(data.financement) || 0;
  const investissementInitial = financement * 0.7;
  const fondRoulement = financement * 0.3;
  const chiffreAffairesPrevisionnel = financement * 2;
  const chargesAnnuelles = chiffreAffairesPrevisionnel * 0.6;
  const beneficeNet = chiffreAffairesPrevisionnel - chargesAnnuelles;
  const roiPourcentage = financement > 0 
    ? ((beneficeNet / financement) * 100).toFixed(1) 
    : "0";

  return `<div class="business-plan">
    <div class="bp-header">
      <h1>BUSINESS PLAN PROFESSIONNEL</h1>
      
    </div>

    <div class="bp-section">
      <h3>PRÉSENTATION DU PROJET</h3>
      <div class="bp-info-grid">
        <div class="bp-info-item">
          <strong>Secteur d'activité:</strong> ${data.secteur}
        </div>
        <div class="bp-info-item">
          <strong>Localisation:</strong> ${data.ville}
        </div>
        <div class="bp-info-item">
          <strong>Financement demandé:</strong> <span class="amount">${financement.toLocaleString('fr-FR')} FCFA</span>
        </div>
      </div>
      
      <div class="subsection">
        <h4>Vision</h4>
        <p>Développer une entreprise prospère dans le secteur ${data.secteur.toLowerCase()} à ${data.ville}, en répondant aux besoins du marché local avec des solutions innovantes et de qualité.</p>
      </div>
      <div class="subsection">
        <h4>Mission</h4>
        <p>Offrir des produits/services de qualité supérieure tout en contribuant au développement économique de ${data.ville}.</p>
      </div>
    </div>

    <div class="bp-section">
      <h3>ÉTUDE DE MARCHÉ</h3>
      <div class="subsection">
        <h4>Analyse du secteur ${data.secteur}</h4>
        <ul>
          <li><strong>Potentiel de croissance:</strong> À analyser selon les spécificités du marché local de ${data.ville}</li>
          <li><strong>Concurrence:</strong> Étude de la concurrence directe et indirecte requise</li>
          <li><strong>Tendances:</strong> Évolution du marché et opportunités à identifier</li>
        </ul>
      </div>
      <div class="subsection">
        <h4>Clientèle cible</h4>
        <ul>
          <li>Résidents de ${data.ville} et communes environnantes</li>
          <li>Segments de clientèle à définir selon le secteur ${data.secteur}</li>
          <li>Étude démographique et socio-économique nécessaire</li>
        </ul>
      </div>
    </div>

    <div class="bp-section">
      <h3>STRATÉGIE COMMERCIALE</h3>
      <div class="subsection">
        <h4>Positionnement</h4>
        <ul>
          <li>Qualité et service client d'excellence</li>
          <li>Solutions adaptées aux besoins du marché local</li>
          <li>Prix compétitifs et accessibles</li>
        </ul>
      </div>
      <div class="subsection">
        <h4>Canaux de distribution</h4>
        <ul>
          <li>Vente directe</li>
          <li>Partenariats locaux stratégiques</li>
          <li>Marketing digital et traditionnel</li>
        </ul>
      </div>
    </div>

    <div class="bp-section">
      <h3>PLAN FINANCIER DÉTAILLÉ</h3>
      <div class="financial-summary">
        <div class="financial-item">
          <strong>Montant total requis:</strong> <span class="amount">${financement.toLocaleString('fr-FR')} FCFA</span>
        </div>
      </div>

      <div class="subsection">
        <h4>Répartition des investissements</h4>
        <div class="investment-breakdown">
          <div class="investment-item">
            <strong>Investissement initial:</strong> <span class="amount">${investissementInitial.toLocaleString('fr-FR')} FCFA (70%)</span>
            <ul>
              <li>Équipements et matériel</li>
              <li>Aménagement des locaux</li>
              <li>Stock initial / Matières premières</li>
              <li>Frais d'établissement</li>
            </ul>
          </div>
          <div class="investment-item">
            <strong>Fonds de roulement:</strong> <span class="amount">${fondRoulement.toLocaleString('fr-FR')} FCFA (30%)</span>
            <ul>
              <li>Trésorerie de démarrage</li>
              <li>Frais de fonctionnement (premiers mois)</li>
              <li>Marketing de lancement</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="subsection">
        <h4>Prévisions financières (Année 1)</h4>
        <div class="financial-projections">
          <div class="projection-item">
            <strong>Chiffre d'affaires prévisionnel:</strong> <span class="amount">${chiffreAffairesPrevisionnel.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div class="projection-item">
            <strong>Charges d'exploitation:</strong> <span class="amount">${chargesAnnuelles.toLocaleString('fr-FR')} FCFA</span>
          </div>
          <div class="projection-item highlight">
            <strong>Bénéfice net estimé:</strong> <span class="amount">${beneficeNet.toLocaleString('fr-FR')} FCFA</span>
          </div>
        </div>

        <div class="kpi-section">
          <h4>INDICATEURS CLÉS DE PERFORMANCE</h4>
          <div class="kpi-grid">
            <div class="kpi-item">
              <strong>ROI estimé:</strong> <span class="percentage">${roiPourcentage}%</span>
            </div>
            <div class="kpi-item">
              <strong>Seuil de rentabilité:</strong> À déterminer selon le secteur
            </div>
            <div class="kpi-item">
              <strong>Retour sur investissement:</strong> À calculer précisément
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="bp-section">
      <h3>PROJECTIONS FINANCIÈRES SUR 3 ANS</h3>
      <div class="projection-table">
        <table>
          <thead>
            <tr>
              <th>Année</th>
              <th>Chiffre d'Affaires (FCFA)</th>
              <th>Bénéfices Nets (FCFA)</th>
              <th>ROI (%)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>1</strong></td>
              <td class="amount">${chiffreAffairesPrevisionnel.toLocaleString('fr-FR')}</td>
              <td class="amount">${beneficeNet.toLocaleString('fr-FR')}</td>
              <td class="percentage">${roiPourcentage}%</td>
            </tr>
            <tr>
              <td><strong>2</strong></td>
              <td class="amount">${(chiffreAffairesPrevisionnel * 1.3).toLocaleString('fr-FR')}</td>
              <td class="amount">${(beneficeNet * 1.4).toLocaleString('fr-FR')}</td>
              <td class="percentage">${(parseFloat(roiPourcentage) * 1.4).toFixed(1)}%</td>
            </tr>
            <tr>
              <td><strong>3</strong></td>
              <td class="amount">${(chiffreAffairesPrevisionnel * 1.7).toLocaleString('fr-FR')}</td>
              <td class="amount">${(beneficeNet * 1.8).toLocaleString('fr-FR')}</td>
              <td class="percentage">${(parseFloat(roiPourcentage) * 1.8).toFixed(1)}%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p class="table-note"><em>Projections basées sur une croissance progressive du marché</em></p>
    </div>

    <div class="bp-section">
      <h3>PLAN OPÉRATIONNEL</h3>
      <div class="subsection">
        <h4>Phase de lancement (0-6 mois)</h4>
        <ul>
          <li>Finalisation du financement</li>
          <li>Acquisition des équipements et aménagement</li>
          <li>Recrutement et formation du personnel clé</li>
          <li>Campagne de marketing de lancement</li>
          <li>Mise en place des processus opérationnels</li>
        </ul>
      </div>
      <div class="subsection">
        <h4>Phase de développement (6-18 mois)</h4>
        <ul>
          <li>Montée en charge progressive de l'activité</li>
          <li>Optimisation des processus et de la productivité</li>
          <li>Développement et fidélisation de la clientèle</li>
          <li>Évaluation des performances et ajustements</li>
          <li>Préparation de l'expansion</li>
        </ul>
      </div>
    </div>

    <div class="bp-section">
      <h3>ANALYSE DES RISQUES</h3>
      <div class="risk-analysis">
        <div class="risk-category">
          <h4>Risques identifiés</h4>
          <ul>
            <li><strong>Risque de marché:</strong> Évolution de la demande et concurrence</li>
            <li><strong>Risque financier:</strong> Retards de paiements et problèmes de trésorerie</li>
            <li><strong>Risque opérationnel:</strong> Problèmes d'approvisionnement et de production</li>
            <li><strong>Risque réglementaire:</strong> Changements de législation</li>
          </ul>
        </div>
        <div class="risk-category">
          <h4>Mesures de mitigation</h4>
          <ul>
            <li>Diversification de l'offre produits/services</li>
            <li>Politique de crédit client rigoureuse</li>
            <li>Partenariats multiples avec fournisseurs fiables</li>
            <li>Veille réglementaire et conformité</li>
            <li>Constitution d'un fonds de réserve</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="bp-section">
      <h3>ÉQUIPE ET RESSOURCES HUMAINES</h3>
      <div class="subsection">
        <h4>Structure organisationnelle</h4>
        <ul>
          <li>Direction générale et management</li>
          <li>Équipe opérationnelle selon les besoins du secteur</li>
          <li>Support administratif et comptable</li>
        </ul>
      </div>
      <div class="subsection">
        <h4>Besoins en recrutement</h4>
        <ul>
          <li>Personnel qualifié selon les spécificités du secteur ${data.secteur}</li>
          <li>Formation continue et développement des compétences</li>
          <li>Politique de rémunération motivante</li>
        </ul>
      </div>
    </div>

    <div class="bp-section">
      <h3>CONCLUSION ET RECOMMANDATIONS</h3>
      <div class="conclusion-content">
        <p>Ce projet dans le secteur <strong>${data.secteur}</strong> à <strong>${data.ville}</strong> présente un potentiel intéressant avec un investissement de <strong>${financement.toLocaleString('fr-FR')} FCFA</strong> et un ROI prévisionnel de <strong>${roiPourcentage}%</strong> la première année.</p>
        
        <div class="strengths">
          <h4>Points forts du projet:</h4>
          <ul class="checkmarks">
            <li>Secteur d'activité avec potentiel de croissance</li>
            <li>Localisation stratégique à ${data.ville}</li>
            <li>Financement adapté aux besoins identifiés</li>
            <li>Approche méthodique et planifiée</li>
          </ul>
        </div>

        <div class="recommendations">
          <h4>Recommandations prioritaires:</h4>
          <ul>
            <li><strong>Étude de marché approfondie:</strong> Réaliser une analyse détaillée de la concurrence et de la demande</li>
            <li><strong>Business model précis:</strong> Affiner le modèle économique selon les spécificités du secteur</li>
            <li><strong>Plan de trésorerie:</strong> Établir un plan de trésorerie mensuel détaillé</li>
            <li><strong>Stratégie marketing:</strong> Développer un plan marketing opérationnel</li>
            <li><strong>Suivi des indicateurs:</strong> Mettre en place un tableau de bord de pilotage</li>
          </ul>
        </div>
        
        <div class="next-steps">
          <h4>Prochaines étapes:</h4>
          <ol>
            <li>Compléter les études de marché spécifiques au secteur</li>
            <li>Affiner les projections financières avec des données réelles</li>
            <li>Préparer le dossier de financement complet</li>
            <li>Planifier la phase de lancement opérationnelle</li>
          </ol>
        </div>
      </div>
    </div>
  </div>`;
};

// Fonction pour télécharger en PDF
export async function downloadBusinessPlanAsPDF(content: string, fileName: string) {
  // Créer un conteneur caché dans le DOM pour capturer le rendu
  const element = document.createElement("div");
  element.innerHTML = content;

  // Styles pour un rendu propre
  element.style.position = "fixed";
  element.style.top = "-9999px";
  element.style.left = "-9999px";
  element.style.width = "800px"; // largeur fixe pour la mise en page
  element.style.backgroundColor = "#fff"; // fond blanc opaque
  element.style.color = "#111"; // texte sombre et lisible

  document.body.appendChild(element);

  // Capture en haute résolution pour éviter le flou
  const canvas = await html2canvas(element, {
    scale: 2, // résolution 2x (HD)
    backgroundColor: "#fff",
    useCORS: true,
  });

  const imgData = canvas.toDataURL("image/png", 1.0);
  const pdf = new jsPDF("p", "mm", "a4");

  // Dimensions de l’image par rapport à la page A4
  const imgWidth = 210;
  const pageHeight = 297;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
  heightLeft -= pageHeight;

  // Ajouter d’autres pages si le contenu dépasse 1 page
  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`${fileName}.pdf`);

  // Nettoyer le DOM
  document.body.removeChild(element);
}

// Fonction pour télécharger en PowerPoint
export const downloadBusinessPlanAsPPTX = async (data: ProjectData, projectName: string) => {
  try {
    const PptxGenJS: any = (await import('pptxgenjs')).default;
    const pptx = new PptxGenJS();

    // Calculs financiers
    const financement = Number(data.financement) || 0;
    const investissementInitial = financement * 0.7;
    const fondRoulement = financement * 0.3;
    const chiffreAffairesPrevisionnel = financement * 2;
    const chargesAnnuelles = chiffreAffairesPrevisionnel * 0.6;
    const beneficeNet = chiffreAffairesPrevisionnel - chargesAnnuelles;
    const roiPourcentage = financement > 0 
      ? ((beneficeNet / financement) * 100).toFixed(1) 
      : "0";

    // Slide 1: Page de titre
    const slide1 = pptx.addSlide();
    slide1.addText("BUSINESS PLAN PROFESSIONNEL", { 
      x: 1, y: 2, w: 8, h: 1.5, 
      fontSize: 36, bold: true, align: 'center', color: "#ea580c"
    });
    if (data.resume) {
      slide1.addText(data.resume.split('.')[0], { 
        x: 1, y: 3.5, w: 8, h: 1, 
        fontSize: 24, align: 'center', color: "#374151"
      });
    }

    // Slide 2: Présentation du projet
    const slide2 = pptx.addSlide();
    slide2.addText("PRÉSENTATION DU PROJET", { 
      x: 0.5, y: 0.5, w: 9, h: 0.8, 
      fontSize: 24, bold: true, color: 'ea580c'
    });
    slide2.addText([
      { text: "Secteur d'activité: ", options: { bold: true }},
      { text: data.secteur }
    ], { x: 0.5, y: 1.5, w: 9, h: 0.5, fontSize: 16 });
    
    slide2.addText([
      { text: "Localisation: ", options: { bold: true }},
      { text: data.ville }
    ], { x: 0.5, y: 2, w: 9, h: 0.5, fontSize: 16 });
    
    slide2.addText([
      { text: "Financement demandé: ", options: { bold: true }},
      { text: `${financement.toLocaleString('fr-FR')} FCFA`, options: { color: '059669' }}
    ], { x: 0.5, y: 2.5, w: 9, h: 0.5, fontSize: 16 });

    // Slide 3: Plan financier
    const slide3 = pptx.addSlide();
    slide3.addText("PLAN FINANCIER", { 
      x: 0.5, y: 0.5, w: 9, h: 0.8, 
      fontSize: 24, bold: true, color: 'ea580c'
    });
    
    const tableData = [
      ["Élément", "Montant (FCFA)", "Pourcentage"],
      ["Investissement initial", investissementInitial.toLocaleString('fr-FR'), "70%"],
      ["Fonds de roulement", fondRoulement.toLocaleString('fr-FR'), "30%"],
      ["Total financement", financement.toLocaleString('fr-FR'), "100%"]
    ];
    
    slide3.addTable(tableData, { x: 1, y: 2, w: 8, h: 3 });

    // Slide 4: Projections sur 3 ans
    const slide4 = pptx.addSlide();
    slide4.addText("PROJECTIONS FINANCIÈRES 3 ANS", { 
      x: 0.5, y: 0.5, w: 9, h: 0.8, 
      fontSize: 24, bold: true, color: 'ea580c'
    });
    
    const projectionData = [
      ["Année", "CA (FCFA)", "Bénéfices (FCFA)", "ROI (%)"],
      ["1", chiffreAffairesPrevisionnel.toLocaleString('fr-FR'), beneficeNet.toLocaleString('fr-FR'), `${roiPourcentage}%`],
      ["2", (chiffreAffairesPrevisionnel * 1.3).toLocaleString('fr-FR'), (beneficeNet * 1.4).toLocaleString('fr-FR'), `${(parseFloat(roiPourcentage) * 1.4).toFixed(1)}%`],
      ["3", (chiffreAffairesPrevisionnel * 1.7).toLocaleString('fr-FR'), (beneficeNet * 1.8).toLocaleString('fr-FR'), `${(parseFloat(roiPourcentage) * 1.8).toFixed(1)}%`]
    ];
    
    slide4.addTable(projectionData, { x: 1, y: 2, w: 8, h: 3 });

    // Slide 5: Stratégie commerciale
    const slide5 = pptx.addSlide();
    slide5.addText("STRATÉGIE COMMERCIALE", { 
      x: 0.5, y: 0.5, w: 9, h: 0.8, 
      fontSize: 24, bold: true, color: 'ea580c'
    });
    slide5.addText("• Qualité et service client d'excellence\n• Solutions adaptées au marché local\n• Prix compétitifs et accessibles\n• Partenariats stratégiques\n• Marketing digital et traditionnel", { 
      x: 0.5, y: 1.5, w: 9, h: 4, fontSize: 16 
    });

    // Slide 6: Analyse des risques
    const slide6 = pptx.addSlide();
    slide6.addText("ANALYSE DES RISQUES", { 
      x: 0.5, y: 0.5, w: 9, h: 0.8, 
      fontSize: 24, bold: true, color: 'ea580c'
    });
    slide6.addText("Risques identifiés:\n• Évolution de la demande\n• Concurrence\n• Problèmes de trésorerie\n• Approvisionnement", { 
      x: 0.5, y: 1.5, w: 4, h: 3, fontSize: 14 
    });
    slide6.addText("Mesures de mitigation:\n• Diversification de l'offre\n• Partenariats multiples\n• Fonds de réserve\n• Veille concurrentielle", { 
      x: 5, y: 1.5, w: 4, h: 3, fontSize: 14 
    });

    // Télécharger le fichier PowerPoint
    pptx.writeFile({ fileName: `business-plan-${projectName.replace(/\s+/g, '-').toLowerCase()}.pptx` });
    
  } catch (error) {
    console.error('Erreur lors de la génération du PowerPoint:', error);
    alert('Erreur lors de la génération du PowerPoint. Veuillez réessayer.');
  }
};