export declare const api: {
    getProjects: () => Promise<any[]>;
    createProject: (d: any) => Promise<any>;
    updateProject: (id: string, d: any) => Promise<any>;
    deleteProject: (id: string) => Promise<any>;
    getProjectStats: (id: string) => Promise<any>;
    getScenes: (pid: string) => Promise<any[]>;
    createScene: (pid: string, d: any) => Promise<any>;
    updateScene: (id: string, d: any) => Promise<any>;
    getShots: (sid: string) => Promise<any[]>;
    createShot: (sid: string, d: any) => Promise<any>;
    updateShot: (id: string, d: any) => Promise<any>;
    generateScript: (pid: string, story: string, ch?: number) => Promise<any>;
    generateImage: (sid: string) => Promise<any>;
    generateVideo: (sid: string, cfg: any) => Promise<any>;
    exportProject: (pid: string, s: any) => Promise<any>;
    health: () => Promise<any>;
};
//# sourceMappingURL=client.d.ts.map