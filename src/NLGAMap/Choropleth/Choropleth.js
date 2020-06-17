import defaultsDeep from 'lodash/defaultsDeep'; 
import has from 'lodash/has'; 
import each from 'lodash/each'; 
import pick from 'lodash/pick'; 
import map from 'lodash/map'; 
import merge from 'lodash/merge'; 
import flatten from 'lodash/flatten'; 
import template from 'lodash/template';

import Rainbow from 'rainbowvis.js';

import {Parse} from '../../Utils/Parse';
import {Color} from '../../Utils/Color';
import {Classification} from '../../Statistics/Classification';
import {TimelineParser} from '../Timeline/TimelineParser';

import {defaults, modes} from './defaults';
import popupTemplate from './popup.jst';

import {ContinuousLegend} from '../Legend/Choropleth/ContinuousLegend';
import {ClassesLegend} from '../Legend/Choropleth/ClassesLegend';

export class Choropleth {

    constructor(options, layers) {
        this.layers = layers;
        this.init(options);
    }

    init(options) {
        let opts     = defaultsDeep(options, defaults);
        this.options = opts;        

        this._layerName      = opts.layerName;
        this._customIcon     = opts.customIcon;
        this._legendTemplate = (opts.legend && opts.legend.template) ? template(opts.legend.template) : null;
        this._timeline       = opts.timeline;
        this._layerCallback  = opts.layerCallback;
        this._popupTemplate  = (opts.popup && opts.popup.template) ? template(opts.popup.template) : popupTemplate;

        this.data        = opts.data;
        this.unit        = opts.unit;
        this.steps       = opts.steps;
        this.mode        = opts.mode;
        this.colorScheme = opts.colorScheme;
        this.title       = opts.title;
    }

    get data() {
        return (this._timeline) ? this._parsedData[this.layers.timeline.currentTime] : this._parsedData;
    }

    set data(parsedData) {
        if (typeof parsedData !== 'object') throw('data must be an object');

        parsedData = this._parseDataToObject(parsedData);
        this.layers.baselayer.eachLayer((layer) => this._addValueForNoData(layer.feature.properties.id, parsedData));

        this._parsedData     = parsedData;
        this._times          = (this._timeline) ? Object.keys(parsedData) : null;
        this._classification = new Classification(this._getValues(this._parsedData));

        this._update();
    }

    get steps() {
        return this._steps;
    }

    set steps(steps) {
        if (this.mode === 'manual') return;

        steps = Parse.int(steps);

        if (steps) {
            this._steps = steps;
            this._update();
        }
    }

    get limits() {
        return this._limits;
    }

    set limits(limits) {
        if (!limits) return;
        
        limits = (!Array.isArray(limits)) ? limits.split(',') : limits;

        if (limits.length > 1 || (this.mode === 'continuous' && limits.length > 0)) {
            this._limits = this._classification.setLimits(limits);
            this._steps  = limits.length-1;
            this._update();
        }
    }

    get mode() {
        return this._mode;
    }

    set mode(mode) {
        if (Object.keys(modes).indexOf(mode) <= -1) return;

        switch (mode) {
            case 'manual':
                this._mode  = 'manual';
                this.limits = this.options.limits;
                break;

            case 'text':
                this._mode   = 'text';
                this._limits = this.options.limits;
                this._colors = this._getColors(this.steps, this.colorScheme);
                break;

            default:
                this._mode = mode;
                this._update();
        }
    }

    get colorScheme() {
        return this._colorScheme;
    }

    set colorScheme(scheme) {
        if (!this.options.colors[scheme]) {
            throw new Error(`Color scheme '${scheme}' does not exist.\n Use an colorbrewer scheme (eg. 'PuBu') or define your own color scheme as an array with color values in the config object.`);
        }
        
        this._colorScheme = scheme;
        this._update();
    }

    get colors() {
        return this._colors;
    }

