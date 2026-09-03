export interface Project {
    id: string;
    name: string;
    description: string;
    status: string;
    created_at: string;
    updated_at: string;
    cover_image?: string;
    export_path?: string;
}
export declare const projectsState: import("recoil").RecoilState<Project[]>;
export declare const selectedProjectIdState: import("recoil").RecoilState<string | null>;
export declare const scenesState: import("recoil").RecoilState<any[]>;
export declare const selectedSceneIdState: import("recoil").RecoilState<string | null>;
export declare const shotsState: import("recoil").RecoilState<any[]>;
export declare const isGeneratingState: import("recoil").RecoilState<boolean>;
export declare const generationProgressState: import("recoil").RecoilState<number>;
export declare const projectsLoadedState: import("recoil").RecoilState<boolean>;
//# sourceMappingURL=index.d.ts.map