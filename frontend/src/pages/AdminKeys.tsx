import React, { useEffect, useState } from 'react';
import AdminMenu from '../components/AdminMenu';

interface ServerKey {
  apiKey: string;
  name?: string;
  active?: boolean;
  limitPerMinute?: number;
  created?: number;
}

const AdminKeys: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [keys, setKeys] = useState<ServerKey[]>([]);
  const [newName, setNewName] = useState('');
  const [newLimit, setNewLimit] = useState('120');

  const fetchKeys = async () => {
    setLoading(true);
    try {
      const res = await fetch('/.netlify/functions/keys');
      const json = await res.json();
      setKeys(json.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const createKey = async () => {
    try {
      await fetch('/.netlify/functions/keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName || 'API Key', limitPerMinute: Number(newLimit) || 120 }),
      });
      await fetchKeys();
      setNewName('');
    } catch (e) {
      console.error(e);
    }
  };

  const deleteKey = async (apiKey: string) => {
    if (!confirm('Delete this key?')) return;
    try {
      await fetch(`/.netlify/functions/keys/${encodeURIComponent(apiKey)}`, { method: 'DELETE' });
      await fetchKeys();
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => { fetchKeys(); }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <AdminMenu isOpen={isMenuOpen} onToggle={() => setIsMenuOpen(!isMenuOpen)} />

      <div className="bg-white/10 backdrop-blur-xl border-b border-white/20 lg:ml-64">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-2xl font-bold text-white">Server API Keys</h1>
              <p className="text-white/60 text-sm">Manage keys used to call your API</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:ml-64">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 mb-6">
          <h2 className="text-white font-semibold mb-4">Create Key</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Name" className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white" />
            <input value={newLimit} onChange={e => setNewLimit(e.target.value)} placeholder="Limit per minute" className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 text-white" />
            <button onClick={createKey} className="px-3 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white">Create</button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20">
          <h2 className="text-white font-semibold mb-4">Keys</h2>
          {loading ? (
            <p className="text-white/60">Loading...</p>
          ) : keys.length === 0 ? (
            <p className="text-white/60">No keys</p>
          ) : (
            <div className="space-y-3">
              {keys.map(k => (
                <div key={k.apiKey} className="flex items-center justify-between bg-white/5 rounded-lg p-4">
                  <div>
                    <div className="text-white font-medium">{k.name || 'API Key'}</div>
                    <div className="text-white/60 text-xs break-all">{k.apiKey}</div>
                    <div className="text-white/60 text-xs">limit: {k.limitPerMinute || 60} | active: {k.active !== false ? 'yes' : 'no'}</div>
                  </div>
                  <button onClick={() => deleteKey(k.apiKey)} className="px-3 py-1.5 rounded bg-red-500/20 hover:bg-red-500/40 text-red-400 text-sm">Delete</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminKeys;