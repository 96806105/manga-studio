import React, { useState } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { shotsState, selectedSceneIdState, isGeneratingState, generationProgressState } from '../store';
import { api } from '../api/client';
import { Image, Film, Camera, Loader2 } from 'lucide-react';
import clsx from 'clsx';

const ShotEditor: React.FC = () => {
  const [selectedShot, setSelectedShot] = useState<string | null>(null);
  const [generating, setGenerating] = useRecoilState(isGeneratingState);
  const [progress, setProgress] = useRecoilState(generationProgressState);
  const shots = useRecoilValue(shotsState);
  const currentShot = shots.find(s => s.id === selectedShot);

  const handleGenerateImage = async () => {
    if (!selectedShot) return;
    setGenerating(true);
    setProgress(0);
    try { await api.generateImage(selectedShot); setProgress(100); } catch (err: any) { alert(err.message); }
    finally { setGenerating(false); setProgress(0); }
  };

  const handleGenerateVideo = async () => {
    if (!selectedShot) return;
    setGenerating(true);
    setProgress(0);
    try { await api.generateVideo(selectedShot, { resolution: '480p' }); setProgress(100); } catch (err: any) { alert(err.message); }
    finally { setGenerating(false); setProgress(0); }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold">Shot Editor</h3>
        {generating && (
          <div className="flex items-center gap-2 text-studio-400 text-sm">
            <Loader2 size={16} className="animate-spin" /> {progress}%
          </div>
        )}
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h4 className="text-gray-400 text-sm mb-2">Shots ({shots.length})</h4>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {shots.map(shot => (
              <button key={shot.id} onClick={() => setSelectedShot(shot.id)} className={clsx('w-full text-left px-3 py-2 rounded-lg text-sm transition-colors', selectedShot === shot.id ? 'bg-studio-900/50 border border-studio-500/50' : 'bg-manga-card border border-manga-border hover:border-gray-600')}>
                <div className="flex items-center gap-2">
                  <Camera size={12} className="text-gray-500" />
                  <span className="text-white truncate">{shot.type}</span>
                </div>
                {shot.video_url && <Film size={12} className="text-green-500 mt-1 ml-4" />}
                {shot.image_url && <Image size={12} className="text-blue-500 mt-1 ml-4" />}
              </button>
            ))}
          </div>
        </div>
        <div>
          {currentShot ? (
            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Description</label>
                <textarea value={currentShot.description} onChange={(e) => api.updateShot(currentShot.id, { description: e.target.value })} className="w-full bg-manga-bg border border-manga-border rounded-lg px-3 py-2 text-white text-sm focus:border-studio-500 focus:outline-none h-24 resize-none" />
              </div>
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Camera</label>
                <select value={currentShot.camera_config?.angle || 'wide'} onChange={(e) => { const c = { ...currentShot.camera_config, angle: e.target.value }; api.updateShot(currentShot.id, { camera_config: c }); }} className="w-full bg-manga-bg border border-manga-border rounded-lg px-3 py-2 text-white text-sm">
                  <option value="wide">Wide</option>
                  <option value="medium">Medium</option>
                  <option value="closeup">Close-up</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button onClick={handleGenerateImage} disabled={generating} className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm"><Image size={14} /> Image</button>
                <button onClick={handleGenerateVideo} disabled={generating} className="flex items-center gap-1.5 px-4 py-2 bg-manga-accent hover:bg-red-500 disabled:opacity-50 text-white rounded-lg text-sm"><Film size={14} /> Video</button>
              </div>
              {currentShot.image_url && <div><p className="text-gray-500 text-xs mb-1">Image</p><img src={currentShot.image_url} className="rounded-lg border border-manga-border" /></div>}
              {currentShot.video_url && <div><p className="text-gray-500 text-xs mb-1">Video</p><video controls src={currentShot.video_url} className="rounded-lg border border-manga-border w-full" /></div>}
            </div>
          ) : (
            <div className="flex items-center justify-center h-48 text-gray-500"><p>Select a shot</p></div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShotEditor;