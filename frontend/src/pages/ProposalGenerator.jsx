import { useState } from 'react';
import apiClient from '../api/client';
import JsonDisplay from '../components/JsonDisplay';

function ProposalGenerator() {
  const [formData, setFormData] = useState({
    client_name: '',
    industry: '',
    budget: '',
    num_employees: '',
    preferences: ''
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        ...formData,
        budget: parseFloat(formData.budget),
        num_employees: parseInt(formData.num_employees),
        preferences: formData.preferences.split(',').map(p => p.trim()).filter(p => p)
      };

      const response = await apiClient.post('/api/generate-proposal', payload);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <h1 className="text-3xl font-bold text-green-700 mb-6">B2B Proposal Generator</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Client Name</label>
          <input
            type="text"
            value={formData.client_name}
            onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Industry</label>
          <input
            type="text"
            value={formData.industry}
            onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="e.g., Technology, Healthcare"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Budget (INR)</label>
          <input
            type="number"
            value={formData.budget}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">Number of Employees</label>
          <input
            type="number"
            value={formData.num_employees}
            onChange={(e) => setFormData({ ...formData, num_employees: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Preferences (comma-separated)
          </label>
          <input
            type="text"
            value={formData.preferences}
            onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            placeholder="e.g., plastic-free, vegan, recycled"
          />
          <p className="text-sm text-gray-500 mt-1">
            Enter preferences separated by commas
          </p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition"
        >
          {loading ? 'Generating Proposal...' : 'Generate Proposal'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {result && <JsonDisplay data={result} title="Generated Proposal" />}
    </div>
  );
}

export default ProposalGenerator;
