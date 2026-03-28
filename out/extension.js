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
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const tree_provider_1 = require("./tree_provider");
const decorations_1 = require("./decorations");
const parser_1 = require("./parser");
const pythonRunner_1 = require("./pythonRunner");
let decorationManager;
let treeProvider;
let updateTimeout = null;
function activate(context) {
    decorationManager = new decorations_1.DecorationManager();
    treeProvider = new tree_provider_1.RegionTreeDataProvider();
    vscode.window.registerTreeDataProvider('regionExplorer', treeProvider);
    registerCommands(context);
    setupEventListeners(context);
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document.languageId === 'python') {
        updateRegions(editor);
    }
}
function registerCommands(context) {
    context.subscriptions.push(vscode.commands.registerCommand('regionExplorer.refresh', () => {
        const editor = vscode.window.activeTextEditor;
        if (editor) {
            updateRegions(editor);
        }
        treeProvider.refresh();
    }));
    context.subscriptions.push(vscode.commands.registerCommand('regionExplorer.runInInteractive', async (item) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            vscode.window.showWarningMessage('No active editor');
            return;
        }
        await (0, pythonRunner_1.runRegionInInteractive)(editor.document, item.region);
    }));
    context.subscriptions.push(vscode.commands.registerCommand('regionExplorer.revealInEditor', (item) => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
            return;
        }
        const position = new vscode.Position(item.region.startLine, 0);
        const range = new vscode.Range(position, position);
        editor.selection = new vscode.Selection(position, position);
        editor.revealRange(range, vscode.TextEditorRevealType.AtTop);
    }));
}
function setupEventListeners(context) {
    context.subscriptions.push(vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (editor && editor.document.languageId === 'python') {
            updateRegions(editor);
        }
        else {
            decorationManager.clearDecorations();
        }
    }));
    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((event) => {
        const editor = vscode.window.activeTextEditor;
        if (editor && event.document === editor.document && editor.document.languageId === 'python') {
            scheduleUpdate(editor);
        }
    }));
    context.subscriptions.push(vscode.workspace.onDidCloseTextDocument((document) => {
        if (document.languageId === 'python') {
            decorationManager.clearDecorations();
            treeProvider.updateRegions([]);
        }
    }));
}
function scheduleUpdate(editor) {
    if (updateTimeout) {
        clearTimeout(updateTimeout);
    }
    updateTimeout = setTimeout(() => {
        updateRegions(editor);
    }, 300);
}
function updateRegions(editor) {
    const document = editor.document;
    const regions = (0, parser_1.parseRegions)(document);
    treeProvider.updateRegions(regions);
    decorationManager.updateDecorations(editor, regions);
}
function deactivate() {
    if (updateTimeout) {
        clearTimeout(updateTimeout);
    }
    decorationManager?.dispose();
}
//# sourceMappingURL=extension.js.map