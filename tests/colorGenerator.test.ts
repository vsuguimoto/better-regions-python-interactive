import * as assert from 'assert';
import { generateRegionColors } from '../src/colorGenerator';

suite('ColorGenerator Tests', () => {
    test('Generate consistent colors for same name', () => {
        const colors1 = generateRegionColors('Test Region', 0, 0.6, 0.85, 0.15);
        const colors2 = generateRegionColors('Test Region', 0, 0.6, 0.85, 0.15);
        
        assert.strictEqual(colors1.background, colors2.background);
        assert.strictEqual(colors1.border, colors2.border);
    });
    
    test('Generate different colors for different names', () => {
        const colors1 = generateRegionColors('Region A', 0, 0.6, 0.85, 0.15);
        const colors2 = generateRegionColors('Region B', 0, 0.6, 0.85, 0.15);
        
        assert.notStrictEqual(colors1.background, colors2.background);
    });
    
    test('Depth adjusts lightness', () => {
        const colors0 = generateRegionColors('Test', 0, 0.6, 0.85, 0.15);
        const colors1 = generateRegionColors('Test', 1, 0.6, 0.85, 0.15);
        
        assert.notStrictEqual(colors0.background, colors1.background);
    });
    
    test('Colors have rgba format', () => {
        const colors = generateRegionColors('Test', 0, 0.6, 0.85, 0.15);
        
        assert.match(colors.background, /^rgba\(\d+, \d+, \d+, [\d.]+\)$/);
        assert.match(colors.border, /^rgba\(\d+, \d+, \d+, [\d.]+\)$/);
    });
    
    test('Opacity parameter is used', () => {
        const colorsLow = generateRegionColors('Test', 0, 0.6, 0.85, 0.05);
        const colorsHigh = generateRegionColors('Test', 0, 0.6, 0.85, 0.5);
        
        assert.notStrictEqual(colorsLow.background, colorsHigh.background);
        assert.ok(colorsLow.background.includes(', 0.05)'));
        assert.ok(colorsHigh.background.includes(', 0.5)'));
    });
    
    test('Saturation parameter affects colors', () => {
        const colorsLow = generateRegionColors('Test', 0, 0.2, 0.85, 0.15);
        const colorsHigh = generateRegionColors('Test', 0, 0.9, 0.85, 0.15);
        
        assert.notStrictEqual(colorsLow.background, colorsHigh.background);
    });
    
    test('Border is darker than background', () => {
        const colors = generateRegionColors('Test Region', 0, 0.6, 0.85, 0.15);
        
        const bgMatch = colors.background.match(/rgba\((\d+), (\d+), (\d+)/);
        const borderMatch = colors.border.match(/rgba\((\d+), (\d+), (\d+)/);
        
        if (bgMatch && borderMatch) {
            const bgLightness = (parseInt(bgMatch[1]) + parseInt(bgMatch[2]) + parseInt(bgMatch[3])) / 3;
            const borderLightness = (parseInt(borderMatch[1]) + parseInt(borderMatch[2]) + parseInt(borderMatch[3])) / 3;
            
            assert.ok(borderLightness < bgLightness, 'Border should be darker than background');
        }
    });
});
