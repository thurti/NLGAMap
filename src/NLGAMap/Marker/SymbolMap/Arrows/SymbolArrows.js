import {SymbolMap} from '../SymbolMap';
// import {symbolPositions} from './SymbolPositions';
import legendTemplate from '../../../Legend/Marker/legend.symbol.arrow.jst';

import './style.css';

export class SymbolArrows extends SymbolMap {
    constructor(options, layers) {
        super(options, layers);

        this._legendTemplate = legendTemplate;
        this.init(options);
    }

    _getIconHtml(value) {
        if (value === 0) {
            return `<div class="nlga_map-symbol symbols-noData"></div>`;
        }
        
        return `<div class="nlga_map-symbol symbols-${this.options.type} ${this.options.type}--${value}"></div>`;
    }
}