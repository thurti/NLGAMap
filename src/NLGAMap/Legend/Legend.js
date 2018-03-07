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