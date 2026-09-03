import { atom } from 'recoil';
export interface Project { id: string; name: string; description: string; status: string; created_at: string; updated_at: string; cover_image?: string; export_path?: string }
export const projectsState = atom<Project[]>({ key: 'projectsState', default: [] });
export const selectedProjectIdState = atom<string | null>({ key: 'selectedProjectIdState', default: null });
export const scenesState = atom<any[]>({ key: 'scenesState', default: [] });
export const selectedSceneIdState = atom<string | null>({ key: 'selectedSceneIdState', default: null });
export const shotsState = atom<any[]>({ key: 'shotsState', default: [] });
export const isGeneratingState = atom<boolean>({ key: 'isGeneratingState', default: false });
export const generationProgressState = atom<number>({ key: 'generationProgressState', default: 0 });
export const projectsLoadedState = atom<boolean>({ key: 'projectsLoadedState', default: false });