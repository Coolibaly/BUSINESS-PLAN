function Preview() {
  const handleDownload = (type: string) => {
    alert(`Téléchargement du fichier ${type}...`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-orange-50 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl w-full text-center">
        <h2 className="text-2xl font-bold text-orange-600 mb-4">Aperçu du Business Plan</h2>
        <p className="text-gray-600 mb-6">
          Voici votre business plan généré. Vous pouvez maintenant le télécharger :
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => handleDownload("PDF")}
            className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          >
            Télécharger en PDF
          </button>
          <button
            onClick={() => handleDownload("PowerPoint")}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Télécharger en PowerPoint
          </button>
        </div>
      </div>
    </div>
  );
}

export default Preview;
