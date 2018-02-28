import 'innersvg-polyfill';
import defaultsDeep from 'lodash/defaultsDeep';
import each from 'lodash/each';
import cloneDeep from 'lodash/cloneDeep';

import L from 'leaflet';
import 'leaflet-fullscreen';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css'

import {SVGRectPattern} from '../Utils/SVGRectPattern';

import {Layers} from './Layers/Layers';
import {MarkerMap} from './Marker/MarkerMap/MarkerMap';
import {SymbolArrows} from './Marker/SymbolMap/Arrows/SymbolArrows';
import {SymbolBars} from './Marker/SymbolMap/Bars/SymbolBars';
import {Choropleth} from './Choropleth/Choropleth';

import './style.css';
import {defaults} from './defaults';

export default class NLGAMap {

    /**
     * @param {object} options
     * @param {string} options.id      Map id, also used as selector.
     * @param {object} options.map     Leaflet options. @see http://leafletjs.com/reference.html#map-options
     */
    constructor(options) {
        this.id          = options.id;
        this.options     = defaultsDeep(options, window.nlga_map_global_defaults, defaults);
        this.container   = document.querySelector(`#${this.id}`);
        this.leaflet     = null;
        this.layers      = null;
        this.choropleths = {};
        this.markerMaps  = {};
        this.symbolMaps  = {};
    }

    static get VERSION() {
        return VERSION;
    }

    get timeline() {
        return this.layers.timeline;
    }
    
    render() {
        this._createMap(this.id, this.options.map);

        let promise = this._addBaseLayers().then(() => {  
    
            this._addDefs(this.options.defs.patterns, this.options.baseLayer.colors.ignore.color);
        
            if (this.options.map.fitBounds === true)
                this.leaflet.fitBounds(this.layers[this.options.baseLayer.layerName].getBounds());

            return this._addUserLayers();
        });

        return promise;
    }

    addRegionLayer(options, handleLayer) {
        let promise = this.layers.addRegionLayer(options, handleLayer);
        return promise;
    }

    addMarkerLayer(options, pointToLayerCallback) {
        let promise = this.layers.addMarkerLayer(options, pointToLayerCallback);
        return promise;
    }

    addMarkerMap(options) {
        let markerMap = new MarkerMap(options, this.layers),
        promise       = markerMap.addLegendTo(this.leaflet).render();

        this.markerMaps[options.layerName] = markerMap;

        return promise;
    }

    addChoroplethMap(options) {
        try {
            const choropleth = new Choropleth(options, this.layers);

            this._addDefs(this.options.defs.patterns, choropleth.options.colors.notFound.color);            
            this._addDefs(this.options.defs.patterns, choropleth.colors.classes);

            choropleth.addLegendTo(this.leaflet)
                      .render()
            
            this.choropleths[options.layerName] = choropleth;
        } catch(error) {
            console.warn(error);
        }
    }

    addSymbolMap(options) {
        let promise;
        
        switch (options.type) {

            case 'arrows':
                const symbolArrorws = new SymbolArrows(options, this.layers);
                promise             = symbolArrorws.addLegendTo(this.leaflet).render();

                this.symbolMaps[options.layerName] = symbolArrorws;
                break;

            case 'bars':
                const symbolBars = new SymbolBars(options, this.layers);
                promise          = symbolBars.addLegendTo(this.leaflet).render();

                this.symbolMaps[options.layerName] = symbolBars;
                break;

        }

        return promise;
    }

    addAttribution(text) {
        this.leaflet.attributionControl.addAttribution(text);
    }

    removeAttribution(text) {
        this.leaflet.attributionControl.removeAttribution(text);
    }

    clearAttributions() {
        this.leaflet.attributionControl._attributions = {};
        this.leaflet.attributionControl._update();
    }

    showAttribution() {
        this.leaflet.attributionControl.addTo(this.leaflet);
    }

    hideAttribution() {
        this.leaflet.attributionControl.removeFrom(this.leaflet);
    }

    destroy() {
        this.layers.destroy();
        each(this.choropleths, (choropleth) => {choropleth.destroy();});
        each(this.markerMaps, (markerMap) => {markerMap.destroy();});
        each(this.symbolMaps, (symbolMap) => {symbolMap.destroy();});
        this.leaflet.remove();

        this.options     = null;
        this.container   = null;
        this.layers      = null;
        this.choropleths = null;
        this.markerMaps  = null;
        this.symbolMaps  = null;
        this.leaflet     = null;
    }

    _createMap(id, mapOptions) {
        if (this.leaflet) this.leaflet.remove();
        this.leaflet = L.map(this.id, mapOptions);
        
        if (mapOptions.controls.zoom)
            L.control.zoom(mapOptions.controls.zoom).addTo(this.leaflet);

        if (this.options.map.fullscreenControl === true)
            this._addFullscreenChangeListener();

        if (L.Browser.mobile) 
            this.leaflet.dragging.disable();

        this.addAttribution(mapOptions.controls.attribution.text);
    }

    _addBaseLayers() {
        let promise_baseLayer, promise_cityLayer;

        this.layers       = new Layers(this.options.layers, this.leaflet);
        promise_baseLayer = this.layers.addRegionLayer({...this.options.baseLayer, map_id: this.id});

        if (this.options.cityLayer && this.options.cityLayer.json) {
            promise_cityLayer = this.layers.addMarkerLayer(this.options.cityLayer);
        }
            
        return Promise.all([promise_baseLayer, promise_cityLayer]);
    }

    _addUserLayers() {
        let promises = [],
        choropleth   = this.options.layers.choropleth,
        markers      = this.options.layers.markers,
        symbols      = this.options.layers.symbols;

        if (choropleth) {
            choropleth.map_id       = this.id;
            choropleth.propertyName = this.options.baseLayer.propertyName;

            this.addChoroplethMap(choropleth);
        }

        if (markers) {
            markers.forEach((marker) => {
                marker.map_id = this.id;
                let promise = this.addMarkerMap(marker);
                promises.push(promise);
            });
        }

        if (symbols) {
            symbols.forEach((symbol) => {
                symbol.map_id = this.id;
                let promise = this.addSymbolMap(symbol);
                promises.push(promise);
            });
        }

        return promises;
    }

    _addFullscreenChangeListener() {
        this.leaflet.on('fullscreenchange', () => {
            if (this.leaflet.isFullscreen()) {
                const bounds                   = this.layers[this.options.baseLayer.layerName].getBounds();
                      this._current_zoom_level = this.leaflet.getZoom(),
                      this._current_center     = this.leaflet.getCenter();
                
                this.leaflet.setMaxBounds(bounds.pad(0.5));
                this.leaflet.setMaxZoom(10);
                this.leaflet.fitBounds(bounds);

                if (L.Browser.mobile)
                    this.leaflet.dragging.enable();
            } else {
                this.leaflet.setMaxBounds(this.options.map.maxBounds);
                this.leaflet.setMaxZoom(this.options.map.maxZoom);
                
                this.leaflet.setView(this._current_center, this._current_zoom_level, {animate: false});

                if (this.options.map.fitBounds === true)
                    this.leaflet.fitBounds(this.layers[this.options.baseLayer.layerName].getBounds());

                if (L.Browser.mobile)
                    this.leaflet.dragging.disable();
            }
        });
    }

    _addDefs(patterns, colors) {
        if(!colors) return;

        const svg = this.container.querySelector('svg');

        patterns.forEach(pattern => {
            const rect_pattern = new SVGRectPattern(this.id);

            rect_pattern.setProperties(pattern);
            rect_pattern.addColoredVariants(colors);
            rect_pattern.addTo(svg);
        });
    }
}