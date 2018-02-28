import {SymbolMap} from '../SymbolMap';
import legendTemplate from '../../../Legend/Marker/legend.symbol.bar.jst';

import './style.css';

export class SymbolBars extends SymbolMap {
    constructor(options, layers) {
        super(options, layers);

        this._legendTemplate = legendTemplate;

        this.init(options);
    }

    _getIconHtml(value) {
        let html   = '',
        width      = parseInt(this._zoomLevel * (14 / 7)), // width = 14 on zoomLevel 7
        svg_height = width * value +2,
        x          = 1,
        y          = width * value - width +1;


        if (value === 0) {
            html = `<div class="nlga_map-symbol symbols-noData" width="${width}" height="${width +2}" style="top:-${width*0.75 +2}px; left:-${width*0.75 -2}px;"></div>`;
        } else {
            html += `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${width+2}" height="${svg_height}" style="top: -${svg_height - width*0.3}px; left: -${width*0.5 +1}px">`;

            for (var i = 0; i < value; i++) {
                html += `<rect class="nlga_map-symbol symbols-bar" x="${x}" y="${y}" width="${width}" height="${width}"></rect>`;   
                y -= width;
            }

            html += '</svg>';
        }

        return html;
    }

    _onLayerAdded() {
        this.layers[this._layerName].eachLayer(this._setPopupPosition.bind(this));
    }

    _onMapZoom(e) {
        this._zoomLevel = this.layers.leaflet.getZoom();

        this.layers[this._layerName].eachLayer((layer) => {
            let value = layer.feature.properties.value,
            icon      = this._getIcon(value);
           
            layer.setIcon(icon);
        });
    }

    _setPopupPosition(layer) {
        let popup  = layer.getPopup(),
        value      = layer.feature.properties.value,
        bar_width  = parseInt(this._zoomLevel * (14 / 7)),
        svg_height = bar_width * value +1,
        offset_y   = -svg_height + bar_width * 0.5;

        if (popup) {
            popup.options.offset = L.point(0, offset_y);
            popup.update();
        }
    }
}