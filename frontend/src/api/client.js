const API_BASE = '/api/v1';
async function request(url, options) {
    const res = await fetch(`${API_BASE}${url}`, { headers: { 'Content-Type': 'application/json' }, ...options });
    const data = await res.json();
    if (!data.success)
        throw new Error(data.error || 'Request failed');
    return data;
}
export const api = {
    getProjects: () => request('/projects'),
    createProject: (d) => request('/projects', { method: 'POST', body: JSON.stringify(d) }),
    updateProject: (id, d) => request(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
    deleteProject: (id) => request(`/projects/${id}`, { method: 'DELETE' }),
    getProjectStats: (id) => request(`/projects/${id}/stats`),
    getScenes: (pid) => request(`/scenes/project/${pid}`),
    createScene: (pid, d) => request(`/scenes/project/${pid}`, { method: 'POST', body: JSON.stringify(d) }),
    updateScene: (id, d) => request(`/scenes/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
    getShots: (sid) => request(`/shots/scene/${sid}`),
    createShot: (sid, d) => request(`/shots/scene/${sid}`, { method: 'POST', body: JSON.stringify(d) }),
    updateShot: (id, d) => request(`/shots/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
    generateScript: (pid, story, ch) => request(`/generation/script`, { method: 'POST', body: JSON.stringify({ project_id: pid, story_input: story, chapters: ch }) }),
    generateImage: (sid) => request(`/generation/shot/${sid}/image`, { method: 'POST' }),
    generateVideo: (sid, cfg) => request(`/generation/shot/${sid}/video`, { method: 'POST', body: JSON.stringify(cfg) }),
    exportProject: (pid, s) => request('/export', { method: 'POST', body: JSON.stringify({ project_id: pid, settings: s }) }),
    health: () => request('/health'),
};
//# sourceMappingURL=client.js.map