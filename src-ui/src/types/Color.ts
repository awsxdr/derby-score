export class Color {
    readonly hue: number;
    readonly saturation: number;
    readonly value: number;

    constructor(hue: number = 0, saturation: number = 100, value: number = 100) {
        this.hue = Color.limit(hue, 0, 360);
        this.saturation = Color.limit(saturation, 0, 100);
        this.value = Color.limit(value, 0, 100);
    }

    toHex(): string {
        const color = (this.value / 100) * (this.saturation / 100);
        const inverseColor = color * (1 - Math.abs((this.hue / 60) % 2 - 1));
        const modifier = this.value / 100 - color;

        const [r, g, b] = (
            (this.hue >= 0 && this.hue < 60) ? [ color, inverseColor, 0 ]
            : (this.hue >= 60 && this.hue < 120) ? [ inverseColor, color, 0 ]
            : (this.hue >= 120 && this.hue < 180) ? [ 0, color, inverseColor ]
            : (this.hue >= 180 && this.hue < 240) ? [ 0, inverseColor, color ]
            : (this.hue >= 240 && this.hue < 300) ? [ inverseColor, 0, color ]
            : [ color, 0, inverseColor ])
            .map(v => (v + modifier) * 255)
            .map(Math.floor);

        const hexValue = (value: number) => value.toString(16).padStart(2, '0');
        return `#${hexValue(r)}${hexValue(g)}${hexValue(b)}`;
    }

    static fromHex(hex: string) {

        const matches = hex.match(/(?<=#?)([0-9a-f]{6}|[0-9a-f]{3})/);

        if(!matches || matches.length === 0) {
            return new Color();
        }

        let match = matches[0];

        if(match.length === 3) {
            match = `${match[0]}${match[0]}${match[1]}${match[1]}${match[2]}${match[2]}`;
        }

        const r = parseInt(match.substring(0, 2), 16);
        const g = parseInt(match.substring(2, 4), 16);
        const b = parseInt(match.substring(4, 6), 16);

        return Color.fromRgb(r, g, b);
    }

    static fromRgb(r: number, g: number, b: number) {
        const normalR = this.limit(r, 0, 255) / 255;
        const normalG = this.limit(g, 0, 255) / 255;
        const normalB = this.limit(b, 0, 255) / 255;

        const max = Math.max(normalR, normalG, normalB);
        const min = Math.min(normalR, normalG, normalB);
        const delta = max - min;

        const hue = 
            delta === 0 ? 0
            : max === normalR ? 60 * (((normalG - normalB) / delta) % 6)
            : max === normalG ? 60 * ((normalB - normalR) / delta + 2)
            : 60 * ((normalR - normalG) / delta + 4);

        const correctedHue = hue < 0 ? hue + 360 : hue;

        const saturation =
            max === 0
            ? 0
            : delta / max;

        const value = max;

        return new Color(correctedHue, saturation * 100, value * 100);
    }

    private static limit(value: number, min: number, max: number) {
        return Math.min(max, Math.max(min, value));
    }
}