import React from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const DownloadPDFButton: React.FC = () => {
  const downloadPDF = async () => {
    const element = document.getElementById("business-plan");
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#fff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    const imgProps = pdf.getImageProperties(imgData);
    const imgWidth = pdfWidth;
    const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Première page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Ajout des pages suivantes
    while (heightLeft > 0) {
      position = heightLeft - imgHeight; // corrige le décalage
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    pdf.save("business-plan.pdf");
  };

  return (
    <button
      onClick={downloadPDF}
      className="px-4 py-2 bg-black text-white rounded"
    >
      Télécharger le Business Plan (PDF)
    </button>
  );
};

export default DownloadPDFButton;
