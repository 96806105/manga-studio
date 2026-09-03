import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { selectedSceneIdState, isGeneratingState, generationProgressState, scenesState, shotsState } from '../store';
import { api } from '../api/client';
import { ArrowLeft, Wand2, Image, Film, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import SceneList from '../components/SceneList';
import ShotEditor from '../components/ShotEditor';
import ScriptPanel from '../components/ScriptPanel';
import VideoPlayer from '../components/VideoPlayer';
type Tab = 'script' | 'storyboard' | 'video';
const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const projectId = id || '';
  const [activeTab, setActiveTab] = React.useState<Tab>('script');
  const [selectedSceneId, setSelectedSceneId] = useRecoilState(selectedSceneIdState);
  const setScenes = useSetRecoilState(scenesState);
  const setShots = useSetRecoilState(shotsState);
  const [generating, setGenerating] = useRecoilState(isGeneratingState);
  const [progress, setProgress] = useRecoilState(generationProgressState);
  useEffect(() => {
    api.getScenes(projectId).then(scenes => { setScenes(scenes); return api.getShots(scenes.length > 0 ? scenes[0].id : ''); }).then(shots => { setShots(shots); }).catch(() => {});
  }, [projectId]);
  const handleGenerateScript = async (storyInput: string) => { setGenerating(true); setProgress(0); try { await api.generateScript(projectId, storyInput, 8); } catch (err: any) { alert(err.message); } finally { setGenerating(false); setProgress(0); } };
  const handleGenerateImage = async (shotId: string) => { setGenerating(true); setProgress(0); try { await api.generateImage(shotId); setProgress(100); } catch (err: any) { alert(err.message); } finally { setGenerating(false); setProgress(0); } };
  const handleGenerateVideo = async (shotId: string) => { setGenerating(true); setProgress(0); try { await api.generateVideo(shotId, { resolution: '480p' }); setProgress(100); } catch (err: any) { alert(err.message); } finally { setGenerating(false); setProgress(0); } };
  const tabs: [Tab, string, any][] = [['script', 'Script', Wand2], ['storyboard', 'Storyboard', Image], ['video', 'Video', Film]];
  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-manga-border">
        <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white"><ArrowLeft size={20} /></button>
        <h2 className="text-white font-semibold flex-1">{projectId}</h2>
        {generating && <div className="flex items-center gap-2 text-studio-400 text-sm"><Loader2 size={16} className="animate-spin" />{progress}%</div>}
      </div>
      <div className="flex border-b border-manga-border">
        {tabs.map(([tabId, label, Icon]) => (
          <button key={tabId} onClick={() => setActiveTab(tabId)} className={clsx('flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors', activeTab === tabId ? 'border-studio-500 text-studio-400' : 'border-transparent text-gray-500 hover:text-gray-300')}><Icon size={16} />{label}</button>
        ))}
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-72 border-r border-manga-border overflow-y-auto bg-manga-surface">
          {activeTab === 'script' && <ScriptPanel projectId={projectId} onGenerate={handleGenerateScript} generating={generating} />}
          {activeTab === 'storyboard' && <SceneList projectId={projectId} selectedSceneId={selectedSceneId} onSelectScene={setSelectedSceneId} onGenerateImage={handleGenerateImage} onGenerateVideo={handleGenerateVideo} generating={generating} />}
          {activeTab === 'video' && <VideoPlayer />}
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {selectedSceneId && activeTab === 'storyboard' && <ShotEditor />}
          {!selectedSceneId && activeTab === 'storyboard' && <div className="flex items-center justify-center h-full text-gray-500"><p>Select a scene to edit</p></div>}
        </div>
      </div>
    </div>
  );
};
export default ProjectDetail;