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

export default function ProposalGenerator() {
  const [formData, setFormData] = useState({
    client_name: '',
    industry: '',
    budget: '',
    num_employees: '',
    preferences: [],
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePreferenceToggle = (pref) => {
    setFormData(prev => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter(p => p !== pref)
        : [...prev.preferences, pref]
    }));
  };

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
      };
      const response = await apiClient.post('/api/generate-proposal', payload);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const proposalData = result?.data;

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
          MODULE 02
        </div>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.5rem',
          color: 'var(--text-dark)',
          fontWeight: 700,
          marginBottom: '8px',
        }}>
          B2B Proposal Generator
        </h1>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '1rem',
          fontFamily: 'var(--font-body)',
        }}>
          Generate customized bulk purchase proposals for corporate clients
        </p>
      </div>

      <div style={cardStyle}>
        <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <label style={labelStyle}>Client Name</label>
            <input
              type="text"
              name="client_name"
              value={formData.client_name}
              onChange={handleChange}
              placeholder="e.g. TechCorp India"
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

          <div>
            <label style={labelStyle}>Industry</label>
            <select
              name="industry"
              value={formData.industry}
              onChange={handleChange}
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
            >
              <option value="">Select industry</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Retail">Retail</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Finance">Finance</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Budget (₹)</label>
            <input
              type="number"
              name="budget"
              value={formData.budget}
              onChange={handleChange}
              placeholder="e.g. 500000"
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

          <div>
            <label style={labelStyle}>Number of Employees</label>
            <input
              type="number"
              name="num_employees"
              value={formData.num_employees}
              onChange={handleChange}
              placeholder="e.g. 250"
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

          <div style={{ gridColumn: '1 / -1' }}>
            <label style={labelStyle}>Preferences</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
              {['plastic-free', 'local', 'organic', 'compostable', 'zero-waste'].map(pref => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => handlePreferenceToggle(pref)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '100px',
                    border: '2px solid',
                    borderColor: formData.preferences.includes(pref) ? 'var(--teal-primary)' : 'var(--teal-border)',
                    background: formData.preferences.includes(pref) ? 'rgba(0, 196, 167, 0.1)' : 'transparent',
                    color: formData.preferences.includes(pref) ? 'var(--teal-primary)' : 'var(--text-muted)',
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    transition: 'all 0.2s ease',
                  }}
                >
                  {formData.preferences.includes(pref) ? '✓ ' : ''}{pref}
                </button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            gridColumn: '1 / -1',
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
            {loading ? '🤖 Generating Proposal...' : 'Generate Proposal →'}
          </button>
        </form>

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
      </div>

      {proposalData && (
        <>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginTop: '24px' }}>
            <div style={{
              ...cardStyle,
              padding: '24px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, var(--teal-light) 0%, var(--bg-white) 100%)',
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginBottom: '8px',
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}>TOTAL COST</div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                color: 'var(--teal-primary)',
                fontWeight: 700,
              }}>
                ₹{proposalData.total_cost?.toLocaleString()}
              </div>
            </div>
            <div style={{
              ...cardStyle,
              padding: '24px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, var(--teal-light) 0%, var(--bg-white) 100%)',
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginBottom: '8px',
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}>BUDGET USED</div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                color: 'var(--accent-gold)',
                fontWeight: 700,
              }}>
                {proposalData.budget_utilization_percent?.toFixed(1)}%
              </div>
            </div>
            <div style={{
              ...cardStyle,
              padding: '24px',
              textAlign: 'center',
              background: 'linear-gradient(135deg, var(--teal-light) 0%, var(--bg-white) 100%)',
            }}>
              <div style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                marginBottom: '8px',
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}>PRODUCTS</div>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '2rem',
                color: 'var(--teal-primary)',
                fontWeight: 700,
              }}>
                {proposalData.recommended_products?.length || 0}
              </div>
            </div>
          </div>

          {/* Products */}
          <div style={{ ...cardStyle, marginTop: '24px' }}>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.1em',
              marginBottom: '16px',
              fontWeight: 600,
            }}>
              RECOMMENDED PRODUCTS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {proposalData.recommended_products?.map((product, idx) => (
                <div key={idx} style={{
                  background: 'var(--bg-page)',
                  border: '1px solid var(--teal-border)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'grid',
                  gridTemplateColumns: '2fr 1fr 1fr 1fr',
                  gap: '16px',
                  alignItems: 'center',
                }}>
                  <div>
                    <div style={{
                      color: 'var(--text-dark)',
                      fontWeight: 500,
                      fontFamily: 'var(--font-body)',
                    }}>{product.name}</div>
                    <div style={{
                      fontSize: '0.8rem',
                      color: 'var(--text-muted)',
                      marginTop: '4px',
                    }}>
                      {product.description}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                    }}>Quantity</div>
                    <div style={{
                      color: 'var(--teal-primary)',
                      fontWeight: 600,
                      marginTop: '4px',
                    }}>{product.quantity}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                    }}>Unit Price</div>
                    <div style={{
                      color: 'var(--text-dark)',
                      marginTop: '4px',
                    }}>₹{product.unit_price}</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      fontSize: '0.7rem',
                      color: 'var(--text-muted)',
                      fontWeight: 600,
                      letterSpacing: '0.05em',
                    }}>Total</div>
                    <div style={{
                      color: 'var(--teal-primary)',
                      fontWeight: 600,
                      marginTop: '4px',
                    }}>₹{product.total_price}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Impact Summary */}
          <div style={{
            ...cardStyle,
            marginTop: '24px',
            background: 'rgba(245, 166, 35, 0.05)',
            borderColor: 'rgba(245, 166, 35, 0.2)',
          }}>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--accent-gold)',
              letterSpacing: '0.1em',
              marginBottom: '12px',
              fontWeight: 600,
            }}>
              IMPACT SUMMARY
            </div>
            <p style={{
              color: 'var(--text-dark)',
              lineHeight: 1.7,
              fontSize: '0.95rem',
              fontFamily: 'var(--font-body)',
            }}>
              {proposalData.impact_summary}
            </p>
          </div>

          <JsonDisplay data={result} title="proposal_response.json" />
        </>
      )}
    </div>
  );
}
