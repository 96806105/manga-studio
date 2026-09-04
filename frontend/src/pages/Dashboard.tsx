import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilValue, useRecoilState } from 'recoil';
import { projectsState, selectedProjectIdState } from '../store';
import { api } from '../api/client';
import { FolderOpen, Plus, Trash2, Video } from 'lucide-react';
import clsx from 'clsx';
const statusColors: Record<string, string> = { draft: 'bg-gray-600', script: 'bg-blue-600', storyboard: 'bg-yellow-600', producing: 'bg-purple-600', editing: 'bg-orange-600', exported: 'bg-green-600' };
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const projects = useRecoilValue(projectsState);
  const [, setSelectedProjectId] = useRecoilState(selectedProjectIdState);
  if (projects.length === 0) return <div className="h-full flex items-center justify-center"><div className="text-center"><Video size={48} className="mx-auto mb-4 opacity-30" /><p className="text-lg">暂无项目</p><p className="text-sm mt-1">创建你的第一个 AI 漫画/短剧项目</p></div></div>;
  return <div className="h-full p-6 overflow-y-auto"><div className="flex items-center justify-between mb-6"><h1 className="text-2xl font-bold text-white">我的项目</h1><button onClick={() => { const n = prompt('项目名称:'); if (n) { setSelectedProjectId(n); navigate(`/project/${n}`); } }} className="flex items-center gap-2 px-4 py-2 bg-studio-600 hover:bg-studio-700 text-white rounded-lg text-sm"><Plus size={16} /> 新建</button></div><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{projects.map(p => (<div key={p.id} onClick={() => { setSelectedProjectId(p.id); navigate(`/project/${p.id}`); }} className="glass glass-hover rounded-xl p-4 cursor-pointer group transition-all"><div className="flex items-start justify-between mb-3"><div className="w-10 h-10 rounded-lg bg-gradient-to-br from-studio-600 to-manga-accent2 flex items-center justify-center"><Video size={20} className="text-white" /></div><span className={`text-xs px-2 py-1 rounded-full text-white ${statusColors[p.status] || 'bg-gray-600'}`}>{p.status}</span></div><h3 className="text-white font-medium text-sm mb-1 truncate">{p.name}</h3><p className="text-gray-500 text-xs truncate">{p.description}</p><div className="flex items-center gap-2 mt-3"><button onClick={(e) => { e.stopPropagation(); if (confirm('确定删除?')) { api.deleteProject(p.id).catch(alert); } }} className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-all"><Trash2 size={14} /></button></div></div>))}</div></div>;
};
export default Dashboard;