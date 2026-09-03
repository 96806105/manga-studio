import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { projectsState, selectedProjectIdState } from '../store';
import { FolderOpen, LayoutDashboard, Settings, Plus } from 'lucide-react';
import clsx from 'clsx';
interface SidebarProps { selectedProjectId: string | null; onSelectProject: (id: string | null) => void; }
const Sidebar: React.FC<SidebarProps> = ({ selectedProjectId, onSelectProject }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const projects = useRecoilValue(projectsState);
  const isActive = (path: string) => location.pathname === path;
  return (
    <aside className="w-56 glass border-r border-manga-border flex flex-col h-full">
      <div className="p-4 border-b border-manga-border">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-studio-500 to-manga-accent2 flex items-center justify-center"><span className="text-white font-bold text-sm">M</span></div>
          <span className="text-white font-semibold text-base">Manga Studio</span>
        </div>
        <button onClick={() => { const n = prompt('Project name:'); if (n) { onSelectProject(n); navigate(`/project/${n}`); } }} className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-studio-600 hover:bg-studio-700 text-white rounded-lg text-sm font-medium transition-colors"><Plus size={16} /> New</button>
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-3 mb-1"><span className="text-xs text-gray-500 uppercase tracking-wider font-medium">Projects</span></div>
        {projects.map(p => (
          <button key={p.id} onClick={() => onSelectProject(p.id)} className={clsx('w-full flex items-center gap-2 px-3 py-2 text-sm transition-colors group', selectedProjectId === p.id ? 'bg-studio-900/50 text-studio-300 border-r-2 border-studio-500' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200')}>
            <FolderOpen size={14} className="flex-shrink-0" /><span className="truncate flex-1 text-left">{p.name}</span>
          </button>
        ))}
      </div>
      <div className="p-3 border-t border-manga-border">
        <button onClick={() => navigate('/dashboard')} className={clsx('w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors', isActive('/dashboard') ? 'bg-studio-900/50 text-studio-300' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200')}><LayoutDashboard size={14} /> Dashboard</button>
        <button onClick={() => navigate('/settings')} className={clsx('w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg transition-colors mt-1', isActive('/settings') ? 'bg-studio-900/50 text-studio-300' : 'text-gray-400 hover:bg-white/5 hover:text-gray-200')}><Settings size={14} /> Settings</button>
      </div>
    </aside>
  );
};
export default Sidebar;