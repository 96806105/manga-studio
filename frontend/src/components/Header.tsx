import React from 'react';
import { useRecoilValue } from 'recoil';
import { selectedProjectIdState, isGeneratingState, generationProgressState } from '../store';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';
import { Download, Wand2, Loader2 } from 'lucide-react';
const Header: React.FC = () => {
  const navigate = useNavigate();
  const projectId = useRecoilValue(selectedProjectIdState);
  const isGenerating = useRecoilValue(isGeneratingState);
  const progress = useRecoilValue(generationProgressState);
  const handleExport = async () => {
    if (!projectId) return;
    try { await api.exportProject(projectId, { format: 'mp4', resolution: '480p', framerate: 24 }); alert('导出完成!'); } catch (err: any) { alert(err.message); }
  };
  return (
    <header className="h-12 glass border-b border-manga-border flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-4">
        {projectId && <div className="flex items-center gap-2"><span className="text-sm text-gray-400">{isGenerating ? `生成中... ${progress}%` : '就绪'}</span></div>}
      </div>
      <div className="flex items-center gap-3">
        {projectId && <>
          <button onClick={() => navigate(`/project/${projectId}`)} className="px-3 py-1.5 text-sm text-gray-300 hover:text-white rounded-md hover:bg-white/5 transition-colors"><Wand2 size={14} className="inline mr-1" /> 生成</button>
          <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-manga-accent hover:bg-red-500 text-white rounded-md transition-colors"><Download size={14} /> 导出</button>
        </>}
      </div>
    </header>
  );
};
export default Header;