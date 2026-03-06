import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-green-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          Rayeva AI 🌱
        </Link>
        <div className="space-x-6">
          <Link to="/" className="hover:text-green-200 transition">Home</Link>
          <Link to="/tagger" className="hover:text-green-200 transition">Product Tagger</Link>
          <Link to="/proposal" className="hover:text-green-200 transition">B2B Proposals</Link>
          <Link to="/impact" className="hover:text-green-200 transition">Impact Reports</Link>
          <Link to="/whatsapp" className="hover:text-green-200 transition">WhatsApp Bot</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
