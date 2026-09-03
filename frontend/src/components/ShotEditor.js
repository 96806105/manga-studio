import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { shotsState, isGeneratingState, generationProgressState } from '../store';
import { api } from '../api/client';
import { Image, Film, Camera, Loader2 } from 'lucide-react';
import clsx from 'clsx';
const ShotEditor = () => {
    const [selectedShot, setSelectedShot] = useState(null);
    const [generating, setGenerating] = useRecoilState(isGeneratingState);
    const [progress, setProgress] = useRecoilState(generationProgressState);
    const shots = useRecoilValue(shotsState);
    const currentShot = shots.find(s => s.id === selectedShot);
    const handleGenerateImage = async () => {
        if (!selectedShot)
            return;
        setGenerating(true);
        setProgress(0);
        try {
            await api.generateImage(selectedShot);
            setProgress(100);
        }
        catch (err) {
            alert(err.message);
        }
        finally {
            setGenerating(false);
            setProgress(0);
        }
    };
    const handleGenerateVideo = async () => {
        if (!selectedShot)
            return;
        setGenerating(true);
        setProgress(0);
        try {
            await api.generateVideo(selectedShot, { resolution: '480p' });
            setProgress(100);
        }
        catch (err) {
            alert(err.message);
        }
        finally {
            setGenerating(false);
            setProgress(0);
        }
    };
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h3", { className: "text-white font-semibold", children: "Shot Editor" }), generating && (_jsxs("div", { className: "flex items-center gap-2 text-studio-400 text-sm", children: [_jsx(Loader2, { size: 16, className: "animate-spin" }), " ", progress, "%"] }))] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("h4", { className: "text-gray-400 text-sm mb-2", children: ["Shots (", shots.length, ")"] }), _jsx("div", { className: "space-y-2 max-h-64 overflow-y-auto", children: shots.map(shot => (_jsxs("button", { onClick: () => setSelectedShot(shot.id), className: clsx('w-full text-left px-3 py-2 rounded-lg text-sm transition-colors', selectedShot === shot.id ? 'bg-studio-900/50 border border-studio-500/50' : 'bg-manga-card border border-manga-border hover:border-gray-600'), children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Camera, { size: 12, className: "text-gray-500" }), _jsx("span", { className: "text-white truncate", children: shot.type })] }), shot.video_url && _jsx(Film, { size: 12, className: "text-green-500 mt-1 ml-4" }), shot.image_url && _jsx(Image, { size: 12, className: "text-blue-500 mt-1 ml-4" })] }, shot.id))) })] }), _jsx("div", { children: currentShot ? (_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "text-gray-400 text-sm mb-1 block", children: "Description" }), _jsx("textarea", { value: currentShot.description, onChange: (e) => api.updateShot(currentShot.id, { description: e.target.value }), className: "w-full bg-manga-bg border border-manga-border rounded-lg px-3 py-2 text-white text-sm focus:border-studio-500 focus:outline-none h-24 resize-none" })] }), _jsxs("div", { children: [_jsx("label", { className: "text-gray-400 text-sm mb-1 block", children: "Camera" }), _jsxs("select", { value: currentShot.camera_config?.angle || 'wide', onChange: (e) => { const c = { ...currentShot.camera_config, angle: e.target.value }; api.updateShot(currentShot.id, { camera_config: c }); }, className: "w-full bg-manga-bg border border-manga-border rounded-lg px-3 py-2 text-white text-sm", children: [_jsx("option", { value: "wide", children: "Wide" }), _jsx("option", { value: "medium", children: "Medium" }), _jsx("option", { value: "closeup", children: "Close-up" })] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsxs("button", { onClick: handleGenerateImage, disabled: generating, className: "flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-sm", children: [_jsx(Image, { size: 14 }), " Image"] }), _jsxs("button", { onClick: handleGenerateVideo, disabled: generating, className: "flex items-center gap-1.5 px-4 py-2 bg-manga-accent hover:bg-red-500 disabled:opacity-50 text-white rounded-lg text-sm", children: [_jsx(Film, { size: 14 }), " Video"] })] }), currentShot.image_url && _jsxs("div", { children: [_jsx("p", { className: "text-gray-500 text-xs mb-1", children: "Image" }), _jsx("img", { src: currentShot.image_url, className: "rounded-lg border border-manga-border" })] }), currentShot.video_url && _jsxs("div", { children: [_jsx("p", { className: "text-gray-500 text-xs mb-1", children: "Video" }), _jsx("video", { controls: true, src: currentShot.video_url, className: "rounded-lg border border-manga-border w-full" })] })] })) : (_jsx("div", { className: "flex items-center justify-center h-48 text-gray-500", children: _jsx("p", { children: "Select a shot" }) })) })] })] }));
};
export default ShotEditor;
//# sourceMappingURL=ShotEditor.js.map