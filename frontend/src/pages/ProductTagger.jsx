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

export default function ProductTagger() {
  const [formData, setFormData] = useState({
    product_name: '',
    product_description: '',
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await apiClient.post('/api/categorize-product', formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const aiResult = result?.ai_result;

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
          MODULE 01
        </div>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.5rem',
          color: 'var(--text-dark)',
          fontWeight: 700,
          marginBottom: '8px',
        }}>
          Product Tagger
        </h1>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '1rem',
          fontFamily: 'var(--font-body)',
        }}>
          Auto-categorize any eco product with AI in seconds
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Form */}
        <div style={cardStyle}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Product Name</label>
              <input
                type="text"
                name="product_name"
                value={formData.product_name}
                onChange={handleChange}
                placeholder="e.g. BambooFresh Toothbrush"
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
              <label style={labelStyle}>Description</label>
              <textarea
                name="product_description"
                value={formData.product_description}
                onChange={handleChange}
                placeholder="Biodegradable bamboo handle, charcoal bristles, plastic-free packaging..."
                rows={5}
                style={{ ...inputStyle, resize: 'vertical' }}
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
            <button type="submit" disabled={loading} style={{
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
              {loading ? '🤖 Analyzing...' : 'Tag Product →'}
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

        {/* Results */}
        <div style={cardStyle}>
          <div style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            letterSpacing: '0.1em',
            marginBottom: '20px',
            fontWeight: 600,
          }}>
            RESULTS
          </div>

          {!result && !loading && (
            <div style={{
              height: '200px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              gap: '12px',
            }}>
              <div style={{ fontSize: '3rem' }}>🏷️</div>
              <div style={{ fontSize: '0.875rem' }}>Results will appear here</div>
            </div>
          )}

          {loading && (
            <div style={{
              height: '200px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--teal-primary)',
              fontSize: '1rem',
            }}>
              ✨ AI is thinking...
            </div>
          )}

          {aiResult && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  marginBottom: '6px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                }}>CATEGORY</div>
                <div style={{
                  display: 'inline-block',
                  background: 'rgba(0, 196, 167, 0.1)',
                  border: '1px solid rgba(0, 196, 167, 0.3)',
                  color: 'var(--teal-primary)',
                  padding: '6px 16px',
                  borderRadius: '100px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                }}>
                  {aiResult.category} → {aiResult.sub_category}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  marginBottom: '6px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                }}>SEO TAGS</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {aiResult.seo_tags?.map(tag => (
                    <span key={tag} style={{
                      background: 'var(--bg-page)',
                      border: '1px solid var(--teal-border)',
                      color: 'var(--text-dark)',
                      padding: '4px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                    }}>{tag}</span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  marginBottom: '6px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                }}>
                  SUSTAINABILITY
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {aiResult.sustainability_filters?.map(f => (
                    <span key={f} style={{
                      background: 'rgba(0, 196, 167, 0.1)',
                      color: 'var(--teal-primary)',
                      padding: '4px 12px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      border: '1px solid rgba(0, 196, 167, 0.3)',
                      fontWeight: 500,
                    }}>🌱 {f}</span>
                  ))}
                </div>
              </div>

              <div>
                <div style={{
                  fontSize: '0.7rem',
                  color: 'var(--text-muted)',
                  marginBottom: '6px',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                }}>
                  CONFIDENCE
                </div>
                <div style={{
                  background: 'var(--teal-light)',
                  borderRadius: '100px',
                  height: '8px',
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${(aiResult.confidence_score || 0) * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, var(--teal-primary) 0%, var(--teal-dark) 100%)',
                    borderRadius: '100px',
                    transition: 'width 1s ease',
                  }} />
                </div>
                <div style={{
                  fontSize: '0.8rem',
                  color: 'var(--teal-primary)',
                  marginTop: '4px',
                  fontWeight: 600,
                }}>
                  {((aiResult.confidence_score || 0) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {result && <JsonDisplay data={result} title="raw_response.json" />}
    </div>
  );
}
