import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { projectsState } from '../store';
import { FolderOpen, LayoutDashboard, Settings, Plus } from 'lucide-react';
import clsx from 'clsx';
const Sidebar = ({ selectedProjectId, onSelectProject }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const projects = useRecoilValue(projectsState);
    const isActive = (path) => location.pathname === path;
    return (_jsxs("aside", { className: "w-56 glass border-r border-manga-border flex flex-col h-full", children: [_jsxs("div", { className: "p-4 border-b border-manga-border", children: [_jsxs("div", { className: "flex items-center gap-2 mb-4", children: [_jsx("div", { className: "w-8 h-8 rounded-lg bg-gradient-to-br from-studio-500 to-manga-accent2 flex items-center justify-center", children: _jsx("span", { className: "text-white font-bold text-sm", children: "M" }) }), _jsx("span", { className: "text-white font-semibold text-base", children: "Manga Studio" })] }), _jsxs("button", { onClick: () => { const n = prompt('Project name:'); if (n) {
                            onSelectProject(n);
                            navigate(`/project/${n}`);
                        } }, className: "w-full flex items-center justify-center gap-2 px-3 py-2 bg-studio-600 hover:bg-studio-700 text-white rounded-lg text-sm font-medium transition-colors", children: [_jsx(Plus, { size: 16 }), " New"] })] }), _jsxs("div", { className: "flex-1 overflow-y-auto py-2", children: [_jsx("div", { className: "px-3 mb-1", children: _jsx("span", { className: "text-xs text-gray-500 uppercase tracking-wider font-medium", children: "Projects" }) }), projects.map(p => (_jsxs("button", { onClick: () => onSelectProject(p.id), className: clsx('w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors group', selectedProjectId === p.id ? 'bg-studio-900/50 text-studio-300 border-r-2 border-studio-500' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'), children: [_jsx(FolderOpen, { size: 14, className: "flex-shrink-0" }), _jsx("span", { className: "truncate flex-1 text-left", children: p.name })] }, p.id)))] }), _jsxs("div", { className: "p-3 border-t border-manga-border", children: [_jsxs("button", { onClick: () => navigate('/dashboard'), className: clsx('w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors', isActive('/dashboard') ? 'bg-studio-900/50 text-studio-300' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'), children: [_jsx(LayoutDashboard, { size: 14 }), " Dashboard"] }), _jsxs("button", { onClick: () => navigate('/settings'), className: clsx('w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors mt-1', isActive('/settings') ? 'bg-studio-900/50 text-studio-300' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200'), children: [_jsx(Settings, { size: 14 }), " Settings"] })] })] }));
};
export default Sidebar;
//# sourceMappingURL=Sidebar.js.map