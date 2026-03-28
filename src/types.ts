import * as vscode from 'vscode';

export interface Region {
    name: string;
    startLine: number;
    endLine: number;
    depth: number;
    children: Region[];
}

export interface RegionTreeItem extends vscode.TreeItem {
    region: Region;
    children?: RegionTreeItem[];
    contextValue: string;
}

export interface RegionConfig {
    enabled: boolean;
    highlightOnlyLastRegion: boolean;
    opacity: number;
    saturation: number;
    lightness: number;
}

export function getRegionConfig(): RegionConfig {
    const config = vscode.workspace.getConfiguration('regionBackground');
    return {
        enabled: config.get<boolean>('enabled', true),
        highlightOnlyLastRegion: config.get<boolean>('highlightOnlyLastRegion', true),
        opacity: config.get<number>('opacity', 0.15),
        saturation: config.get<number>('saturation', 0.6),
        lightness: config.get<number>('lightness', 0.85),
    };
}
