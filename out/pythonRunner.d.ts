import * as vscode from 'vscode';
import { Region } from './types';
export declare function isJupyterExtensionAvailable(): Promise<boolean>;
export declare function showJupyterWarning(): Promise<void>;
export declare function runRegionInInteractive(document: vscode.TextDocument, region: Region): Promise<void>;
export declare function getRegionCode(document: vscode.TextDocument, region: Region): string;
//# sourceMappingURL=pythonRunner.d.ts.map