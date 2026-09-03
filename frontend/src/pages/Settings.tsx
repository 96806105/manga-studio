import React, { useState } from 'react';
import { api } from '../api/client';
import { Save } from 'lucide-react';

const Settings: React.FC = () => {
  const [keys, setKeys] = useState({ deepseek: '', pollinations: '' });
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    try {
      await api.updateProject('settings', { apiKeys: keys });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) { alert(err); }
  };

  return (
    <div className="h-full p-6 overflow-y-auto max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>
      <div className="space-y-6">
        <div className="glass rounded-xl p-5">
          <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
            <Save size={18} /> API Keys
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-gray-400 text-sm mb-1 block">DeepSeek API Key</label>
              <input type="password" value={keys.deepseek} onChange={(e) => setKeys({ ...keys, deepseek: e.target.value })} className="w-full bg-manga-bg border border-manga-border rounded-lg px-3 py-2 text-white text-sm focus:border-studio-500 focus:outline-none" placeholder="Get free key at deepseek.com" />
              <p className="text-gray-500 text-xs mt-1">Free: 5M tokens/month</p>
            </div>
            <div>
              <label className="text-gray-400 text-sm mb-1 block">Pollinations API Key</label>
              <input type="password" value={keys.pollinations} onChange={(e) => setKeys({ ...keys, pollinations: e.target.value })} className="w-full bg-manga-bg border border-manga-border rounded-lg px-3 py-2 text-white text-sm focus:border-studio-500 focus:outline-none" placeholder="Optional, images still work without key" />
              <p className="text-gray-500 text-xs mt-1">Free unlimited images at pollinations.ai</p>
            </div>
          </div>
        </div>
        <div className="flex justify-end">
          <button onClick={handleSave} className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium transition-colors ${saved ? 'bg-green-600' : 'bg-studio-600 hover:bg-studio-700'}`}>
            <Save size={16} /> {saved ? 'Saved!' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;