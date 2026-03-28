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
    opacity: number;
    saturation: number;
    lightness: number;
}
export declare function getRegionConfig(): RegionConfig;
//# sourceMappingURL=types.d.ts.map