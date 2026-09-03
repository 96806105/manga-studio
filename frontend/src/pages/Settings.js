import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { api } from '../api/client';
import { Save } from 'lucide-react';
const Settings = () => {
    const [keys, setKeys] = useState({ deepseek: '', pollinations: '' });
    const [saved, setSaved] = useState(false);
    const handleSave = async () => {
        try {
            await api.updateProject('settings', { apiKeys: keys });
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        }
        catch (err) {
            alert(err);
        }
    };
    return (_jsxs("div", { className: "h-full p-6 overflow-y-auto max-w-2xl", children: [_jsx("h1", { className: "text-2xl font-bold text-white mb-6", children: "Settings" }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "glass rounded-xl p-5", children: [_jsxs("h2", { className: "text-white font-semibold mb-4 flex items-center gap-2", children: [_jsx(Save, { size: 18 }), " API Keys"] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-gray-400 text-sm mb-1 block", children: "DeepSeek API Key" }), _jsx("input", { type: "password", value: keys.deepseek, onChange: (e) => setKeys({ ...keys, deepseek: e.target.value }), className: "w-full bg-manga-bg border border-manga-border rounded-lg px-3 py-2 text-white text-sm focus:border-studio-500 focus:outline-none", placeholder: "Get free key at deepseek.com" }), _jsx("p", { className: "text-gray-500 text-xs mt-1", children: "Free: 5M tokens/month" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-gray-400 text-sm mb-1 block", children: "Pollinations API Key" }), _jsx("input", { type: "password", value: keys.pollinations, onChange: (e) => setKeys({ ...keys, pollinations: e.target.value }), className: "w-full bg-manga-bg border border-manga-border rounded-lg px-3 py-2 text-white text-sm focus:border-studio-500 focus:outline-none", placeholder: "Optional, images still work without key" }), _jsx("p", { className: "text-gray-500 text-xs mt-1", children: "Free unlimited images at pollinations.ai" })] })] })] }), _jsx("div", { className: "flex justify-end", children: _jsxs("button", { onClick: handleSave, className: `flex items-center gap-2 px-6 py-2.5 rounded-lg text-white font-medium transition-colors ${saved ? 'bg-green-600' : 'bg-studio-600 hover:bg-studio-700'}`, children: [_jsx(Save, { size: 16 }), " ", saved ? 'Saved!' : 'Save Settings'] }) })] })] }));
};
export default Settings;
//# sourceMappingURL=Settings.js.map