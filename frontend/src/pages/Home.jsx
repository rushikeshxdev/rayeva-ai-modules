import { Link } from 'react-router-dom';

const modules = [
  {
    icon: '🏷️',
    number: '01',
    title: 'Product Tagger',
    description: 'Auto-assign categories, generate SEO tags, and detect sustainability filters using AI.',
    path: '/tagger',
    tag: 'Classification',
  },
  {
    icon: '💼',
    number: '02',
    title: 'B2B Proposals',
    description: 'Generate customized bulk purchase proposals with budget optimization.',
    path: '/proposal',
    tag: 'Generation',
  },
  {
    icon: '🌍',
    number: '03',
    title: 'Impact Reports',
    description: 'Calculate real plastic saved and carbon avoided per order with AI statements.',
    path: '/impact',
    tag: 'Analytics',
  },
  {
    icon: '💬',
    number: '04',
    title: 'WhatsApp Bot',
    description: 'Handle customer queries automatically with intent detection and DB lookups.',
    path: '/whatsapp',
    tag: 'Automation',
  },
];

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
      
      {/* Hero */}
      <div style={{
        padding: '80px 2rem 60px',
        maxWidth: '900px',
        margin: '0 auto',
        textAlign: 'center',
      }}>
        <div style={{
          display: 'inline-block',
          padding: '6px 16px',
          background: 'rgba(0, 196, 167, 0.1)',
          border: '1px solid rgba(0, 196, 167, 0.3)',
          borderRadius: '100px',
          fontSize: '0.75rem',
          color: 'var(--teal-primary)',
          marginBottom: '24px',
          letterSpacing: '0.05em',
          fontWeight: 600,
        }}>
          RAYEVA WORLD PVT LTD · AI INTERNSHIP ASSIGNMENT
        </div>
        
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: 'clamp(2.5rem, 6vw, 4rem)',
          lineHeight: 1.1,
          color: 'var(--text-dark)',
          marginBottom: '24px',
          fontWeight: 700,
        }}>
          Sustainable Commerce,<br />
          <span style={{
            background: 'linear-gradient(135deg, var(--teal-primary) 0%, var(--teal-dark) 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Powered by AI
          </span>
        </h1>
        
        <p style={{
          fontSize: '1.1rem',
          color: 'var(--text-muted)',
          maxWidth: '600px',
          margin: '0 auto 40px',
          lineHeight: 1.7,
          fontFamily: 'var(--font-body)',
        }}>
          Four AI-powered modules that automate the most manual tasks
          in eco-friendly e-commerce — from product cataloging to
          customer support.
        </p>
        
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/tagger" style={{
            background: 'linear-gradient(135deg, var(--teal-primary) 0%, var(--teal-dark) 100%)',
            color: '#ffffff',
            padding: '14px 32px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: '1rem',
            boxShadow: '0 4px 12px rgba(0, 196, 167, 0.3)',
            transition: 'all 0.2s ease',
            display: 'inline-block',
          }}
          onMouseEnter={e => {
            e.target.style.transform = 'scale(1.02)';
            e.target.style.boxShadow = '0 6px 16px rgba(0, 196, 167, 0.4)';
          }}
          onMouseLeave={e => {
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 4px 12px rgba(0, 196, 167, 0.3)';
          }}>
            Try It Live →
          </Link>
          <a href="https://rayeva-ai-modules.onrender.com/docs" target="_blank" rel="noopener noreferrer" style={{
            border: '2px solid var(--teal-border)',
            background: 'var(--bg-white)',
            color: 'var(--teal-primary)',
            padding: '14px 32px',
            borderRadius: '12px',
            textDecoration: 'none',
            fontSize: '1rem',
            fontWeight: 600,
            transition: 'all 0.2s ease',
            display: 'inline-block',
          }}
          onMouseEnter={e => {
            e.target.style.borderColor = 'var(--teal-primary)';
            e.target.style.background = 'var(--teal-light)';
          }}
          onMouseLeave={e => {
            e.target.style.borderColor = 'var(--teal-border)';
            e.target.style.background = 'var(--bg-white)';
          }}>
            API Docs ↗
          </a>
        </div>
      </div>
      
      {/* Stats Bar */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto 60px',
        padding: '0 2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1px',
        background: 'var(--teal-border)',
        borderRadius: '16px',
        overflow: 'hidden',
        border: '1px solid var(--teal-border)',
      }}>
        {[
          { value: '4', label: 'AI Modules' },
          { value: '8', label: 'DB Tables' },
          { value: '12', label: 'API Endpoints' },
          { value: '100%', label: 'Free AI (Groq)' },
        ].map(stat => (
          <div key={stat.label} style={{
            padding: '24px',
            background: 'var(--bg-white)',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'var(--font-heading)',
              fontSize: '2rem',
              color: 'var(--teal-primary)',
              fontWeight: 700,
            }}>{stat.value}</div>
            <div style={{ 
              fontSize: '0.8rem', 
              color: 'var(--text-muted)', 
              marginTop: '4px',
              fontFamily: 'var(--font-body)',
            }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
      
      {/* Module Cards */}
      <div style={{
        maxWidth: '900px',
        margin: '0 auto',
        padding: '0 2rem 80px',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '20px',
      }}>
        {modules.map((mod) => (
          <Link key={mod.path} to={mod.path} style={{ textDecoration: 'none' }}>
            <div style={{
              background: 'var(--bg-white)',
              border: '1px solid var(--teal-border)',
              borderRadius: '20px',
              padding: '32px',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = 'var(--teal-primary)';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'var(--teal-border)';
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
            }}>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '16px',
              }}>
                <span style={{ fontSize: '2rem' }}>{mod.icon}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{
                    fontSize: '0.7rem',
                    color: 'var(--teal-primary)',
                    background: 'rgba(0, 196, 167, 0.1)',
                    padding: '4px 12px',
                    borderRadius: '100px',
                    border: '1px solid rgba(0, 196, 167, 0.3)',
                    fontWeight: 600,
                  }}>{mod.tag}</span>
                  <span style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.2rem',
                    color: 'var(--text-muted)',
                    fontWeight: 500,
                  }}>{mod.number}</span>
                </div>
              </div>
              <h3 style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.3rem',
                color: 'var(--text-dark)',
                marginBottom: '8px',
                fontWeight: 600,
              }}>{mod.title}</h3>
              <p style={{
                fontSize: '0.875rem',
                color: 'var(--text-muted)',
                lineHeight: 1.6,
                fontFamily: 'var(--font-body)',
              }}>{mod.description}</p>
              <div style={{
                marginTop: '20px',
                fontSize: '0.875rem',
                color: 'var(--teal-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontWeight: 500,
              }}>
                Open module →
              </div>
            </div>
          </Link>
        ))}
      </div>
      
      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '24px',
        borderTop: '1px solid var(--teal-border)',
        color: 'var(--text-muted)',
        fontSize: '0.8rem',
        fontFamily: 'var(--font-body)',
      }}>
        Built by <span style={{ color: 'var(--teal-primary)', fontWeight: 600 }}>Rushikesh Randive</span> ·
        Rayeva World Pvt Ltd Internship · 2026
      </div>
    </div>
  );
}
