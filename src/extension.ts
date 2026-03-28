import * as vscode from 'vscode';
import { RegionTreeDataProvider } from './tree_provider';
import { DecorationManager } from './decorations';
import { parseRegions } from './parser';
import { runRegionInInteractive, isJupyterExtensionAvailable } from './pythonRunner';
import { Region, RegionTreeItem, getRegionConfig } from './types';

let decorationManager: DecorationManager;
let treeProvider: RegionTreeDataProvider;
let updateTimeout: ReturnType<typeof setTimeout> | null = null;

export function activate(context: vscode.ExtensionContext) {
    decorationManager = new DecorationManager();
    treeProvider = new RegionTreeDataProvider();
    
    vscode.window.registerTreeDataProvider('regionExplorer', treeProvider);
    
    registerCommands(context);
    setupEventListeners(context);
    
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document.languageId === 'python') {
        updateRegions(editor);
    }
}

function registerCommands(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('regionExplorer.refresh', () => {
            const editor = vscode.window.activeTextEditor;
            if (editor) {
                updateRegions(editor);
            }
            treeProvider.refresh();
        })
    );
    
    context.subscriptions.push(
        vscode.commands.registerCommand('regionExplorer.runInInteractive', async (item: RegionTreeItem) => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showWarningMessage('No active editor');
                return;
            }
            
            await runRegionInInteractive(editor.document, item.region);
        })
    );
    
    context.subscriptions.push(
        vscode.commands.registerCommand('regionExplorer.revealInEditor', (item: RegionTreeItem) => {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                return;
            }
            
            const position = new vscode.Position(item.region.startLine, 0);
            const range = new vscode.Range(position, position);
            
            editor.selection = new vscode.Selection(position, position);
            editor.revealRange(range, vscode.TextEditorRevealType.AtTop);
        })
    );
}

function setupEventListeners(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.window.onDidChangeActiveTextEditor((editor) => {
            if (editor && editor.document.languageId === 'python') {
                updateRegions(editor);
            } else {
                decorationManager.clearDecorations();
            }
        })
    );
    
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument((event) => {
            const editor = vscode.window.activeTextEditor;
            if (editor && event.document === editor.document && editor.document.languageId === 'python') {
                scheduleUpdate(editor);
            }
        })
    );
    
    context.subscriptions.push(
        vscode.workspace.onDidCloseTextDocument((document) => {
            if (document.languageId === 'python') {
                decorationManager.clearDecorations();
                treeProvider.updateRegions([]);
            }
        })
    );
}

function scheduleUpdate(editor: vscode.TextEditor) {
    if (updateTimeout) {
        clearTimeout(updateTimeout);
    }
    updateTimeout = setTimeout(() => {
        updateRegions(editor);
    }, 300);
}

function updateRegions(editor: vscode.TextEditor) {
    const document = editor.document;
    const regions = parseRegions(document);
    
    treeProvider.updateRegions(regions);
    decorationManager.updateDecorations(editor, regions);
}

export function deactivate() {
    if (updateTimeout) {
        clearTimeout(updateTimeout);
    }
    decorationManager?.dispose();
}
