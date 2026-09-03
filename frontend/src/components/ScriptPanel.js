import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { scenesState, isGeneratingState, generationProgressState } from '../store';
import { Wand2, Download } from 'lucide-react';
const ScriptPanel = ({ projectId, onGenerate, generating }) => {
    const scenes = useRecoilValue(scenesState);
    const [storyInput, setStoryInput] = useState('');
    const [isGenerating, setIsGenerating] = useRecoilState(isGeneratingState);
    const [progress, setProgress] = useRecoilState(generationProgressState);
    const handleGenerate = async () => {
        if (!storyInput.trim()) {
            alert('Enter a story outline');
            return;
        }
        setIsGenerating(true);
        setProgress(0);
        try {
            await onGenerate(storyInput);
        }
        catch (err) {
            alert(err.message);
        }
        finally {
            setIsGenerating(false);
            setProgress(0);
        }
    };
    const handleExport = () => {
        const c = scenes.map((s, i) => `Scene ${i + 1}: ${s.title}\n${s.description}\n`).join('\n');
        const blob = new Blob([c], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${projectId}_script.txt`;
        a.click();
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "glass rounded-xl p-5", children: [_jsxs("h3", { className: "text-white font-semibold mb-3 flex items-center gap-2", children: [_jsx(Wand2, { size: 18 }), " Generate Script"] }), _jsx("textarea", { value: storyInput, onChange: (e) => setStoryInput(e.target.value), className: "w-full bg-manga-bg border border-manga-border rounded-lg px-3 py-2 text-white text-sm focus:border-studio-500 focus:outline-none h-40 resize-none", placeholder: "Paste your story outline..." }), _jsx("div", { className: "flex items-center gap-2 mt-3", children: _jsxs("button", { onClick: handleGenerate, disabled: generating || !storyInput.trim(), className: "flex items-center gap-1.5 px-4 py-2 bg-studio-600 hover:bg-studio-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium", children: [_jsx(Wand2, { size: 14 }), " Generate Script"] }) })] }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("h3", { className: "text-white font-semibold", children: ["Scenes (", scenes.length, ")"] }), scenes.length > 0 && _jsxs("button", { onClick: handleExport, className: "flex items-center gap-1 px-3 py-1 text-sm text-gray-400 hover:text-white", children: [_jsx(Download, { size: 14 }), " Export"] })] }), _jsx("div", { className: "space-y-3", children: scenes.map((scene, index) => (_jsxs("div", { className: "glass rounded-lg p-4 cursor-pointer hover:border-studio-500/50 transition-colors", children: [_jsxs("div", { className: "flex items-center gap-2 mb-2", children: [_jsxs("span", { className: "text-xs bg-studio-600 text-white px-2 py-0.5 rounded", children: ["Scene ", index + 1] }), _jsx("span", { className: "text-white text-sm font-medium", children: scene.title })] }), _jsx("p", { className: "text-gray-500 text-xs line-clamp-2", children: scene.description })] }, scene.id))) })] }));
};
export default ScriptPanel;
//# sourceMappingURL=ScriptPanel.js.map