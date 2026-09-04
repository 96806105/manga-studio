import React, { useState } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { scenesState, isGeneratingState, generationProgressState } from '../store';
import { api } from '../api/client';
import { Wand2, Download } from 'lucide-react';
interface ScriptPanelProps { projectId: string; onGenerate: (story: string) => Promise<void>; generating: boolean; }
const ScriptPanel: React.FC<ScriptPanelProps> = ({ projectId, onGenerate, generating }) => {
  const scenes = useRecoilValue(scenesState);
  const [storyInput, setStoryInput] = useState('');
  const [isGenerating, setIsGenerating] = useRecoilState(isGeneratingState);
  const [progress, setProgress] = useRecoilState(generationProgressState);
  const handleGenerate = async () => {
    if (!storyInput.trim()) { alert('请输入故事大纲'); return; }
    setIsGenerating(true); setProgress(0);
    try { await onGenerate(storyInput); } catch (err: any) { alert(err.message); }
    finally { setIsGenerating(false); setProgress(0); }
  };
  const handleExport = () => {
    const c = scenes.map((s, i) => `场景 ${i + 1}: ${s.title}\n${s.description}\n`).join('\n');
    const blob = new Blob([c], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `${projectId}_script.txt`; a.click();
  };
  return (
    <div className="space-y-4">
      <div className="glass rounded-xl p-5">
        <h3 className="text-white font-semibold mb-3 flex items-center gap-2"><Wand2 size={18} /> 生成脚本</h3>
        <textarea value={storyInput} onChange={(e) => setStoryInput(e.target.value)} className="w-full bg-manga-bg border border-manga-border rounded-lg px-3 py-2 text-white text-sm focus:border-studio-500 focus:outline-none h-40 resize-none" placeholder="粘贴你的故事大纲..." />
        <div className="flex items-center gap-2 mt-3"><button onClick={handleGenerate} disabled={generating || !storyInput.trim()} className="flex items-center gap-1.5 px-4 py-2 bg-studio-600 hover:bg-studio-700 disabled:opacity-50 text-white rounded-lg text-sm font-medium"><Wand2 size={14} /> 生成脚本</button></div>
      </div>
      <div className="flex items-center justify-between"><h3 className="text-white font-semibold">场景 ({scenes.length})</h3>
        {scenes.length > 0 && <button onClick={handleExport} className="flex items-center gap-1 px-3 py-1 text-sm text-gray-400 hover:text-white"><Download size={14} /> 导出</button>}
      </div>
      <div className="space-y-3">{scenes.map((scene, index) => (
        <div key={scene.id} className="glass rounded-lg p-4 cursor-pointer hover:border-studio-500/50 transition-colors">
          <div className="flex items-center gap-2 mb-2"><span className="text-xs bg-studio-600 text-white px-2 py-0.5 rounded">场景 {index + 1}</span><span className="text-white text-sm font-medium">{scene.title}</span></div>
          <p className="text-gray-500 text-xs line-clamp-2">{scene.description}</p>
        </div>
      ))}</div>
    </div>
  );
};
export default ScriptPanel;