const API_BASE = '/api/v1';
async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, { headers: { 'Content-Type': 'application/json' }, ...options });
  const data = await res.json();
  if (!data.success) throw new Error(data.error || 'Request failed');
  return data;
}
export const api = {
  getProjects: () => request<any[]>('/projects'),
  createProject: (d: any) => request<any>('/projects', { method: 'POST', body: JSON.stringify(d) }),
  updateProject: (id: string, d: any) => request<any>(`/projects/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
  deleteProject: (id: string) => request<any>(`/projects/${id}`, { method: 'DELETE' }),
  getProjectStats: (id: string) => request<any>(`/projects/${id}/stats`),
  getScenes: (pid: string) => request<any[]>(`/scenes/project/${pid}`),
  createScene: (pid: string, d: any) => request<any>(`/scenes/project/${pid}`, { method: 'POST', body: JSON.stringify(d) }),
  updateScene: (id: string, d: any) => request<any>(`/scenes/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
  deleteScene: (id: string) => request<any>(`/scenes/${id}`, { method: 'DELETE' }),
  getShots: (sid: string) => request<any[]>(`/shots/scene/${sid}`),
  createShot: (sid: string, d: any) => request<any>(`/shots/scene/${sid}`, { method: 'POST', body: JSON.stringify(d) }),
  updateShot: (id: string, d: any) => request<any>(`/shots/${id}`, { method: 'PUT', body: JSON.stringify(d) }),
  deleteShot: (id: string) => request<any>(`/shots/${id}`, { method: 'DELETE' }),
  generateScript: (pid: string, story: string, ch?: number) => request<any>(`/generation/script`, { method: 'POST', body: JSON.stringify({ project_id: pid, story_input: story, chapters: ch }) }),
  generateImage: (sid: string) => request<any>(`/generation/shot/${sid}/image`, { method: 'POST' }),
  generateVideo: (sid: string, cfg: any) => request<any>(`/generation/shot/${sid}/video`, { method: 'POST', body: JSON.stringify(cfg) }),
  exportProject: (pid: string, s: any) => request<any>('/export', { method: 'POST', body: JSON.stringify({ project_id: pid, settings: s }) }),
  getSettings: () => request<any>('/settings'),
  updateSettings: (d: any) => request<any>('/settings', { method: 'PUT', body: JSON.stringify(d) }),
  health: () => request<any>('/health'),
};