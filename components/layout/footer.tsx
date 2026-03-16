import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white py-8 border-t border-gray-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="flex items-center space-x-3 mb-4">
          <img
            src="/images/logo.jpg"
            alt="Cool Shot Systems Logo"
            className="h-8 w-auto object-contain rounded-sm grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
            data-testid="img-footer-logo"
          />
          <h3 className="text-xl font-bold text-gray-400 tracking-tight">CSSLab</h3>
        </div>
        <p className="text-gray-500 text-center max-w-sm mb-4">
          The Web Engineering Playground. Write, preview, and share your web experiments.
        </p>
        <div className="border-t border-gray-800 w-full max-w-md pt-4 text-center text-gray-500">
          <p>Built by <a href="https://wa.me/2348075614248" className="text-blue-400 hover:text-blue-300 transition-colors">Cool Shot Systems</a> / Heritage Oladoye</p>
          <p className="mt-1">&copy; 2024 Cool Shot Systems. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
