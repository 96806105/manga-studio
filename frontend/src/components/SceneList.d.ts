import React from 'react';
interface SceneListProps {
    projectId: string;
    selectedSceneId: string | null;
    onSelectScene: (id: string) => void;
    onGenerateImage: (sid: string) => void;
    onGenerateVideo: (sid: string) => void;
    generating: boolean;
}
declare const SceneList: React.FC<SceneListProps>;
export default SceneList;
//# sourceMappingURL=SceneList.d.ts.map