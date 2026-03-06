import { useState, useEffect } from 'react';
import apiClient from '../api/client';

function WhatsAppBot() {
  const [logs, setLogs] = useState([]);
  const [escalations, setEscalations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [logsRes, escalationsRes] = await Promise.all([
        apiClient.get('/api/whatsapp/logs'),
        apiClient.get('/api/escalations')
      ]);

      setLogs(logsRes.data.logs || []);
      setEscalations(escalationsRes.data.escalations || []);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-green-700">WhatsApp Bot Dashboard</h1>
        <button
          onClick={fetchData}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
        >
          Refresh
        </button>
      </div>

      {loading && (
        <div className="text-center py-8 text-gray-600">Loading...</div>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-6">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Recent Conversations</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-green-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Phone</th>
                      <th className="px-4 py-3 text-left">Message</th>
                      <th className="px-4 py-3 text-left">Intent</th>
                      <th className="px-4 py-3 text-left">Response</th>
                      <th className="px-4 py-3 text-left">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                          No conversations yet
                        </td>
                      </tr>
                    ) : (
                      logs.map((log) => (
                        <tr key={log.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{log.customer_phone}</td>
                          <td className="px-4 py-3 text-sm">{log.message_received?.substring(0, 50)}...</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">
                              {log.intent_detected}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">{log.response_sent?.substring(0, 50)}...</td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {new Date(log.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Customer Escalations</h2>
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-red-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">Phone</th>
                      <th className="px-4 py-3 text-left">Issue</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {escalations.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                          No escalations
                        </td>
                      </tr>
                    ) : (
                      escalations.map((esc) => (
                        <tr key={esc.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{esc.customer_phone}</td>
                          <td className="px-4 py-3 text-sm">{esc.issue_description?.substring(0, 100)}...</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              esc.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              esc.status === 'resolved' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {esc.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {new Date(esc.created_at).toLocaleString()}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default WhatsAppBot;
