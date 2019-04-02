import template from 'lodash/template';
import defaultsDeep from 'lodash/defaultsDeep'; 
import forEach from 'lodash/forEach';

import {Classification} from '../../Statistics/Classification';
import {Parse} from '../../Utils/Parse';
import {Numbers} from '../../Utils/Numbers';
import {defaults, statistic_property_names} from './defaults';

import './style.css';

export class Legend {
    constructor(options) {
        this.options = defaultsDeep(options, window.nlga_map_legend_defaults, defaults);
        
        //@deprecated since 1.0.2
        //@remove in 2.0.0
        if (typeof this.options.striped === 'string') {
            console.warn("Warning: Option 'legend.striped' is deprecated. Use legend.patterns instead. See https://www.apps.nlga.niedersachsen.de/tools/NLGAMap/manual/configuration.html#-code-legend--code- for details. ");
            
            this.options.patterns.push({id: 'striped', text: this.options.striped});
        }        
        //@deprecated since 1.1.0
        //@remove in 2.0.0
        if (typeof this.options.noData === 'string') {
            console.warn(`Warning: Option 'legend.noData' has changed. Use {noData: true, noDataText = '${this.options.noData}'} to set displayed text instead. See https://www.apps.nlga.niedersachsen.de/tools/NLGAMap/manual/configuration.html#-code-legend--code- for details.`);

            this.options.noDataText = this.options.noData;
            this.options.noData = true;
        } 
        //@deprecated since 1.1.0
        //@remove in 2.0.0
        if (typeof this.options.ignoredLayers === 'string') {
            console.warn(`Warning: Option 'legend.ignoredLayers' has changed. Use {ignoredLayers: true, ignoredLayersText = '${this.options.ignoredLayers}'} to set displayed text instead. See https://www.apps.nlga.niedersachsen.de/tools/NLGAMap/manual/configuration.html#-code-legend--code- for details.`);

            this.options.ignoredLayersText = this.options.ignoredLayers;
            this.options.ignoredLayers = true;
        }

        this.init(this.options);
    }

    init(options) {
        this.remove();
        this._initStatistics();

        this._legend       = L.control(options);
        this._legend.onAdd = this.render.bind(this);
    }

    _initStatistics() {
        if (!this.options.data) return;

        this._precision      = Numbers.getPrecision(this.options.data);
        const classification = new Classification(this.options.data);
        let stats_precision = (this._precision < 2) ? 2 : this._precision; //set minimum of 2 decimals for statistics

        for (let prop in this.options.statistics) {
            if (this.options.statistics[prop] === true) {
                this.options.statistics[prop] = Numbers.round(classification[prop](), stats_precision);
            }
        }
    }

    setTemplate(tpl) {
        if (!tpl) return this;

        this._tpl = (typeof tpl === 'function') ? tpl : template(tpl);
        return this;
    }

    addTo(map) {
        this.remove();
        this._legend.addTo(map);
    }

    remove() {
        if (!this._legend) return;

        this._legend.remove();
    }
}