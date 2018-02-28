import each from 'lodash/each';
import {Controls} from './Controls';
import {MarkerLayer} from './MarkerLayer';
import {RegionLayer} from './RegionLayer';
import {Timeline} from '../Timeline/Timeline';

export class Layers {
    /**
     * @param  {object} options
     * @param  {object} options.layerControls
     * @param  {Leaflet} leaflet 
     * @return {Layers}
     */
    constructor(options, leaflet) {
        this.options  = options;
        this.leaflet  = leaflet;
        this.timeline = null;
        this.controls = new Controls(options.layerControls, leaflet);
    }

    addMarkerPane(name, order) {
        if (!this.leaflet.getPane(name)) {
            this.leaflet.createPane(name);
        }

        this.leaflet.getPane(name).style.zIndex = 600 + order; //600 is default zIndex for markerPane
    }

    addRegionLayer(options, handleLayer) {
        let regionLayer = new RegionLayer(options),
        promise         = regionLayer.load(options.json, handleLayer)
                                     .then(this._onLayerLoaded.bind(this));

        return promise;
    }

    addMarkerLayer(options, pointToLayerCallback) {
        this.addMarkerPane(options.layerName, options.order);

        let markerLayer = new MarkerLayer(options),
        promise         = markerLayer.load(options.json, pointToLayerCallback)
                                     .then(this._onLayerLoaded.bind(this));

        return promise;
    }

    addTimeline(options) {
        if (!this.timeline) {
            this.timeline = new Timeline(options);

            if (this.leaflet)
                this.timeline.addTo(this.leaflet);
        } else {
            this.timeline.addCallbacks(options.onTimeChange);
        }
    }

    removeTimeline() {
        if (this.timeline)
            this.timeline.remove();

        this.timeline = null;
    }

    removeControls() {
        if (this.controls)
            this.controls.remove();
        
        this.controls = null;
    }

    removeLayer(name) {
        this.controls.removeEvents();
        this.controls.removeLayer(this[name]);
        this.controls.addEvents();

        this.leaflet.removeLayer(this[name]);
        delete this[name];
    }

    destroy() {
        each(this, (layer) => {
            if (layer && layer.options && layer.options.layerName)
                this.removeLayer(layer.options.layerName);
        });

        this.removeTimeline();
        this.removeControls();

        this.options = null;
        this.leaflet = null;
    }

    _onLayerLoaded(layer) {
        let options = layer.options;

        if (this.options.layerControls !== false) {
            this.controls.addLayer(layer);
        }


        let layerIsEnabled = this.controls.layerIsEnabled(options.layerName);

        if (options.layerControl === false || layerIsEnabled) {
            layer.addTo(this.leaflet);
        }

        this[options.layerName] = layer;
        return layer;
    }
}