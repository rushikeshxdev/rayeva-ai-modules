import { useState, useEffect } from 'react';
import apiClient from '../api/client';

const cardStyle = {
  background: 'var(--bg-white)',
  border: '1px solid var(--teal-border)',
  borderRadius: '20px',
  padding: '32px',
  boxShadow: 'var(--shadow-sm)',
};

export default function WhatsAppBot() {
  const [logs, setLogs] = useState([]);
  const [escalations, setEscalations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [logsRes, escalationsRes] = await Promise.all([
        apiClient.get('/api/whatsapp/logs'),
        apiClient.get('/api/escalations')
      ]);
      setLogs(logsRes.data.logs || []);
      setEscalations(escalationsRes.data.escalations || []);
    } catch (err) {
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

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
          MODULE 04
        </div>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '2.5rem',
          color: 'var(--text-dark)',
          fontWeight: 700,
          marginBottom: '8px',
        }}>
          WhatsApp Bot
        </h1>
        <p style={{
          color: 'var(--text-muted)',
          fontSize: '1rem',
          fontFamily: 'var(--font-body)',
        }}>
          AI-powered customer support with automatic intent detection
        </p>
      </div>

      {/* Setup Instructions */}
      <div style={{
        ...cardStyle,
        background: 'rgba(0, 196, 167, 0.05)',
        border: '2px solid rgba(0, 196, 167, 0.2)',
        marginBottom: '24px',
      }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--teal-primary)', letterSpacing: '0.1em', marginBottom: '12px', fontWeight: 600, textTransform: 'uppercase' }}>
          SETUP REQUIRED
        </div>
        <p style={{ color: 'var(--text-dark)', marginBottom: '12px', lineHeight: 1.6, fontFamily: 'var(--font-body)' }}>
          To activate the WhatsApp bot, you need to configure Twilio credentials:
        </p>
        <ol style={{ color: 'var(--text-muted)', paddingLeft: '20px', lineHeight: 1.8, fontSize: '0.9rem', fontFamily: 'var(--font-body)' }}>
          <li>Sign up for Twilio at <a href="https://www.twilio.com/try-twilio" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--teal-primary)' }}>twilio.com</a></li>
          <li>Get your Account SID and Auth Token</li>
          <li>Set up WhatsApp Sandbox</li>
          <li>Configure webhook URL: <code style={{ background: 'var(--bg-page)', padding: '2px 6px', borderRadius: '4px', color: 'var(--teal-primary)', fontFamily: 'var(--font-mono)' }}>https://rayeva-ai-modules.onrender.com/api/whatsapp/webhook</code></li>
          <li>Add credentials to Render environment variables</li>
        </ol>
      </div>

      {/* Recent Conversations */}
      <div style={cardStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase' }}>
            RECENT CONVERSATIONS
          </div>
          <button
            onClick={fetchData}
            style={{
              background: 'rgba(0, 196, 167, 0.1)',
              border: '1px solid rgba(0, 196, 167, 0.3)',
              color: 'var(--teal-primary)',
              padding: '8px 16px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: 600,
              transition: 'all 0.2s ease',
            }}
          >
            ↻ Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
            Loading...
          </div>
        ) : logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>💬</div>
            <div>No conversations yet. Set up Twilio to start receiving messages.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {logs.map((log) => (
              <div key={log.id} style={{
                background: 'var(--bg-page)',
                border: '1px solid var(--teal-border)',
                borderRadius: '12px',
                padding: '16px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--teal-primary)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 196, 167, 0.1)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--teal-border)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ color: 'var(--teal-primary)', fontSize: '0.85rem', fontWeight: 600 }}>
                      {log.customer_phone}
                    </div>
                    {log.intent_detected && (
                      <span style={{
                        background: 'rgba(0, 196, 167, 0.1)',
                        border: '1px solid rgba(0, 196, 167, 0.3)',
                        color: 'var(--teal-primary)',
                        padding: '4px 12px',
                        borderRadius: '100px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                      }}>
                        {log.intent_detected}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {new Date(log.created_at).toLocaleString()}
                  </div>
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Customer:</div>
                  <div style={{ color: 'var(--text-dark)', fontSize: '0.9rem', fontFamily: 'var(--font-body)' }}>{log.message_received}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Bot:</div>
                  <div style={{ color: 'var(--teal-primary)', fontSize: '0.9rem', fontFamily: 'var(--font-body)' }}>{log.response_sent}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Escalations */}
      <div style={{ ...cardStyle, marginTop: '24px' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--accent-gold)', letterSpacing: '0.1em', marginBottom: '20px', fontWeight: 600, textTransform: 'uppercase' }}>
          CUSTOMER ESCALATIONS
        </div>

        {escalations.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)', fontFamily: 'var(--font-body)' }}>
            <div style={{ fontSize: '3rem', marginBottom: '12px' }}>✅</div>
            <div>No escalations. All queries handled successfully!</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {escalations.map((esc) => (
              <div key={esc.id} style={{
                background: 'rgba(245, 166, 35, 0.05)',
                border: '1px solid rgba(245, 166, 35, 0.2)',
                borderRadius: '12px',
                padding: '16px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <div style={{ color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: 600 }}>
                    {esc.customer_phone}
                  </div>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{
                      background: esc.status === 'resolved' ? 'rgba(0, 196, 167, 0.1)' : 'rgba(245, 166, 35, 0.1)',
                      border: `1px solid ${esc.status === 'resolved' ? 'rgba(0, 196, 167, 0.3)' : 'rgba(245, 166, 35, 0.3)'}`,
                      color: esc.status === 'resolved' ? 'var(--teal-primary)' : 'var(--accent-gold)',
                      padding: '4px 12px',
                      borderRadius: '100px',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                    }}>
                      {esc.status}
                    </span>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(esc.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                <div style={{ color: 'var(--text-dark)', fontSize: '0.9rem', fontFamily: 'var(--font-body)' }}>{esc.issue_description}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
