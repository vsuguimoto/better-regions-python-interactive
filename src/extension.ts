import * as vscode from 'vscode';
import { RegionTreeDataProvider } from './tree_provider';
import { DecorationManager } from './decorations';
import { parseRegions } from './parser';
import { runRegionInInteractive } from './pythonRunner';
import { RegionTreeItem } from './types';

let decorationManager: DecorationManager;
let treeProvider: RegionTreeDataProvider;
let updateTimeout: ReturnType<typeof setTimeout> | null = null;
let lastPythonEditor: vscode.TextEditor | null = null;

function shouldProcessEditor(editor: vscode.TextEditor | undefined): boolean {
    if (!editor) { return false; }
    
    const uri = editor.document.uri;
    const scheme = uri.scheme;
    const uriStr = uri.toString();
    const langId = editor.document.languageId;
    
    console.log('[DEBUG] shouldProcessEditor - scheme:', scheme, 'langId:', langId, 'uri:', uriStr);
    
    if (scheme !== 'file') {
        console.log('[DEBUG] Ignoring non-file scheme');
        return false;
    }
    
    if (langId !== 'python') {
        console.log('[DEBUG] Ignoring non-python language');
        return false;
    }
    
    if (uriStr.includes('vscode-interactive') || uriStr.includes('jupyter')) {
        console.log('[DEBUG] Ignoring interactive window');
        return false;
    }
    
    return true;
}

export function activate(context: vscode.ExtensionContext) {
    decorationManager = new DecorationManager();
    treeProvider = new RegionTreeDataProvider();
    
    vscode.window.registerTreeDataProvider('regionExplorer', treeProvider);
    
    registerCommands(context);
    setupEventListeners(context);
    
    const editor = vscode.window.activeTextEditor;
    if (shouldProcessEditor(editor)) {
        lastPythonEditor = editor!;
        updateRegions(editor!);
    }
}

function registerCommands(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        vscode.commands.registerCommand('regionExplorer.refresh', () => {
            const editor = vscode.window.activeTextEditor;
            if (shouldProcessEditor(editor)) {
                lastPythonEditor = editor!;
                updateRegions(editor!);
            } else if (lastPythonEditor) {
                treeProvider.refresh();
            }
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
            console.log('[DEBUG] onDidChangeActiveTextEditor');
            
            if (shouldProcessEditor(editor)) {
                lastPythonEditor = editor!;
                updateRegions(editor!);
            } else {
                decorationManager.clearDecorations();
            }
        })
    );
    
    context.subscriptions.push(
        vscode.workspace.onDidChangeTextDocument((event) => {
            console.log('[DEBUG] onDidChangeTextDocument:', event.document.languageId);
            
            const editor = vscode.window.activeTextEditor;
            if (shouldProcessEditor(editor)) {
                scheduleUpdate(editor!);
            }
        })
    );
    
    context.subscriptions.push(
        vscode.workspace.onDidCloseTextDocument((document) => {
            if (document.languageId === 'python' && document.uri.scheme === 'file') {
                decorationManager.clearDecorations();
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
