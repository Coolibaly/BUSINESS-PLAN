// =============================
//  src/components/Footer.tsx
// =============================

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Orange Bank Côte d'Ivoire - Générateur de Business Plan
          <br />
          Plateforme d'aide au financement pour jeunes entrepreneurs
        </div>
      </div>
    </footer>
  );
}