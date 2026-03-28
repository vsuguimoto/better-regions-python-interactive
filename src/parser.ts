import * as vscode from 'vscode';
import { Region } from './types';

const REGION_START_PATTERN = /^\s*#\s*region\s*(.*)$/i;
const REGION_END_PATTERN = /^\s*#\s*endregion\s*$/i;

export function parseRegions(document: vscode.TextDocument): Region[] {
    const regions: Region[] = [];
    const stack: Region[] = [];
    
    for (let i = 0; i < document.lineCount; i++) {
        const line = document.lineAt(i);
        const text = line.text;
        
        const startMatch = text.match(REGION_START_PATTERN);
        const endMatch = text.match(REGION_END_PATTERN);
        
        if (startMatch) {
            const regionName = startMatch[1]?.trim() || 'Unnamed Region';
            const region: Region = {
                name: regionName,
                startLine: i,
                endLine: -1,
                depth: stack.length,
                children: [],
            };
            
            if (stack.length > 0) {
                const parent = stack[stack.length - 1];
                parent.children.push(region);
            } else {
                regions.push(region);
            }
            
            stack.push(region);
        } else if (endMatch && stack.length > 0) {
            const region = stack.pop()!;
            region.endLine = i;
        }
    }
    
    return regions;
}

export function getRegionContent(document: vscode.TextDocument, region: Region): string {
    if (region.startLine + 1 > region.endLine - 1) {
        return '';
    }
    
    const lines: string[] = [];
    for (let i = region.startLine + 1; i < region.endLine; i++) {
        lines.push(document.lineAt(i).text);
    }
    return lines.join('\n');
}

export function flattenRegions(regions: Region[]): Region[] {
    const result: Region[] = [];
    
    function traverse(regionList: Region[]) {
        for (const region of regionList) {
            result.push(region);
            traverse(region.children);
        }
    }
    
    traverse(regions);
    return result;
}
