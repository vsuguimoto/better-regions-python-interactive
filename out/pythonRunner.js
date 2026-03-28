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
exports.isJupyterExtensionAvailable = isJupyterExtensionAvailable;
exports.showJupyterWarning = showJupyterWarning;
exports.runRegionInInteractive = runRegionInInteractive;
exports.getRegionCode = getRegionCode;
const vscode = __importStar(require("vscode"));
const parser_1 = require("./parser");
const JUPYTER_EXTENSION_ID = 'ms-toolsai.jupyter';
async function isJupyterExtensionAvailable() {
    const extension = vscode.extensions.getExtension(JUPYTER_EXTENSION_ID);
    return extension !== undefined && extension.isActive;
}
async function showJupyterWarning() {
    const action = await vscode.window.showWarningMessage('The Jupyter extension is required to run code in Python Interactive. Please install the Jupyter extension.', 'Open Extensions', 'Dismiss');
    if (action === 'Open Extensions') {
        vscode.commands.executeCommand('workbench.view.extensions');
    }
}
async function runRegionInInteractive(document, region) {
    const hasJupyter = await isJupyterExtensionAvailable();
    if (!hasJupyter) {
        await showJupyterWarning();
        return;
    }
    const code = (0, parser_1.getRegionContent)(document, region);
    if (!code.trim()) {
        vscode.window.showInformationMessage('Region is empty.');
        return;
    }
    try {
        await vscode.commands.executeCommand('jupyter.execSelectionInteractive', code);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        vscode.window.showErrorMessage(`Failed to run region: ${message}`);
    }
}
function getRegionCode(document, region) {
    return (0, parser_1.getRegionContent)(document, region);
}
//# sourceMappingURL=pythonRunner.js.map