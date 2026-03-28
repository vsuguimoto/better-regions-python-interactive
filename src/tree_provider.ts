import * as vscode from 'vscode';
import { Region, RegionTreeItem } from './types';

export class RegionTreeDataProvider implements vscode.TreeDataProvider<RegionTreeItem> {
    private _onDidChangeTreeData = new vscode.EventEmitter<RegionTreeItem | undefined | void>();
    readonly onDidChangeTreeData = this._onDidChangeTreeData.event;
    
    private regions: Region[] = [];
    private _onRegionsChanged = new vscode.EventEmitter<Region[]>();
    
    constructor() {}
    
    getTreeItem(element: RegionTreeItem): vscode.TreeItem {
        return element;
    }
    
    getChildren(element?: RegionTreeItem): Thenable<RegionTreeItem[]> {
        if (!element) {
            if (this.regions.length === 0) {
                return Promise.resolve([]);
            }
            return Promise.resolve(this.regions.map(r => this.createTreeItem(r)));
        }
        
        if (!element.region.children || element.region.children.length === 0) {
            return Promise.resolve([]);
        }
        
        return Promise.resolve(element.region.children.map(r => this.createTreeItem(r)));
    }
    
    private createTreeItem(region: Region): RegionTreeItem {
        const hasChildren = region.children && region.children.length > 0;
        const collapsibleState = hasChildren
            ? vscode.TreeItemCollapsibleState.Expanded
            : vscode.TreeItemCollapsibleState.None;
        
        const item = new vscode.TreeItem(
            region.name,
            collapsibleState
        ) as RegionTreeItem;
        
        item.region = region;
        item.contextValue = 'regionItem';
        item.tooltip = `${region.name} (lines ${region.startLine + 1}-${region.endLine + 1})`;
        
        if (hasChildren) {
            item.children = region.children.map(r => this.createTreeItem(r));
        }
        
        return item;
    }
    
    updateRegions(regions: Region[]) {
        this.regions = regions;
        this._onRegionsChanged.fire(regions);
        this._onDidChangeTreeData.fire();
    }
    
    getRegions(): Region[] {
        return this.regions;
    }
    
    refresh(): void {
        this._onDidChangeTreeData.fire();
    }
    
    onRegionsChanged: vscode.Event<Region[]> = this._onRegionsChanged.event;
}
