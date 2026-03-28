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
exports.DecorationManager = void 0;
const vscode = __importStar(require("vscode"));
const types_1 = require("./types");
const colorGenerator_1 = require("./colorGenerator");
class DecorationManager {
    constructor() {
        this.decorationTypes = new Map();
        this.currentEditor = null;
        this.decorationKeys = new Set();
    }
    dispose() {
        this.decorationTypes.forEach(type => type.dispose());
        this.decorationTypes.clear();
        this.decorationKeys.clear();
    }
    updateDecorations(editor, regions) {
        const config = (0, types_1.getRegionConfig)();
        if (!config.enabled) {
            this.clearDecorations();
            return;
        }
        this.currentEditor = editor;
        const newKeys = new Set();
        this.collectAndApplyDecorations(regions, config, editor, newKeys);
        this.removeOldDecorations(newKeys);
    }
    collectAndApplyDecorations(regions, config, editor, newKeys) {
        for (const region of regions) {
            const colors = (0, colorGenerator_1.generateRegionColors)(region.name, region.depth, config.saturation, config.lightness, config.opacity);
            const key = `${region.startLine}-${region.endLine}`;
            newKeys.add(key);
            if (!this.decorationTypes.has(key)) {
                const decorationType = vscode.window.createTextEditorDecorationType({
                    isWholeLine: false,
                    light: {
                        backgroundColor: colors.background,
                        borderStyle: 'solid',
                        borderWidth: '1px',
                        borderColor: colors.border,
                    },
                    dark: {
                        backgroundColor: colors.background,
                        borderStyle: 'solid',
                        borderWidth: '1px',
                        borderColor: colors.border,
                    },
                });
                this.decorationTypes.set(key, decorationType);
            }
            const startPos = new vscode.Position(region.startLine, 0);
            const endPos = new vscode.Position(region.endLine, 0);
            const range = new vscode.Range(startPos, endPos);
            const decorationType = this.decorationTypes.get(key);
            editor.setDecorations(decorationType, [{ range, hoverMessage: `Region: ${region.name}` }]);
            if (region.children.length > 0) {
                this.collectAndApplyDecorations(region.children, config, editor, newKeys);
            }
        }
    }
    removeOldDecorations(newKeys) {
        const keysToRemove = [];
        this.decorationKeys.forEach(key => {
            if (!newKeys.has(key)) {
                const type = this.decorationTypes.get(key);
                if (type) {
                    type.dispose();
                    this.decorationTypes.delete(key);
                }
                keysToRemove.push(key);
            }
        });
        keysToRemove.forEach(key => this.decorationKeys.delete(key));
        newKeys.forEach(key => this.decorationKeys.add(key));
    }
    clearDecorations() {
        if (this.currentEditor) {
            this.decorationTypes.forEach((type) => {
                this.currentEditor.setDecorations(type, []);
            });
        }
    }
}
exports.DecorationManager = DecorationManager;
//# sourceMappingURL=decorations.js.map