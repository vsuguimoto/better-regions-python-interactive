import * as vscode from 'vscode';
import { Region } from '../src/types';

export function createMockDocument(lines: string[]): vscode.TextDocument {
    return {
        uri: vscode.Uri.file('/test.py'),
        fileName: '/test.py',
        languageId: 'python',
        lineCount: lines.length,
        lineAt: (index: number) => ({
            lineNumber: index,
            text: lines[index],
            range: new vscode.Range(index, 0, index, lines[index].length),
            rangeIncludingLineBreak: new vscode.Range(index, 0, index, lines[index].length + 1),
            firstNonWhitespaceCharacterIndex: lines[index].search(/\S/),
            isEmptyOrWhitespace: lines[index].trim().length === 0,
        }),
        getText: () => lines.join('\n'),
        getWordAtPosition: () => null,
        offsetAt: () => 0,
        positionAt: () => new vscode.Position(0, 0),
        validateRange: (r) => r,
        validatePosition: (p) => p,
    } as unknown as vscode.TextDocument;
}
