import { useState } from 'react';
import apiClient from '../api/client';
import JsonDisplay from '../components/JsonDisplay';

function ImpactReport() {
  const [formData, setFormData] = useState({
    order_id: '',
    products: [{
      name: '',
      quantity: '',
      weight_grams: '',
      is_plastic_free: false,
      is_local: false,
      is_organic: false,
      is_compostable: false
    }]
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const addProduct = () => {
    setFormData({
      ...formData,
      products: [...formData.products, {
        name: '',
        quantity: '',
        weight_grams: '',
        is_plastic_free: false,
        is_local: false,
        is_organic: false,
        is_compostable: false
      }]
    });
  };

  const removeProduct = (index) => {
    if (formData.products.length > 1) {
      const newProducts = formData.products.filter((_, i) => i !== index);
      setFormData({ ...formData, products: newProducts });
    }
  };

  const updateProduct = (index, field, value) => {
    const newProducts = [...formData.products];
    newProducts[index][field] = value;
    setFormData({ ...formData, products: newProducts });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {
        order_id: parseInt(formData.order_id),
        products: formData.products.map(p => ({
          ...p,
          quantity: parseInt(p.quantity),
          weight_grams: parseFloat(p.weight_grams)
        }))
      };

      const response = await apiClient.post('/api/generate-impact-report', payload);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold text-green-700 mb-6">Environmental Impact Report</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">Order ID</label>
          <input
            type="number"
            value={formData.order_id}
            onChange={(e) => setFormData({ ...formData, order_id: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-700">Products</h3>
            <button
              type="button"
              onClick={addProduct}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              + Add Product
            </button>
          </div>

          {formData.products.map((product, index) => (
            <div key={index} className="mb-6 p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-700">Product {index + 1}</h4>
                {formData.products.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-600 text-sm mb-1">Product Name</label>
                  <input
                    type="text"
                    value={product.name}
                    onChange={(e) => updateProduct(index, 'name', e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-1">Quantity</label>
                  <input
                    type="number"
                    value={product.quantity}
                    onChange={(e) => updateProduct(index, 'quantity', e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-gray-600 text-sm mb-1">Weight (grams)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={product.weight_grams}
                    onChange={(e) => updateProduct(index, 'weight_grams', e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div className="flex flex-col justify-center space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={product.is_plastic_free}
                      onChange={(e) => updateProduct(index, 'is_plastic_free', e.target.checked)}
                      className="rounded text-green-600"
                    />
                    <span className="text-sm">Plastic-free</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={product.is_local}
                      onChange={(e) => updateProduct(index, 'is_local', e.target.checked)}
                      className="rounded text-green-600"
                    />
                    <span className="text-sm">Local</span>
                  </label>
                </div>

                <div className="flex flex-col justify-center space-y-2">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={product.is_organic}
                      onChange={(e) => updateProduct(index, 'is_organic', e.target.checked)}
                      className="rounded text-green-600"
                    />
                    <span className="text-sm">Organic</span>
                  </label>

                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={product.is_compostable}
                      onChange={(e) => updateProduct(index, 'is_compostable', e.target.checked)}
                      className="rounded text-green-600"
                    />
                    <span className="text-sm">Compostable</span>
                  </label>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition"
        >
          {loading ? 'Calculating Impact...' : 'Generate Impact Report'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {result && <JsonDisplay data={result} title="Impact Report" />}
    </div>
  );
}

export default ImpactReport;
