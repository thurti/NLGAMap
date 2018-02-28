import omit from 'lodash/omit'; 
import includes from 'lodash/includes'; 
import find from 'lodash/find'; 
import defaultsDeep from 'lodash/defaultsDeep';

import {Color} from '../../Utils/Color';

import {regionDefaults} from './defaults.js';
import '../topojson/L.TopoJSON';

export class RegionLayer {

    constructor(options) {
        this.options = defaultsDeep(options, regionDefaults);
    }

    load(json = this.options.json, handleLayer = this._handleLayer) {
        if (typeof json === 'object') return this.create(json, handleLayer);

        let promise = fetch(json)
                        .then(function (response) {
                            return response.json();  
                        }).then((json) => {
                            return this.create(json, handleLayer);
                        });

        return promise;
    }

    create(geojson = this.options.geojson, handleLayer = this._handleLayer) {
        if (typeof geojson !== 'object') throw 'options.geojson must be a geojson object';

        let promise = new Promise((resolve) => {
            let layer   = new L.TopoJSON();
            
            layer.addData(geojson);

            layer.setStyle(this._getLayerStyle.bind(this));
            
            layer.popup = L.popup(this.options.popup);
            layer.bindPopup(layer.popup);

            layer.options = {...this.options};
            
            handleLayer.call(this, layer);

            resolve(layer);
        });

        return promise;
    }

    _getLayerStyle(feature) {
        let style       = Object.assign({}, this.options.styles);
        style.className = `feature_${feature.properties.id}`;
        
        if (includes(this.options.ignoreLayerIds, feature.properties.id)) {
            style.fillColor = Color.getColorFromObj(this.options.colors.ignore, this.options.map_id);
            style.className += ' feature_ignore';
        }

        return style;
    }

    _handleLayer(layer) {
        if (this.options.popup !== false) {
            layer.on({
                mouseover: this._onEnterLayer.bind(this),
                mouseout: this._onLeaveLayer.bind(this),
                mousemove: this._onMoveLayer.bind(this)
            });
        }
    }

    _onEnterLayer(e) {        
        let layer = this._getLayerFromParent(e.layer, e.target);
        
        if (includes(this.options.ignoreLayerIds, layer.feature.properties.id)) return;

        let parentLayer = e.target,
        content         = (layer.popupContent) ? layer.popupContent : layer.feature.properties[this.options.propertyName];

        parentLayer.popup.setContent(content);
        parentLayer.openPopup();
        parentLayer.popup.setLatLng(e.latlng);
        
        layer.setStyle(this.options.styles.hover);
        
        // Leaflet Bug: https://github.com/Leaflet/Leaflet/issues/4050
        // bringToFront breaks event handler in IE
        if(!L.Browser.ie)
            layer.bringToFront();
    }

    _onMoveLayer(e) {
        e.target.popup.setLatLng(e.latlng);
    }

    _onLeaveLayer(e) {
        let layer = this._getLayerFromParent(e.layer, e.target);

        layer._map.closePopup();

        layer.setStyle(omit(this.options.styles, 'fillColor'));
        layer.bringToBack();
    }

    _getLayerFromParent(layer, parentLayer) {        
        if (!layer.feature) {
            let id = layer._leaflet_id;

            layer = find(parentLayer._layers, (layer) => {
                return layer._layers && find(layer._layers, {_leaflet_id: id});
            });
        }

        return layer;
    }
}