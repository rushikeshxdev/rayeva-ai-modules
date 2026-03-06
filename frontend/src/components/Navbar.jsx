import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { path: '/', label: 'Home' },
  { path: '/tagger', label: 'Product Tagger' },
  { path: '/proposal', label: 'B2B Proposals' },
  { path: '/impact', label: 'Impact Reports' },
  { path: '/whatsapp', label: 'WhatsApp Bot' },
];

export default function Navbar() {
  const location = useLocation();
  
  return (
    <nav style={{
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(20px)',
      borderBottom: '1px solid var(--teal-border)',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      height: '64px',
    }}>
      <Link to="/" style={{
        fontFamily: 'var(--font-heading)',
        fontSize: '1.4rem',
        color: 'var(--teal-primary)',
        textDecoration: 'none',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontWeight: 700,
      }}>
        🌱 Rayeva AI
      </Link>
      
      <div style={{ display: 'flex', gap: '8px' }}>
        {navLinks.map(link => (
          <Link 
            key={link.path} 
            to={link.path} 
            style={{
              padding: '8px 20px',
              borderRadius: '12px',
              fontSize: '0.875rem',
              fontWeight: 500,
              textDecoration: 'none',
              transition: 'all 0.2s ease',
              color: location.pathname === link.path ? '#ffffff' : 'var(--text-muted)',
              background: location.pathname === link.path ? 'var(--teal-primary)' : 'transparent',
            }}
            onMouseEnter={e => {
              if (location.pathname !== link.path) {
                e.target.style.color = 'var(--teal-primary)';
                e.target.style.background = 'var(--teal-light)';
              }
            }}
            onMouseLeave={e => {
              if (location.pathname !== link.path) {
                e.target.style.color = 'var(--text-muted)';
                e.target.style.background = 'transparent';
              }
            }}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
