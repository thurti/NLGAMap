import {Color} from './Color';

/**
 * Create striped background patterns for svg.
 */
export class SVGRectPattern {
    
    constructor(svg_id = '') {
        this.svg_id           = svg_id;
        this.pattern          = this.create();
        this.colored_variants = [];
    }

    create() {
        const pattern = document.createElementNS('http://www.w3.org/2000/svg', 'pattern'),
        rect          = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        
        pattern.setAttribute('patternUnits', 'userSpaceOnUse');
        pattern.appendChild(rect);

        return pattern;
    }

    setProperties(props) {
        const pattern = this.pattern,
              rect    = this.pattern.querySelector('rect');

        pattern.setAttribute('id', `${this.svg_id}_${props.id}`);
        pattern.setAttribute('width', props.width);
        pattern.setAttribute('height', props.height);
        pattern.setAttribute('patternTransform', `rotate(${props.rotate})`);

        rect.setAttribute('width', props.strokeWidth);
        rect.setAttribute('height', props.height);
        rect.setAttribute('stroke-width', props.strokeWidth);

        this.setPatternColor(pattern, props.color);
    }

    setPatternColor(pattern, color) {
        const rect = pattern.querySelector('rect');

        rect.setAttribute('fill', color);
        rect.setAttribute('stroke', color);
    }

    /**
     * 
     * @param {string|array} colors 
     */
    addColoredVariants(colors) {
        const colors_array = [].concat(colors); //support single color string or array of colors

        colors_array.forEach(color => {
            this._addColoredVariant(color);
        });
    }

    _addColoredVariant(color) {
        const color_string = Color.getColorString(color),
              color_id     = `${this.pattern.id}_${color_string}`;
        
        if (document.querySelectorAll(`svg defs #${color_id}`).length == 0) { //check if pattern is already defined
            const colored_pattern = this.pattern.cloneNode(true);
            colored_pattern.id    = color_id;
            
            this.setPatternColor(colored_pattern, color);
            this.colored_variants.push(colored_pattern);
        }
    }

    addTo(svg) {
        const g    = svg.querySelector('g'),
              defs = this._getDefs(svg);

        if (document.querySelectorAll(`svg defs #${this.pattern.id}`).length == 0) { //check if pattern is already defined
            defs.appendChild(this.pattern);
        }
        
        this.colored_variants.forEach(colored_pattern => defs.appendChild(colored_pattern));

        svg.insertBefore(defs, g);
    }

    _getDefs(svg) {
        let defs = svg.querySelector('defs');

        if (!defs) {
            defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs')
        }

        return defs;
    }
}