import React from 'react';
interface ScriptPanelProps {
    projectId: string;
    onGenerate: (story: string) => Promise<void>;
    generating: boolean;
}
declare const ScriptPanel: React.FC<ScriptPanelProps>;
export default ScriptPanel;
//# sourceMappingURL=ScriptPanel.d.ts.map