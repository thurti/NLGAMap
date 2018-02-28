import defaultsDeep from 'lodash/defaultsDeep';
import each from 'lodash/each';
import repeat from 'lodash/repeat';
import template from 'lodash/template';
import map from 'lodash/map';
import flatten from 'lodash/flatten';

import {MarkerBase} from '../MarkerBase';

import {defaults} from './defaults';
import popupTemplate from './popup.jst';
import './icons.css';
import './style.css';

export class SymbolMap extends MarkerBase {
    constructor(options, layers) {
        super(options, layers);
        this._popupTemplate = popupTemplate;
    }

    init(options) {
        let opts     = defaultsDeep(options, defaults);
        this.options = opts;

        if (this.options.popup !== false) {
            this.options.popup.markerNames = opts.legend.markerNames;
        }

        this._layerName       = opts.layerName;
        this._timeKey         = opts.timeKey;
        this._legendTemplate  = (opts.legend && opts.legend.template) ? template(opts.legend.template) : this._legendTemplate;
        this._popupTemplate   = (opts.popup && opts.popup.template) ? template(opts.popup.template) : this._popupTemplate;
        this._timeline        = opts.timeline;
        this._zoomLevel       = this.layers.leaflet.getZoom();

        this.title = opts.title;

        if (typeof this._onMapZoom === 'function') 
            this.layers.leaflet.on('zoomend', this._onMapZoom.bind(this));
    }    

    get data() {
        return (this._timeline) ? this._parsedData[this.layers.timeline.currentTime] : this._parsedData;
    }

    set data(rawData) {
        this._times      = (this._timeline) ? Object.keys(rawData) : null;
        this._parsedData = this._parseData(rawData);
    }

    render() {
        return fetch(this.options.json)
                .then(response => {return response.json()})
                .then((data => {
                    this._symbolPositions = data;
                    this.data = this.options.data;

                    return super.render();
                }).bind(this));
    }

    _parseData(rawData) {
        let parsedData = {};

        if (this._timeline) {
            each(rawData, (data, key) => {
                parsedData[key] = this._createGeoJson(data);
            }, this);
        } else {
            parsedData = this._createGeoJson(rawData);
        }

        return parsedData;
    }

    _createGeoJson(rawData) {
        var geoJson     = {"type":"FeatureCollection","features": []},
        symbolPositions = this._symbolPositions,
        title           = this.title;

        each(rawData, function (data, key) {
            if (!symbolPositions[key]) return;

            let props  = (typeof data === 'object') ? data : {value: data};
            props.name = title;

            let feature = {
                "type": "Feature",
                "geometry": {
                  "type": "Point",
                  "coordinates": symbolPositions[key]
                },
                "properties": props
            };

            geoJson.features.push(feature);
        });

        return geoJson;
    }

    _getIcon(value) {
        if (typeof this._customIcon === 'function') {
            return this._customIcon.call(this, value);
        } else {
            
            let className = (this.options.popup !== false) ? 'nlga_map-symbol-marker' : 'nlga_map-symbol-marker no-pointer';

            return L.divIcon({
                className: className,
                iconSize: L.Point(this.options.styles.size),
                html: this._getIconHtml(value)
            });
        }
    }
}