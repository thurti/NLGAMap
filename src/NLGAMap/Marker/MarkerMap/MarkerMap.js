import defaultsDeep from 'lodash/defaultsDeep'; 
import min from 'lodash/min'; 
import max from 'lodash/max'; 
import each from 'lodash/each'; 
import flatten from 'lodash/flatten'; 
import template from 'lodash/template'; 
import map from 'lodash/map';
import get from 'lodash/get';

import {MarkerBase} from '../MarkerBase';
import {TimelineParser} from '../../Timeline/TimelineParser';

import legendTemplate from '../../Legend/Marker/legend.marker.jst';

import {defaults} from './defaults';
import popupTemplate from './popup.jst';
import './style.css';

export class MarkerMap extends MarkerBase {

    constructor(options, layers) {
        super(options, layers);
        this._popupTemplate = popupTemplate;
        this.init(options);
    }

    init(options) {
        let opts     = defaultsDeep(options, defaults);
        this.options = opts;

        this._layerName       = opts.layerName;
        this._valuePropPath   = opts.valuePropPath;
        this._timeKey         = opts.timeKey;
        this._customIcon      = opts.customIcon;
        this._legendTemplate  = (opts.legend && opts.legend.template) ? template(opts.legend.template) : legendTemplate;
        this._popupTemplate   = (opts.popup && opts.popup.template) ? template(opts.popup.template) : this._popupTemplate;
        this._timeline        = opts.timeline;

        this.data     = opts.data;
        this.unit     = opts.unit;
        this.title    = opts.title;      

        if (this.options.legend !== false) {
            this.options.legend._getPointSize = this._getPointSize.bind(this);
            this.options.legend.bounds        = this._bounds;
        }
    }

    get data() {
        return (this._timeline) ? this._parsedData[this.layers.timeline.currentTime] : this._parsedData;
    }

    set data(rawData) {
        if (typeof rawData !== 'object' || rawData.type !== 'FeatureCollection') throw('data must be a geojson object');

        if (this._timeline) {
            this._times      = TimelineParser.getTimesFromGeoJSON(rawData, this._timeKey);
            this._parsedData = TimelineParser.parseGeoJSON(rawData, this._times, this._timeKey);
        } else {
            this._parsedData = rawData;
        }

        this._bounds = this._getBounds(this._parsedData);
    }

    _getIcon(value) {
        if (typeof this._customIcon === 'function') {
            return this._customIcon.call(this, value);
        } else {
            let size = this._getPointSize(value);

            return L.divIcon({
                className: 'nlga_map-point-marker',
                iconSize: size,
                html: `<svg class="nlga_map-marker-icon" width="${size[0]}" height="${size[1]}"><circle cx="50%" cy="50%" r="50%" style="${this.options.style}"></svg>`
            });
        }
    }

    _getPointSize(value) {
        let values_max = this._bounds[1],
        maxRadius      = this.options.maxRadius,
        exponent       = this.options.power_function_exponent,
        
        //calc radius with exponential function: smaller values => bigger differences; larger values => smaller differenecs
        radius = Math.pow((value/values_max), exponent) * maxRadius,
        w      = radius * 2,
        h      = w;

        if (this.options.scale === 'log' && w !== 0) {
            w = (w <= 1) ? w + 1 : w;
            w = Math.log(w) * this.options.logFactor;
            h = w;
        }

        return [w, h];
    }

    _getBounds(data) {
        let flat_data = (this._timeline) ? this._flattenData(data) : data.features;
        
        let values = flat_data.map((obj) => {
            if (obj && obj.properties){
                return parseFloat(get(obj.properties, this._valuePropPath)); 
            }
        });

        let values_min = min(values),
        values_max     = max(values);

        return [values_min, values_max];
    }

    _flattenData(data) {
        const flat_data = [];

        each(data, (item) => {
            item.forEach((i) => {flat_data.push(i);});
        });

        return flat_data;
    }

    _getValues(parsedData) {
        let data;

        if (this._timeline) {
            data = map(parsedData, (o) => {
                return map(o, (d) => {
                    return get(d.properties, this._valuePropPath);
                });
            });
            
            data = flatten(data);
        } else {
            data = map(parsedData.features, (d) => {
                        return get(d.properties, this._valuePropPath);
                    });
        }

        return data;
    }
}