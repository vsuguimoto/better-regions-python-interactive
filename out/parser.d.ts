import * as vscode from 'vscode';
import { Region } from './types';
export declare function parseRegions(document: vscode.TextDocument): Region[];
export declare function getRegionContent(document: vscode.TextDocument, region: Region): string;
export declare function flattenRegions(regions: Region[]): Region[];
//# sourceMappingURL=parser.d.ts.map