import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { selectedProjectIdState, projectsState } from './store';
import { api } from './api/client';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';
import Settings from './pages/Settings';
const App = () => {
    const [selectedProjectId, setSelectedProjectId] = useRecoilState(selectedProjectIdState);
    const setProjects = useSetRecoilState(projectsState);
    useEffect(() => { api.getProjects().then(p => setProjects(p)).catch(() => { }); }, []);
    return (_jsxs("div", { className: "h-screen flex flex-col bg-manga-bg", children: [_jsx(Header, {}), _jsxs("div", { className: "flex flex-1 overflow-hidden", children: [_jsx(Sidebar, { selectedProjectId: selectedProjectId, onSelectProject: setSelectedProjectId }), _jsx("main", { className: "flex-1 overflow-hidden", children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/dashboard", replace: true }) }), _jsx(Route, { path: "/dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "/project/:id", element: _jsx(ProjectDetail, {}) }), _jsx(Route, { path: "/settings", element: _jsx(Settings, {}) }), _jsx(Route, { path: "*", element: _jsx(Navigate, { to: "/dashboard", replace: true }) })] }) })] })] }));
};
export default App;
//# sourceMappingURL=App.js.map