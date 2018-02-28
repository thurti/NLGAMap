/**
 * Color related helper functions.
 */
export class Color {
    
    /**
     * Check if string starts with 'rgb'.
     * @param {string} string 
     */
    static isRGB(string) {
        return (string.indexOf('rgb') === 0) ? true : false;
    }

    /**
     * Check if string is a color in hex format.
     * @param {string} string 
     */
    static isHex(string) {
        return /^#[0-9A-F]{6}$/i.test(string);
    }

    /**
     * Converts rgb string to hex string (eg. rgb(0,0,0) to #000000)
     * @param {string} color 
     */
    static rgbToHex(color) {
        if (Color.isHex(color)) return color;

        const matches = color.match(/rgb\((\d+)\,(\d+)\,(\d+)\)/),
        
        r = parseInt(matches[1], 10),
        g = parseInt(matches[2], 10),
        b = parseInt(matches[3], 10);
        
        return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
    }

    /**
     * Removes special chars from color string for use as css selector. 
     * @param {string} color 
     */
    static getColorString(color) {
        return color.replace(/[\s,()#]*/g, '');
    }

    /**
     * Returns color string or url pattern string from color object.
     * `{color: '#ff0000', pattern: 'striped'}` => url('#[prefix]_striped_ff0000')
     * @param {object} color_obj 
     * @param {string} prefix
     */
    static getColorFromObj(color_obj, prefix) {
        if (typeof color_obj === 'string') { //is color string
            return color_obj;
        } else { //is color pattern
            return Color.getColorPatternUrl(color_obj.color, color_obj.pattern, prefix);
        }
    }

    /**
     * Returns color value or pattern url string.
     * @param {string} color 
     * @param {string} [prefix  = 'pattern']
     */
    static getColorPatternUrl(color, pattern, prefix = 'pattern') {
        if (!pattern) return color;

        let color_string = Color.getColorString(color),
            pattern_url  = `url('#${prefix}_${pattern}_${color_string}')`;

        return pattern_url;
    }
}