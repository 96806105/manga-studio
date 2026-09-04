import React, { useEffect } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { scenesState, selectedSceneIdState, shotsState } from '../store';
import { api } from '../api/client';
import { Wand2, Image, Film } from 'lucide-react';
import clsx from 'clsx';
interface SceneListProps { projectId: string; selectedSceneId: string | null; onSelectScene: (id: string) => void; onGenerateImage: (sid: string) => void; onGenerateVideo: (sid: string) => void; generating: boolean; }
const SceneList: React.FC<SceneListProps> = ({ projectId, selectedSceneId, onSelectScene, onGenerateImage, onGenerateVideo, generating }) => {
  const scenes = useRecoilValue(scenesState);
  const setShots = useSetRecoilState(shotsState);
  useEffect(() => { if (selectedSceneId) { api.getShots(selectedSceneId).then(s => setShots(s)).catch(() => {}); } }, [selectedSceneId]);
  const handleGenerateAll = async () => { for (const s of scenes) { const shots = await api.getShots(s.id); setShots(shots); for (const sh of shots) { if (!sh.image_url) await onGenerateImage(sh.id); if (!sh.video_url) await onGenerateVideo(sh.id); } } };
  return (
    <div>
      <div className="flex items-center justify-between p-3 border-b border-manga-border"><span className="text-sm text-gray-400">{scenes.length} 个场景</span>
        <button onClick={handleGenerateAll} disabled={generating} className="flex items-center gap-1 px-2 py-1 text-xs bg-manga-accent/20 text-manga-accent rounded hover:bg-manga-accent/30 disabled:opacity-50"><Film size={12} /> 全部生成</button>
      </div>
      <div className="divide-y divide-manga-border">
        {scenes.map(scene => (
          <button key={scene.id} onClick={() => onSelectScene(scene.id)} className={clsx('w-full text-left px-3 py-3 hover:bg-white/5 transition-colors', selectedSceneId === scene.id ? 'bg-studio-900/30 border-l-2 border-studio-500' : 'border-l-2 border-transparent')}>
            <div className="flex items-center gap-2 mb-1"><span className="text-xs bg-studio-600 text-white px-2 py-0.5 rounded">场景 {scene.scene_index + 1}</span></div>
            <h4 className="text-white text-sm font-medium truncate">{scene.title}</h4>
            <p className="text-gray-500 text-xs mt-1 line-clamp-2">{scene.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
export default SceneList;