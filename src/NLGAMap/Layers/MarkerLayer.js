import defaultsDeep from 'lodash/defaultsDeep';
import omit from 'lodash/omit';

import {markerDefaults} from './defaults.js';
import '../topojson/L.TopoJSON';

export class MarkerLayer {

    constructor(options) {
        this.options = defaultsDeep(options, markerDefaults);
    }

    load(json = this.options.json, pointToLayerCallback = this._getPointStyle) {
        if (typeof json === 'object') return this.create(json, pointToLayerCallback);
        
        let promise = fetch(json)
                        .then(function (response) {
                            return response.json();
                        }).then((json) => {
                            return this.create(json, pointToLayerCallback);
                        });

        return promise;
    }

    create(geojson = this.options.json, pointToLayerCallback = this._getPointStyle) {
        if (typeof geojson !== 'object') throw 'options.geojson must be a geojson object';

        let promise = new Promise((resolve) => {
            let layer = new L.TopoJSON(geojson, {
                                pointToLayer: pointToLayerCallback.bind(this)
                            });

            layer.eachLayer(this._handleLayer.bind(this));

            layer.options.layerName    = this.options.layerName;
            layer.options.layerControl = this.options.layerControl;

            resolve(layer);
        });

        return promise;
    }

    _getPointStyle(feature, latlng) {
        let iconOptions = {
            className: `nlga_map-point-marker ${this.options.styles.className}`,
            iconSize: L.point(this.options.styles.size[0], this.options.styles.size[1]),
            html: (this.options.addNameSpan) ? `<span class="${this.options.styles.htmlSpanClass}">${feature.properties[this.options.propertyName]}</span>` : ''
        };

        return L.marker(latlng, {
            icon: L.divIcon(iconOptions),
            pane: this.options.layerName
        });
    }

    _handleLayer(layer) {
        layer.bindPopup('', this.options.popup);

        if (this.options.popup !== false) {
            layer.on({
                mouseover: this._onEnterLayer,
                mouseout: layer.closePopup.bind(layer)
            }, this);
        }
    }

    _onEnterLayer(e) {
        let layer = e.target,
        tpl       = this.options.popupTemplate,
        tplVars   = defaultsDeep({
            name: e.target.feature.properties[this.options.propertyName],
            unit: this.options.unit
        }, e.target.feature.properties, omit(this.options.popup, 'template')),
        content = (typeof tpl === 'function') ? tpl(tplVars) : `<center>${tplVars.name}<br>${tplVars.value}</center>`;
        
        let popup = layer.getPopup();

        if (!popup) {
            layer.unbindPopup().bindPopup(content, this.options.popup);
        } else {
            layer.getPopup().setContent(content);
        }
        
        layer.openPopup();
    }
}