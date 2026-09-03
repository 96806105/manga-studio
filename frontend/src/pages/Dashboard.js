import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useRecoilState } from 'recoil';
import { projectsState, selectedProjectIdState } from '../store';
import { api } from '../api/client';
import { Plus, Trash2, Video } from 'lucide-react';
const statusColors = { draft: 'bg-gray-600', script: 'bg-blue-600', storyboard: 'bg-yellow-600', producing: 'bg-purple-600', editing: 'bg-orange-600', exported: 'bg-green-600' };
const Dashboard = () => {
    const navigate = useNavigate();
    const projects = useRecoilValue(projectsState);
    const [, setSelectedProjectId] = useRecoilState(selectedProjectIdState);
    if (projects.length === 0)
        return _jsx("div", { className: "h-full flex items-center justify-center", children: _jsxs("div", { className: "text-center", children: [_jsx(Video, { size: 48, className: "mx-auto mb-4 opacity-30" }), _jsx("p", { className: "text-lg", children: "No projects yet" }), _jsx("p", { className: "text-sm mt-1", children: "Create your first AI manga/drama project" })] }) });
    return _jsxs("div", { className: "h-full p-6 overflow-y-auto", children: [_jsxs("div", { className: "flex items-center justify-between mb-6", children: [_jsx("h1", { className: "text-2xl font-bold text-white", children: "My Projects" }), _jsxs("button", { onClick: () => { const n = prompt('Project name:'); if (n) {
                            setSelectedProjectId(n);
                            navigate(`/project/${n}`);
                        } }, className: "flex items-center gap-2 px-4 py-2 bg-studio-600 hover:bg-studio-700 text-white rounded-lg text-sm", children: [_jsx(Plus, { size: 16 }), " New"] })] }), _jsx("div", { className: "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4", children: projects.map(p => (_jsxs("div", { onClick: () => { setSelectedProjectId(p.id); navigate(`/project/${p.id}`); }, className: "glass glass-hover rounded-xl p-4 cursor-pointer group transition-all", children: [_jsxs("div", { className: "flex items-start justify-between mb-3", children: [_jsx("div", { className: "w-10 h-10 rounded-lg bg-gradient-to-br from-studio-600 to-manga-accent2 flex items-center justify-center", children: _jsx(Video, { size: 20, className: "text-white" }) }), _jsx("span", { className: `text-xs px-2 py-1 rounded-full text-white ${statusColors[p.status] || 'bg-gray-600'}`, children: p.status })] }), _jsx("h3", { className: "text-white font-medium text-sm mb-1 truncate", children: p.name }), _jsx("p", { className: "text-gray-500 text-xs truncate", children: p.description }), _jsx("div", { className: "flex items-center gap-2 mt-3", children: _jsx("button", { onClick: (e) => { e.stopPropagation(); if (confirm('Delete?')) {
                                    api.deleteProject(p.id).catch(alert);
                                } }, className: "opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all", children: _jsx(Trash2, { size: 14 }) }) })] }, p.id))) })] });
};
export default Dashboard;
//# sourceMappingURL=Dashboard.js.map