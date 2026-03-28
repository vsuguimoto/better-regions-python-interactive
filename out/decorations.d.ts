import * as vscode from 'vscode';
import { Region } from './types';
export declare class DecorationManager {
    private decorationTypes;
    private currentEditor;
    private decorationKeys;
    dispose(): void;
    updateDecorations(editor: vscode.TextEditor, regions: Region[]): void;
    private findRegionContainingLine;
    private collectAndApplyDecorations;
    private applyDecoration;
    private removeOldDecorations;
    clearDecorations(): void;
}
//# sourceMappingURL=decorations.d.ts.map