import { useState } from 'react';
import apiClient from '../api/client';
import JsonDisplay from '../components/JsonDisplay';

const cardStyle = {
  background: 'var(--bg-white)',
  border: '1px solid var(--teal-border)',
  borderRadius: '20px',
  padding: '32px',
  boxShadow: 'var(--shadow-sm)',
};

const inputStyle = {
  width: '100%',
  background: 'var(--bg-page)',
  border: '2px solid var(--teal-border)',
  borderRadius: '12px',
  padding: '12px 16px',
  color: 'var(--text-dark)',
  fontSize: '0.95rem',
  outline: 'none',
  fontFamily: 'var(--font-body)',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
};

const labelStyle = {
  display: 'block',
  fontSize: '0.75rem',
  fontWeight: 600,
  color: 'var(--text-muted)',
  marginBottom: '8px',
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
};

export default function ImpactReport() {
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

  const impactData = result?.data;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 2rem' }}>
      <div style={{ marginBottom: '32px' }}>
        <div style={{
          display: 'inline-block',
          padding: '4px 12px',
          background: 'rgba(0, 196, 167, 0.1)',
          border: '1px solid rgba(0, 196, 167, 0.3)',
          borderRadius: '100px',
          fontSize: '0.75rem',
          color: 'var(--teal-primary)',
          marginBottom: '12px',
          letterSpacing: '0.05em',
          fontWeight: 600,
        }}>
          MODULE 03
        </div>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.5rem',
          color: 'var(--text-dark)',
          fontWeight: 700,
          marginBottom: '8px',
        }}>
          Environmental Impact Report
        </h1>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '1rem',
          fontFamily: 'var(--font-body)',
        }}>
          Calculate plastic saved and carbon avoided per order
        </p>
      </div>

      <form onSubmit={handleSubmit} style={{ ...cardStyle, marginBottom: '24px' }}>
        <div style={{ marginBottom: '24px' }}>
          <label style={labelStyle}>Order ID</label>
          <input
            type="number"
            value={formData.order_id}
            onChange={(e) => setFormData({ ...formData, order_id: e.target.value })}
            style={inputStyle}
            onFocus={e => {
              e.target.style.borderColor = 'var(--teal-primary)';
              e.target.style.boxShadow = '0 0 0 3px rgba(0, 196, 167, 0.1)';
            }}
            onBlur={e => {
              e.target.style.borderColor = 'var(--teal-border)';
              e.target.style.boxShadow = 'none';
            }}
            required
          />
        </div>

        <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', letterSpacing: '0.1em' }}>PRODUCTS</div>
          <button
            type="button"
            onClick={addProduct}
            style={{
              background: 'rgba(0, 196, 167, 0.1)',
              border: '1px solid rgba(0, 196, 167, 0.3)',
              color: 'var(--teal-primary)',
              padding: '6px 14px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontWeight: 600,
              transition: 'all 0.2s ease',
            }}
          >
            + Add Product
          </button>
        </div>

        {formData.products.map((product, index) => (
          <div key={index} style={{
            background: 'var(--bg-page)',
            border: '1px solid var(--teal-border)',
            borderRadius: '16px',
            padding: '20px',
            marginBottom: '16px',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                Product {index + 1}
              </div>
              {formData.products.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeProduct(index)}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(244, 67, 54, 0.3)',
                    color: 'var(--error)',
                    padding: '4px 12px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '0.75rem',
                  }}
                >
                  Remove
                </button>
              )}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ ...labelStyle, fontSize: '0.7rem' }}>Product Name</label>
                <input
                  type="text"
                  value={product.name}
                  onChange={(e) => updateProduct(index, 'name', e.target.value)}
                  style={{ ...inputStyle, padding: '10px 12px', fontSize: '0.85rem' }}
                  onFocus={e => {
                    e.target.style.borderColor = 'var(--teal-primary)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 196, 167, 0.1)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'var(--teal-border)';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ ...labelStyle, fontSize: '0.7rem' }}>Quantity</label>
                <input
                  type="number"
                  value={product.quantity}
                  onChange={(e) => updateProduct(index, 'quantity', e.target.value)}
                  style={{ ...inputStyle, padding: '10px 12px', fontSize: '0.85rem' }}
                  onFocus={e => {
                    e.target.style.borderColor = 'var(--teal-primary)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 196, 167, 0.1)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'var(--teal-border)';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ ...labelStyle, fontSize: '0.7rem' }}>Weight (grams)</label>
                <input
                  type="number"
                  step="0.01"
                  value={product.weight_grams}
                  onChange={(e) => updateProduct(index, 'weight_grams', e.target.value)}
                  style={{ ...inputStyle, padding: '10px 12px', fontSize: '0.85rem' }}
                  onFocus={e => {
                    e.target.style.borderColor = 'var(--teal-primary)';
                    e.target.style.boxShadow = '0 0 0 3px rgba(0, 196, 167, 0.1)';
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'var(--teal-border)';
                    e.target.style.boxShadow = 'none';
                  }}
                  required
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {[
                { key: 'is_plastic_free', label: 'Plastic-free' },
                { key: 'is_local', label: 'Local' },
                { key: 'is_organic', label: 'Organic' },
                { key: 'is_compostable', label: 'Compostable' },
              ].map(({ key, label }) => (
                <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={product[key]}
                    onChange={(e) => updateProduct(index, key, e.target.checked)}
                    style={{ accentColor: 'var(--teal-primary)' }}
                  />
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{label}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button type="submit" disabled={loading} style={{
          width: '100%',
          background: loading ? 'var(--teal-border)' : 'linear-gradient(135deg, var(--teal-primary) 0%, var(--teal-dark) 100%)',
          color: loading ? 'var(--text-muted)' : '#ffffff',
          border: 'none',
          padding: '14px',
          borderRadius: '12px',
          fontWeight: 600,
          fontSize: '0.95rem',
          cursor: loading ? 'not-allowed' : 'pointer',
          fontFamily: 'var(--font-body)',
          transition: 'all 0.2s ease',
          marginTop: '8px',
          opacity: loading ? 0.7 : 1,
        }}
        onMouseEnter={e => {
          if (!loading) {
            e.target.style.transform = 'scale(1.02)';
            e.target.style.boxShadow = '0 6px 16px rgba(0, 196, 167, 0.4)';
          }
        }}
        onMouseLeave={e => {
          if (!loading) {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = 'none';
          }
        }}>
          {loading ? '🤖 Calculating Impact...' : 'Generate Impact Report →'}
        </button>

        {error && (
          <div style={{
            marginTop: '16px',
            padding: '12px 16px',
            background: 'rgba(244, 67, 54, 0.1)',
            border: '1px solid rgba(244, 67, 54, 0.3)',
            borderRadius: '12px',
            color: 'var(--error)',
            fontSize: '0.875rem',
          }}>
            ❌ {error}
          </div>
        )}
      </form>

      {impactData && (
        <>
          {/* Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div style={{
              ...cardStyle,
              padding: '32px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(0, 196, 167, 0.1) 0%, rgba(0, 196, 167, 0.05) 100%)',
              border: '2px solid rgba(0, 196, 167, 0.3)',
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--teal-primary)', marginBottom: '12px', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase' }}>
                PLASTIC SAVED
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', color: 'var(--teal-primary)', marginBottom: '4px', fontWeight: 700, lineHeight: 1 }}>
                {impactData.plastic_saved_grams}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>grams</div>
            </div>

            <div style={{
              ...cardStyle,
              padding: '32px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(0, 196, 167, 0.1) 0%, rgba(0, 196, 167, 0.05) 100%)',
              border: '2px solid rgba(0, 196, 167, 0.3)',
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--teal-primary)', marginBottom: '12px', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase' }}>
                CARBON AVOIDED
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', color: 'var(--teal-primary)', marginBottom: '4px', fontWeight: 700, lineHeight: 1 }}>
                {impactData.carbon_avoided_kg}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>kg CO₂</div>
            </div>

            <div style={{
              ...cardStyle,
              padding: '32px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, rgba(245, 166, 35, 0.1) 0%, rgba(245, 166, 35, 0.05) 100%)',
              border: '2px solid rgba(245, 166, 35, 0.3)',
            }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', marginBottom: '12px', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase' }}>
                LOCAL SOURCING
              </div>
              <div style={{ fontFamily: 'var(--font-heading)', fontSize: '3rem', color: 'var(--accent-gold)', marginBottom: '4px', fontWeight: 700, lineHeight: 1 }}>
                {impactData.local_sourcing_percent}
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>percent</div>
            </div>
          </div>

          {/* Impact Statement */}
          <div style={{
            ...cardStyle,
            background: 'rgba(0, 196, 167, 0.05)',
            border: '2px solid rgba(0, 196, 167, 0.2)',
            padding: '32px',
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>🌱</div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--teal-primary)', marginBottom: '12px', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase' }}>
                  IMPACT STATEMENT
                </div>
                <p style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: '1.25rem',
                  color: 'var(--text-dark)',
                  lineHeight: 1.7,
                  fontStyle: 'italic',
                }}>
                  "{impactData.impact_statement}"
                </p>
              </div>
            </div>
          </div>

          <JsonDisplay data={result} title="impact_response.json" />
        </>
      )}
    </div>
  );
}
