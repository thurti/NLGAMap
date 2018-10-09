import 'leaflet-piemarker/src/Leaflet.Icon.PieIcon';
import 'leaflet-piemarker/src/Leaflet.Marker.PieMarker';
import {MarkerMap} from './MarkerMap';
import popupTemplate from './popup.pie.jst';

export class PieMap extends MarkerMap {

    constructor(options, layers) {
        options.valuePropPath = 'value.total';
    
        super(options, layers);
        this._popupTemplate = popupTemplate;
    }

    /**
     * @override MarkerBase
     * @param {Object} feature 
     * @param {Array} latlng 
     */
    _pointToLayerCallback(feature, latlng) {
        return L.Marker.pieMarker(latlng, {
            icon: this._getIcon(feature.properties.value),
            pane: this._layerName
        });
    }

    _getIcon(value) {
        if (typeof this._customIcon === 'function') {
            return this._customIcon.call(this, value);
        } else {
            let size = this._getPointSize(value.total);

            return L.Icon.pieIcon({
                iconSize: size,
                precision: this.options.precision,
                data: value.slices
            });
        }
    }

}