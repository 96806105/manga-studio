import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { selectedProjectIdState, projectsState } from './store';
import { api } from './api/client';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import Settings from './pages/Settings';
const App: React.FC = () => {
  const [selectedProjectId, setSelectedProjectId] = useRecoilState(selectedProjectIdState);
  const setProjects = useSetRecoilState(projectsState);
  useEffect(() => { api.getProjects().then(p => setProjects(p)).catch(() => {}); }, []);
  return (
    <div className="h-screen flex flex-col bg-manga-bg">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar selectedProjectId={selectedProjectId} onSelectProject={setSelectedProjectId} />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};
export default App;