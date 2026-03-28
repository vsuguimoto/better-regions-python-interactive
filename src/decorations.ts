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
        
        if (config.highlightOnlyLastRegion) {
            const cursorLine = editor.selection.active.line;
            const lastRegion = this.findRegionContainingLine(regions, cursorLine);
            if (lastRegion) {
                this.applyDecoration(lastRegion, config, editor, newKeys);
            }
        } else {
            this.collectAndApplyDecorations(regions, config, editor, newKeys);
        }
        
        this.removeOldDecorations(newKeys);
    }
    
    private findRegionContainingLine(regions: Region[], line: number): Region | null {
        for (const region of regions) {
            if (line >= region.startLine && line <= region.endLine) {
                const childMatch = this.findRegionContainingLine(region.children, line);
                return childMatch || region;
            }
        }
        return null;
    }
    
    private collectAndApplyDecorations(
        regions: Region[],
        config: ReturnType<typeof getRegionConfig>,
        editor: vscode.TextEditor,
        newKeys: Set<string>
    ) {
        for (const region of regions) {
            this.applyDecoration(region, config, editor, newKeys);
            
            if (region.children.length > 0) {
                this.collectAndApplyDecorations(region.children, config, editor, newKeys);
            }
        }
    }
    
    private applyDecoration(
        region: Region,
        config: ReturnType<typeof getRegionConfig>,
        editor: vscode.TextEditor,
        newKeys: Set<string>
    ) {
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
                isWholeLine: true,
                light: {
                    backgroundColor: colors.background,
                },
                dark: {
                    backgroundColor: colors.background,
                },
            });
            this.decorationTypes.set(key, decorationType);
        }
        
        const startPos = new vscode.Position(region.startLine, 0);
        const endLine = editor.document.lineAt(region.endLine);
        const endPos = endLine.range.end;
        const range = new vscode.Range(startPos, endPos);
        
        const decorationType = this.decorationTypes.get(key)!;
        editor.setDecorations(decorationType, [{ range, hoverMessage: `Region: ${region.name}` }]);
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
