import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="container mx-auto p-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-700 mb-4">
          Welcome to Rayeva AI Modules Dashboard
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          AI-Powered Solutions for Sustainable Commerce
        </p>
        <p className="text-gray-500">
          Rayeva World Pvt Ltd - Internship Project
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Link to="/tagger" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition border-l-4 border-green-500">
          <h2 className="text-2xl font-bold text-green-700 mb-2">
            Module 1: Product Tagger
          </h2>
          <p className="text-gray-600">
            AI-powered product categorization with sustainability filters and SEO tags.
          </p>
        </Link>

        <Link to="/proposal" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition border-l-4 border-green-500">
          <h2 className="text-2xl font-bold text-green-700 mb-2">
            Module 2: B2B Proposal Generator
          </h2>
          <p className="text-gray-600">
            Generate customized bulk purchase proposals for corporate clients.
          </p>
        </Link>

        <Link to="/impact" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition border-l-4 border-green-500">
          <h2 className="text-2xl font-bold text-green-700 mb-2">
            Module 3: Impact Report Generator
          </h2>
          <p className="text-gray-600">
            Calculate and report environmental impact of customer orders.
          </p>
        </Link>

        <Link to="/whatsapp" className="block p-6 bg-white rounded-lg shadow-md hover:shadow-xl transition border-l-4 border-green-500">
          <h2 className="text-2xl font-bold text-green-700 mb-2">
            Module 4: WhatsApp Chatbot
          </h2>
          <p className="text-gray-600">
            Customer service automation via WhatsApp with intent detection.
          </p>
        </Link>
      </div>
    </div>
  );
}

export default Home;
