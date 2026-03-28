import * as assert from 'assert';
import { parseRegions, getRegionContent, flattenRegions } from '../src/parser';
import { createMockDocument } from './helpers';

suite('Parser Tests', () => {
    test('Parse single region', () => {
        const lines = [
            '# region My Region',
            'print("hello")',
            '#endregion'
        ];
        const doc = createMockDocument(lines);
        const regions = parseRegions(doc);
        
        assert.strictEqual(regions.length, 1);
        assert.strictEqual(regions[0].name, 'My Region');
        assert.strictEqual(regions[0].startLine, 0);
        assert.strictEqual(regions[0].endLine, 2);
        assert.strictEqual(regions[0].depth, 0);
    });
    
    test('Parse region without space after #', () => {
        const lines = [
            '#region No Space',
            'x = 1',
            '#endregion'
        ];
        const doc = createMockDocument(lines);
        const regions = parseRegions(doc);
        
        assert.strictEqual(regions.length, 1);
        assert.strictEqual(regions[0].name, 'No Space');
    });
    
    test('Parse case insensitive regions', () => {
        const lines = [
            '# Region Mixed Case',
            'y = 2',
            '#ENDREGION'
        ];
        const doc = createMockDocument(lines);
        const regions = parseRegions(doc);
        
        assert.strictEqual(regions.length, 1);
        assert.strictEqual(regions[0].name, 'Mixed Case');
    });
    
    test('Parse nested regions', () => {
        const lines = [
            '# region Outer',
            'a = 1',
            '# region Inner',
            'b = 2',
            '#endregion',
            'c = 3',
            '#endregion'
        ];
        const doc = createMockDocument(lines);
        const regions = parseRegions(doc);
        
        assert.strictEqual(regions.length, 1);
        assert.strictEqual(regions[0].name, 'Outer');
        assert.strictEqual(regions[0].children.length, 1);
        assert.strictEqual(regions[0].children[0].name, 'Inner');
        assert.strictEqual(regions[0].depth, 0);
        assert.strictEqual(regions[0].children[0].depth, 1);
    });
    
    test('Parse multiple top-level regions', () => {
        const lines = [
            '# region First',
            'x = 1',
            '#endregion',
            '# region Second',
            'y = 2',
            '#endregion'
        ];
        const doc = createMockDocument(lines);
        const regions = parseRegions(doc);
        
        assert.strictEqual(regions.length, 2);
        assert.strictEqual(regions[0].name, 'First');
        assert.strictEqual(regions[1].name, 'Second');
    });
    
    test('Parse region with empty name', () => {
        const lines = [
            '#region ',
            'x = 1',
            '#endregion'
        ];
        const doc = createMockDocument(lines);
        const regions = parseRegions(doc);
        
        assert.strictEqual(regions.length, 1);
        assert.strictEqual(regions[0].name, 'Unnamed Region');
    });
    
    test('Get region content', () => {
        const lines = [
            '# region Test',
            'print("line1")',
            'print("line2")',
            '#endregion'
        ];
        const doc = createMockDocument(lines);
        const regions = parseRegions(doc);
        const content = getRegionContent(doc, regions[0]);
        
        assert.strictEqual(content, 'print("line1")\nprint("line2")');
    });
    
    test('Flatten regions', () => {
        const lines = [
            '# region Parent',
            'x = 1',
            '# region Child',
            'y = 2',
            '#endregion',
            '#endregion'
        ];
        const doc = createMockDocument(lines);
        const regions = parseRegions(doc);
        const flat = flattenRegions(regions);
        
        assert.strictEqual(flat.length, 2);
        assert.strictEqual(flat[0].name, 'Parent');
        assert.strictEqual(flat[1].name, 'Child');
    });
    
    test('Ignore unmatched region start', () => {
        const lines = [
            '# region Orphan',
            'x = 1'
        ];
        const doc = createMockDocument(lines);
        const regions = parseRegions(doc);
        
        assert.strictEqual(regions.length, 1);
        assert.strictEqual(regions[0].endLine, -1);
    });
    
    test('Ignore unmatched endregion', () => {
        const lines = [
            'x = 1',
            '#endregion'
        ];
        const doc = createMockDocument(lines);
        const regions = parseRegions(doc);
        
        assert.strictEqual(regions.length, 0);
    });
    
    test('Region with leading whitespace', () => {
        const lines = [
            '    # region Indented',
            '    x = 1',
            '    #endregion'
        ];
        const doc = createMockDocument(lines);
        const regions = parseRegions(doc);
        
        assert.strictEqual(regions.length, 1);
        assert.strictEqual(regions[0].name, 'Indented');
    });
});
