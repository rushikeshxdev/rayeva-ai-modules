import { useState } from 'react';

export default function JsonDisplay({ data, title }) {
  const [collapsed, setCollapsed] = useState(false);
  
  return (
    <div style={{
      background: 'var(--bg-white)',
      border: '1px solid var(--teal-border)',
      borderRadius: '16px',
      overflow: 'hidden',
      marginTop: '1.5rem',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '12px 16px',
        borderBottom: '1px solid var(--teal-border)',
        background: 'var(--bg-page)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f56' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffbd2e' }} />
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#27c93f' }} />
          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginLeft: '8px' }}>
            {title || 'response.json'}
          </span>
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          style={{
            background: 'transparent',
            border: '1px solid var(--teal-border)',
            color: 'var(--teal-primary)',
            padding: '4px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.75rem',
            fontWeight: 500,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => {
            e.target.style.background = 'var(--teal-light)';
          }}
          onMouseLeave={e => {
            e.target.style.background = 'transparent';
          }}
        >
          {collapsed ? 'expand' : 'collapse'}
        </button>
      </div>
      
      {!collapsed && (
        <pre style={{
          padding: '1rem',
          overflow: 'auto',
          fontSize: '0.85rem',
          lineHeight: 1.6,
          color: 'var(--text-dark)',
          background: 'var(--bg-page)',
          maxHeight: '400px',
          fontFamily: 'var(--font-mono)',
          margin: 0,
        }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
    </div>
  );
}
