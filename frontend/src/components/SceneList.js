import { jsxs as _jsxs, jsx as _jsx } from "react/jsx-runtime";
import { useRecoilValue } from 'recoil';
import { scenesState } from '../store';
import { api } from '../api/client';
import { Film } from 'lucide-react';
import clsx from 'clsx';
const SceneList = ({ projectId, selectedSceneId, onSelectScene, onGenerateImage, onGenerateVideo, generating }) => {
    const scenes = useRecoilValue(scenesState);
    const handleGenerateAll = async () => { for (const s of scenes) {
        const shots = await api.getShots(s.id);
        for (const sh of shots) {
            if (!sh.image_url)
                await onGenerateImage(sh.id);
            if (!sh.video_url)
                await onGenerateVideo(sh.id);
        }
    } };
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex items-center justify-between p-3 border-b border-manga-border", children: [_jsxs("span", { className: "text-sm text-gray-400", children: [scenes.length, " scenes"] }), _jsxs("button", { onClick: handleGenerateAll, disabled: generating, className: "flex items-center gap-1 px-2 py-1 text-xs bg-manga-accent/20 text-manga-accent rounded hover:bg-manga-accent/30 disabled:opacity-50", children: [_jsx(Film, { size: 12 }), " All"] })] }), _jsx("div", { className: "divide-y divide-manga-border", children: scenes.map(scene => (_jsxs("button", { onClick: () => onSelectScene(scene.id), className: clsx('w-full text-left px-3 py-3 hover:bg-white/5 transition-colors', selectedSceneId === scene.id ? 'bg-studio-900/30 border-l-2 border-studio-500' : 'border-l-2 border-transparent'), children: [_jsx("div", { className: "flex items-center gap-2 mb-1", children: _jsxs("span", { className: "text-xs bg-studio-600 text-white px-2 py-0.5 rounded", children: ["Scene ", scene.scene_index + 1] }) }), _jsx("h4", { className: "text-white text-sm font-medium truncate", children: scene.title }), _jsx("p", { className: "text-gray-500 text-xs mt-1 line-clamp-2", children: scene.description })] }, scene.id))) })] }));
};
export default SceneList;
//# sourceMappingURL=SceneList.js.map