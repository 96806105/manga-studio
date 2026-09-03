import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useRecoilValue } from 'recoil';
import { selectedProjectIdState, isGeneratingState, generationProgressState } from '../store';
import { api } from '../api/client';
import { useNavigate } from 'react-router-dom';
import { Download, Wand2 } from 'lucide-react';
const Header = () => {
    const navigate = useNavigate();
    const projectId = useRecoilValue(selectedProjectIdState);
    const isGenerating = useRecoilValue(isGeneratingState);
    const progress = useRecoilValue(generationProgressState);
    const handleExport = async () => {
        if (!projectId)
            return;
        try {
            await api.exportProject(projectId, { format: 'mp4', resolution: '480p', framerate: 24 });
            alert('Export completed!');
        }
        catch (err) {
            alert(err.message);
        }
    };
    return (_jsxs("header", { className: "h-12 glass border-b border-manga-border flex items-center justify-between px-4 flex-shrink-0", children: [_jsx("div", { className: "flex items-center gap-4", children: projectId && _jsx("div", { className: "flex items-center gap-2", children: _jsx("span", { className: "text-sm text-gray-400", children: isGenerating ? `Generating... ${progress}%` : 'Ready' }) }) }), _jsx("div", { className: "flex items-center gap-3", children: projectId && _jsxs(_Fragment, { children: [_jsxs("button", { onClick: () => navigate(`/project/${projectId}`), className: "px-3 py-1.5 text-sm text-gray-300 hover:text-white rounded-md hover:bg-white/5 transition-colors", children: [_jsx(Wand2, { size: 14, className: "inline mr-1" }), " Generate"] }), _jsxs("button", { onClick: handleExport, className: "flex items-center gap-1.5 px-3 py-1.5 text-sm bg-manga-accent hover:bg-red-500 text-white rounded-md transition-colors", children: [_jsx(Download, { size: 14 }), " Export"] })] }) })] }));
};
export default Header;
//# sourceMappingURL=Header.js.map