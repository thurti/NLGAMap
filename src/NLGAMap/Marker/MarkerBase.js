import defaultsDeep from 'lodash/defaultsDeep'; 
import omit from 'lodash/omit';

import {Color} from '../../Utils/Color';

import {MarkerLegend} from '../Legend/Marker/MarkerLegend';
import {TimelineParser} from '../Timeline/TimelineParser';

export class MarkerBase {

    constructor(options, layers) {
        this.layers = layers;
    }

    get colors() {
        return {
            ignore  : Color.getColorFromObj(this.layers.baselayer.options.colors.ignore, this.options.map_id)
        };
    }
    
    addLegendTo(leaflet) {
        if (this.options.legend === false) return this;
        if (this.legend) this.legend.remove();

        const data = this._getValues(this._parsedData);
        let options  = defaultsDeep(
                            this.options.legend,
                            {
                                title: this.title,
                                unit: this.options.unit,
                                data: data,
                                colors: this.colors,
                                style: this.options.style
                            }, 
                            this.options.colors
                        );

        this.legend = new MarkerLegend(options);
        
        this.legend.setTemplate(this._legendTemplate)
                   .addTo(leaflet);

        return this;     
    }

    render() {
        if (this._timeline) {
            let callbacks = [this._updateLayer.bind(this)];
            if (typeof this._timeline.onTimeChange === 'function') callbacks.push(this._timeline.onTimeChange);

            let options = defaultsDeep({times: this._times, onTimeChange: callbacks}, this.options.timeline);
            this.layers.addTimeline(options);
        }

        return this._updateLayer();
    }

    destroy() {
        this.legend.remove();

        this.layers = null;
        this.options = null;

        this._parsedData     = null;
        this._legendTemplate = null;
        this._popupTemplate  = null;
        this._timeline       = null;

    }

    _updateLayer() {
        if (this.layers[this._layerName]) this.layers.removeLayer(this._layerName);
        
        if (this.data) {
            let options = defaultsDeep({
                layerName: this._layerName,
                json: this.data,
                popupTemplate: this._popupTemplate,
                unit: this.unit,
                showPopup: true
            }, this.options);

            let promise = this.layers.addMarkerLayer(options, this._pointToLayerCallback.bind(this));
            
            promise.then(() => {
                if (typeof this._onLayerAdded === 'function') {
                    this._onLayerAdded();
                }
            });

            return promise;
        }

        return false;
    }

    _pointToLayerCallback(feature, latlng) {
        return L.marker(latlng, {
            icon: this._getIcon(feature.properties.value),
            pane: this._layerName
        });
    }

    /**
     * Should be implemented by classes which inherit from MarkerBase.js.
     * Returns leaflet icon object.
     * 
     * @param {number} value 
     * @return {L.Icon}
     */
    _getIcon(value) {}

    /**
     * Should be implemented by classes which inherit from MarkerBase.js.
     * Returns flat array with all data values.
     * 
     * @param {Object} parsedData 
     * @return {number[]}
     */
    _getValues(parsedData) {}
}