    _update() {
        if (!this._parsedData || !this.mode || !this.steps || !this.colorScheme || this.mode === 'text') return;

        this._limits         = this._classification.getLimits(this.mode, this.steps);
        this._colors         = this._getColors(this.steps, this.colorScheme);
        this._chromaFunction = this._createChromaFunction();
    }

    addLegendTo(leaflet) {
        if (this.options.legend === false) return this;
        if (this.legend) this.legend.remove();

        let options  = merge(
                            this.options.legend, 
                            pick(this, ['title', 'limits', 'unit', 'colors', 'colorScheme', '_chromaFunction']),
                            {
                                mode: this.mode,
                                data: this._getValues(this._parsedData)
                            }
                        );

        this.legend = (this.mode === 'continuous') ? new ContinuousLegend(options) : new ClassesLegend(options);

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

    setLayerColor(layer, color, pattern = '') {
        color = Color.getColorPatternUrl(color, pattern, this.options.map_id);
        this._setLayerColor(layer, color);
    }

    setLayerColorFromValue(layer, value, pattern = '') {
        let color = this._getColorForValue(value);
        this.setLayerColor(layer, color, pattern);
    }

    setLayerPopup(layer, value, data, unit = this.unit) {
        if (this.options.popup !== false) {

            let more_data = (typeof this.data[layer.feature.properties.id] === 'object') ? this.data[layer.feature.properties.id] : {};

            layer.popupContent = this._popupTemplate(merge(more_data, {
                    name: layer.feature.properties[this.options.propertyName],
                    value: value,
                    unit: (value !== this.options.popup.textNotFound && this.options.mode !== 'text') ? unit : '',
                    data: data,
                    unitData: (data) ? unit : ''
                }));
        }
    }

    destroy() {
        this.legend.remove();

        this.options         = null;
        this.layers          = null;        
        this._customIcon     = null;
        this._legendTemplate = null;
        this._timeline       = null;
        this._layerCallback  = null;
        this._popupTemplate  = null;
        this._parsedData     = null;
        this._chromaFunction = null;
        this._classification = null;
    }

    _updateLayer() {
        this.layers.baselayer.eachLayer(this._onEachLayer.bind(this));
    }

    _onEachLayer(layer) {
        let value,
        id = layer.feature.properties.id;

        layer.getElement().classList.remove('noData');

        if (this.layers.baselayer.options.ignoreLayerIds.indexOf(id) > -1) {
            this.setLayerColor(layer, this.colors.ignore);
        } else if (id in this.data) {
            let valueData = this._getLayerValue(id, 'data');
                value     = this._getLayerValue(id, this.options.propertyValue);

            this.setLayerColorFromValue(layer, value, this.data[id].pattern);
            this.setLayerPopup(layer, value, valueData);
            this._addEvents(layer, value);
        } else {
            layer.getElement().classList.add('noData');
            this.setLayerPopup(layer, this.options.popup.textNotFound);
            this.setLayerColor(layer, this.colors.notFound);
        }

        if (typeof this._layerCallback === 'function') {
            this._layerCallback(layer, value);
        }
    }

    _setLayerColor(layer, color) {
        layer.setStyle({
            fillColor: color
        });
    }

    _getLayerValue(id, propName = 'value') {
        const layerData = this.data[id];

        if (typeof layerData === 'object' && propName in layerData) {
            return layerData[propName];
        } else if (propName === 'value') {
            return layerData;
        } else {
            return undefined;
        }
    }
    
    _getColorForValue(value) {
        switch (this.mode) {

            case 'continuous':
                return this._chromaFunction(value);

            case 'text':
                return this.colors.classes[this.limits.indexOf(value)];

            default: 
                let idx = this._classification.getClassIdx(value);
                return (idx !== -1) ? this.colors.classes[idx] : this.options.colors.notFound;
        }
    }

    _addEvents(layer, value) {
        if (this.layers.baselayer.options.ignoreLayerIds.indexOf(layer.feature.properties.id) > -1) return;

        let idx = this._classification.getClassIdx(value);

        if (this.legend) {
            layer.on('mouseover', this.legend.setMarkerPosition.bind(this.legend, {value: value, idx: idx}));
            layer.on('mouseout', this.legend.hideMarker.bind(this.legend));
        }
    }

    _parseDataToObject(parsedData) {
        let parsedData_obj = {};

        if (this._timeline) {

            if (Array.isArray(parsedData) && typeof this.options.propertyTimeKey === 'string') {
                const times = TimelineParser.getTimesFromJSON(parsedData, this.options.propertyTimeKey);
                parsedData = TimelineParser.parseJSON(parsedData, times, this.options.propertyTimeKey);
            }

            each(parsedData, (data, key) => {
                let data_obj = {};
                if (Array.isArray(data)) {
                    data.forEach((d) => {
                        data_obj[d[this.options.propertyId]] = d;
                    });
                } else {
                    data_obj = data;
                }
                parsedData_obj[key] = data_obj;
            });
        } else {
            if (!Array.isArray(parsedData)) return parsedData;
            1
            parsedData.forEach((data) => {
                parsedData_obj[data[this.options.propertyId]] = data;
            });   
        }

        return parsedData_obj;
    }

    _addValueForNoData(id, parsedData) {
        if (this.options.valueIfNoData === false) return;

        if (this._timeline) {
            each(parsedData, (data, key) => {
                if (!Object.keys(data).includes(id)) {
                    if (this.options.propertyValue) {
                        parsedData[key][id] = {};
                        parsedData[key][id][this.options.propertyValue] = this.options.valueIfNoData;
                    } else {
                        parsedData[key][id] = this.options.valueIfNoData;
                    }
                }
            });
        } else {
            if (!Object.keys(parsedData).includes(id)) {
                if (this.options.propertyValue) {
                    parsedData[id] = {};
                    parsedData[id][this.options.propertyValue] = this.options.valueIfNoData;
                } else {
                    parsedData[id] = this.options.valueIfNoData;
                }
            }
        }
    }

    _getValues(parsedData) {
        let data;

        if (this._timeline) {
            data = map(parsedData, (o) => {
                return map(o, (d) => {
                    return (typeof d === 'object') ? d[this.options.propertyValue] : d;
                });
            });
            
            data = flatten(data);
        } else {
            data = map(parsedData, (d) => {
                        return (typeof d === 'object') ? d[this.options.propertyValue] : d;
                    });
        }

        return data;
    }

    _getColors(steps, scheme) {
        if (this.mode !== 'text' && (!has(this.options.colors, scheme) || !has(this.options.colors[scheme], steps))) {
            const example        = {layers:{choropleth:{colors:{[scheme]:{[steps]: ['#ff0000', 'rgb(255,0,0)', '...']}}}}},
                  example_string = JSON.stringify(example, null, 3);

            throw new Error(`Color scheme '${scheme}' has no colors defined for ${steps} steps.\nDefine an array with color values in the config object:\n${example_string}`);
        }

        const class_colors = (this.mode === 'text') ? this.options.limitColors : this.options.colors[scheme][steps];

        return {
            classes : class_colors,
            ignore  : Color.getColorFromObj(this.layers.baselayer.options.colors.ignore, this.options.map_id),
            notFound: Color.getColorFromObj(this.options.colors.notFound, this.options.map_id)
        }
    }

    _createChromaFunction() {
        const rainbow    = new Rainbow(),
              hex_colors = this.colors.classes.map(Color.rgbToHex);

        let min, max;
        
        if (this._classification.isOpenRange(this.limits)) {
            min = this.limits[1];
            max = this.limits[this.limits.length - 2];
        } else {
            min = this.limits[0];
            max = this.limits[this.limits.length - 1];
        }

        rainbow.setSpectrum(...hex_colors);
        rainbow.setNumberRange(min, max);

        return (value) => {return '#' + rainbow.colourAt(value);};
    }
}