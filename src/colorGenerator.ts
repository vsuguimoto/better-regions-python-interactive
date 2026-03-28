function hashString(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
        hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
    }
    return Math.abs(hash);
}

function hslToRgba(h: number, s: number, l: number, a: number): string {
    l = Math.max(0, Math.min(1, l));
    s = Math.max(0, Math.min(1, s));
    
    const c = (1 - Math.abs(2 * l - 1)) * s;
    const x = c * (1 - Math.abs((h / 60) % 2 - 1));
    const m = l - c / 2;
    
    let r = 0, g = 0, b = 0;
    
    if (h < 60) { r = c; g = x; b = 0; }
    else if (h < 120) { r = x; g = c; b = 0; }
    else if (h < 180) { r = 0; g = c; b = x; }
    else if (h < 240) { r = 0; g = x; b = c; }
    else if (h < 300) { r = x; g = 0; b = c; }
    else { r = c; g = 0; b = x; }
    
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

export interface GeneratedColors {
    background: string;
    border: string;
}

export function generateRegionColors(
    name: string,
    depth: number,
    saturation: number,
    baseLightness: number,
    opacity: number
): GeneratedColors {
    const hash = hashString(name);
    const hue = hash % 360;
    
    const depthAdjustment = Math.min(depth * 0.05, 0.15);
    const lightness = Math.max(baseLightness - depthAdjustment, 0.5);
    const borderLightness = Math.max(lightness - 0.15, 0.3);
    
    const background = hslToRgba(hue, saturation, lightness, opacity);
    const border = hslToRgba(hue, saturation, borderLightness, 0.8);
    
    return { background, border };
}
