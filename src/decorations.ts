import * as vscode from 'vscode';
import { Region, getRegionConfig } from './types';
import { generateRegionColors, GeneratedColors } from './colorGenerator';

export class DecorationManager {
    private decorationTypes: Map<string, vscode.TextEditorDecorationType> = new Map();
    private currentEditor: vscode.TextEditor | null = null;
    private decorationKeys: Set<string> = new Set();
    
    dispose() {
        this.decorationTypes.forEach(type => type.dispose());
        this.decorationTypes.clear();
        this.decorationKeys.clear();
    }
    
    updateDecorations(editor: vscode.TextEditor, regions: Region[]) {
        const config = getRegionConfig();
        
        if (!config.enabled) {
            this.clearDecorations();
            return;
        }
        
        this.currentEditor = editor;
        const newKeys = new Set<string>();
        
        this.collectAndApplyDecorations(regions, config, editor, newKeys);
        
        this.removeOldDecorations(newKeys);
    }
    
    private collectAndApplyDecorations(
        regions: Region[],
        config: ReturnType<typeof getRegionConfig>,
        editor: vscode.TextEditor,
        newKeys: Set<string>
    ) {
        for (const region of regions) {
            const colors = generateRegionColors(
                region.name,
                region.depth,
                config.saturation,
                config.lightness,
                config.opacity
            );
            
            const key = `${region.startLine}-${region.endLine}`;
            newKeys.add(key);
            
            if (!this.decorationTypes.has(key)) {
                const decorationType = vscode.window.createTextEditorDecorationType({
                    isWholeLine: false,
                    light: {
                        backgroundColor: colors.background,
                        borderStyle: 'solid',
                        borderWidth: '1px',
                        borderColor: colors.border,
                    },
                    dark: {
                        backgroundColor: colors.background,
                        borderStyle: 'solid',
                        borderWidth: '1px',
                        borderColor: colors.border,
                    },
                });
                this.decorationTypes.set(key, decorationType);
            }
            
            const startPos = new vscode.Position(region.startLine, 0);
            const endPos = new vscode.Position(region.endLine, 0);
            const range = new vscode.Range(startPos, endPos);
            
            const decorationType = this.decorationTypes.get(key)!;
            editor.setDecorations(decorationType, [{ range, hoverMessage: `Region: ${region.name}` }]);
            
            if (region.children.length > 0) {
                this.collectAndApplyDecorations(region.children, config, editor, newKeys);
            }
        }
    }
    
    private removeOldDecorations(newKeys: Set<string>) {
        const keysToRemove: string[] = [];
        
        this.decorationKeys.forEach(key => {
            if (!newKeys.has(key)) {
                const type = this.decorationTypes.get(key);
                if (type) {
                    type.dispose();
                    this.decorationTypes.delete(key);
                }
                keysToRemove.push(key);
            }
        });
        
        keysToRemove.forEach(key => this.decorationKeys.delete(key));
        newKeys.forEach(key => this.decorationKeys.add(key));
    }
    
    clearDecorations() {
        if (this.currentEditor) {
            this.decorationTypes.forEach((type) => {
                this.currentEditor!.setDecorations(type, []);
            });
        }
    }
}
