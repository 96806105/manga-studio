import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { selectedSceneIdState, isGeneratingState, generationProgressState } from '../store';
import { api } from '../api/client';
import { ArrowLeft, Wand2, Image, Film, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import SceneList from '../components/SceneList';
import ShotEditor from '../components/ShotEditor';
import ScriptPanel from '../components/ScriptPanel';
import VideoPlayer from '../components/VideoPlayer';
const ProjectDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const projectId = id || '';
    const [activeTab, setActiveTab] = React.useState('script');
    const [selectedSceneId, setSelectedSceneId] = useRecoilState(selectedSceneIdState);
    const [generating, setGenerating] = useRecoilState(isGeneratingState);
    const [progress, setProgress] = useRecoilState(generationProgressState);
    useEffect(() => { api.getScenes(projectId); api.getShots(projectId ? '' : ''); }, []);
    const handleGenerateScript = async (storyInput) => { setGenerating(true); setProgress(0); try {
        await api.generateScript(projectId, storyInput, 8);
    }
    catch (err) {
        alert(err.message);
    }
    finally {
        setGenerating(false);
        setProgress(0);
    } };
    const handleGenerateImage = async (shotId) => { setGenerating(true); setProgress(0); try {
        await api.generateImage(shotId);
        setProgress(100);
    }
    catch (err) {
        alert(err.message);
    }
    finally {
        setGenerating(false);
        setProgress(0);
    } };
    const handleGenerateVideo = async (shotId) => { setGenerating(true); setProgress(0); try {
        await api.generateVideo(shotId, { resolution: '480p' });
        setProgress(100);
    }
    catch (err) {
        alert(err.message);
    }
    finally {
        setGenerating(false);
        setProgress(0);
    } };
    const tabs = [['script', 'Script', Wand2], ['storyboard', 'Storyboard', Image], ['video', 'Video', Film]];
    return (_jsxs("div", { className: "h-full flex flex-col", children: [_jsxs("div", { className: "flex items-center gap-3 px-4 py-3 border-b border-manga-border", children: [_jsx("button", { onClick: () => navigate('/dashboard'), className: "text-gray-400 hover:text-white", children: _jsx(ArrowLeft, { size: 20 }) }), _jsx("h2", { className: "text-white font-semibold flex-1", children: projectId }), generating && _jsxs("div", { className: "flex items-center gap-2 text-studio-400 text-sm", children: [_jsx(Loader2, { size: 16, className: "animate-spin" }), progress, "%"] })] }), _jsx("div", { className: "flex border-b border-manga-border", children: tabs.map(([tabId, label, Icon]) => (_jsxs("button", { onClick: () => setActiveTab(tabId), className: clsx('flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors', activeTab === tabId ? 'border-studio-500 text-studio-400' : 'border-transparent text-gray-500 hover:text-gray-300'), children: [_jsx(Icon, { size: 16 }), label] }, tabId))) }), _jsxs("div", { className: "flex flex-1 overflow-hidden", children: [_jsxs("div", { className: "w-72 border-r border-manga-border overflow-y-auto bg-manga-surface", children: [activeTab === 'script' && _jsx(ScriptPanel, { projectId: projectId, onGenerate: handleGenerateScript, generating: generating }), activeTab === 'storyboard' && _jsx(SceneList, { projectId: projectId, selectedSceneId: selectedSceneId, onSelectScene: setSelectedSceneId, onGenerateImage: handleGenerateImage, onGenerateVideo: handleGenerateVideo, generating: generating }), activeTab === 'video' && _jsx(VideoPlayer, {})] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4", children: [selectedSceneId && activeTab === 'storyboard' && _jsx(ShotEditor, {}), !selectedSceneId && activeTab === 'storyboard' && _jsx("div", { className: "flex items-center justify-center h-full text-gray-500", children: _jsx("p", { children: "Select a scene to edit" }) })] })] })] }));
};
export default ProjectDetail;
//# sourceMappingURL=ProjectDetail.js.map