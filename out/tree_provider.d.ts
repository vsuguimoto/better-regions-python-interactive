import * as vscode from 'vscode';
import { Region, RegionTreeItem } from './types';
export declare class RegionTreeDataProvider implements vscode.TreeDataProvider<RegionTreeItem> {
    private _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<void | RegionTreeItem | undefined>;
    private regions;
    private _onRegionsChanged;
    constructor();
    getTreeItem(element: RegionTreeItem): vscode.TreeItem;
    getChildren(element?: RegionTreeItem): Thenable<RegionTreeItem[]>;
    private createTreeItem;
    updateRegions(regions: Region[]): void;
    getRegions(): Region[];
    refresh(): void;
    onRegionsChanged: vscode.Event<Region[]>;
}
//# sourceMappingURL=tree_provider.d.ts.map