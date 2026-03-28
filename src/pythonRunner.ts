import * as vscode from 'vscode';
import { Region } from './types';
import { getRegionContent } from './parser';

const JUPYTER_EXTENSION_ID = 'ms-toolsai.jupyter';

export async function isJupyterExtensionAvailable(): Promise<boolean> {
    const extension = vscode.extensions.getExtension(JUPYTER_EXTENSION_ID);
    return extension !== undefined && extension.isActive;
}

export async function showJupyterWarning(): Promise<void> {
    const action = await vscode.window.showWarningMessage(
        'The Jupyter extension is required to run code in Python Interactive. Please install the Jupyter extension.',
        'Open Extensions',
        'Dismiss'
    );
    
    if (action === 'Open Extensions') {
        vscode.commands.executeCommand('workbench.view.extensions');
    }
}

export async function runRegionInInteractive(
    document: vscode.TextDocument,
    region: Region
): Promise<void> {
    const hasJupyter = await isJupyterExtensionAvailable();
    
    if (!hasJupyter) {
        await showJupyterWarning();
        return;
    }
    
    const code = getRegionContent(document, region);
    
    if (!code.trim()) {
        vscode.window.showInformationMessage('Region is empty.');
        return;
    }
    
    try {
        await vscode.commands.executeCommand('jupyter.execSelectionInteractive', code);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        vscode.window.showErrorMessage(`Failed to run region: ${message}`);
    }
}

export function getRegionCode(document: vscode.TextDocument, region: Region): string {
    return getRegionContent(document, region);
}
