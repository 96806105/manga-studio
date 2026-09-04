import { atom } from 'recoil';
export interface Project { id: string; name: string; description: string; status: string; created_at: string; updated_at: string; cover_image?: string; export_path?: string }
export const projectsState = atom<Project[]>({ key: 'projectsState', default: [] });
export const selectedProjectIdState = atom<string | null>({ key: 'selectedProjectIdState', default: null });
export interface Scene { id: string; project_id: string; chapter_index: number; scene_index: number; title: string; description: string; mood: string; characters: string[]; script_content: string; status: string; created_at: string; updated_at: string }
export const scenesState = atom<Scene[]>({ key: 'scenesState', default: [] });
export interface Shot { id: string; scene_id: string; shot_index: number; type: string; description: string; image_url?: string; video_url?: string; thumbnail_url?: string; camera_config: { angle: string; movement: string; duration: number }; status: string; generation_progress: number; created_at: string; updated_at: string }
export const shotsState = atom<Shot[]>({ key: 'shotsState', default: [] });
export const selectedSceneIdState = atom<string | null>({ key: 'selectedSceneIdState', default: null });
export const isGeneratingState = atom<boolean>({ key: 'isGeneratingState', default: false });
export const generationProgressState = atom<number>({ key: 'generationProgressState', default: 0 });
export const projectsLoadedState = atom<boolean>({ key: 'projectsLoadedState', default: false });