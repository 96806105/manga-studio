import { atom } from 'recoil';
export const projectsState = atom({ key: 'projectsState', default: [] });
export const selectedProjectIdState = atom({ key: 'selectedProjectIdState', default: null });
export const scenesState = atom({ key: 'scenesState', default: [] });
export const selectedSceneIdState = atom({ key: 'selectedSceneIdState', default: null });
export const shotsState = atom({ key: 'shotsState', default: [] });
export const isGeneratingState = atom({ key: 'isGeneratingState', default: false });
export const generationProgressState = atom({ key: 'generationProgressState', default: 0 });
export const projectsLoadedState = atom({ key: 'projectsLoadedState', default: false });
//# sourceMappingURL=index.js.map