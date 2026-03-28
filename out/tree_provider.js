"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegionTreeDataProvider = void 0;
const vscode = __importStar(require("vscode"));
class RegionTreeDataProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.regions = [];
        this._onRegionsChanged = new vscode.EventEmitter();
        this.onRegionsChanged = this._onRegionsChanged.event;
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
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
    createTreeItem(region) {
        const hasChildren = region.children && region.children.length > 0;
        const collapsibleState = hasChildren
            ? vscode.TreeItemCollapsibleState.Expanded
            : vscode.TreeItemCollapsibleState.None;
        const item = new vscode.TreeItem(region.name, collapsibleState);
        item.region = region;
        item.contextValue = 'regionItem';
        item.tooltip = `${region.name} (lines ${region.startLine + 1}-${region.endLine + 1})`;
        if (hasChildren) {
            item.children = region.children.map(r => this.createTreeItem(r));
        }
        return item;
    }
    updateRegions(regions) {
        this.regions = regions;
        this._onRegionsChanged.fire(regions);
        this._onDidChangeTreeData.fire();
    }
    getRegions() {
        return this.regions;
    }
    refresh() {
        this._onDidChangeTreeData.fire();
    }
}
exports.RegionTreeDataProvider = RegionTreeDataProvider;
//# sourceMappingURL=tree_provider.js.map