import range from 'lodash/range';
import {Parse} from '../../../Utils/Parse';
import {Numbers} from '../../../Utils/Numbers';
import {Legend} from '../Legend';
import legendTemplate from './legend.continuous.jst';

export class ContinuousLegend extends Legend {
    constructor(options) {
        super(options);
        this._tpl  = legendTemplate;
        this._step = null;
    }

    render() {
        let options    = this.options,
        legend         = L.DomUtil.create('div', 'nlga_map-legend leaflet-control-layers leaflet-control-layers-expanded leaflet-control nlga_map-legend-continuous'),
        gradientValues = this._getGradientValues(options.limits);
        
        options.gradientValues = gradientValues;
        options.stepWidth      = Numbers.round(100 / gradientValues.length, this._precision);
        options.min            = gradientValues[0];
        options.max            = gradientValues[gradientValues.length-1];

        legend.innerHTML     = this._tpl(options);
        this._gradientValues = gradientValues;

        return legend;
    }

    getMarker() {
        if (this._marker) return this._marker;

        return this._legend.getContainer().querySelector('.nlga_map-legend__marker');
    }

    setMarkerPosition(e) {
        let step = this._getStep(),
        steps    = (this._gradientValues.indexOf(e.value)) * step,
        marker   = this.getMarker();

        marker.classList.add('is-active');
        marker.style.transform = `translateX(${steps}px)`;
    }

    hideMarker() {
        this._legend.getContainer().querySelector('.nlga_map-legend__marker').classList.remove('is-active');
    }

    _getGradientValues(limits) {
        const step_size      = parseFloat('1e-' + this._precision), //create step_size size from precision (eg. 0.1)
              values         = range(limits[0], limits[1], step_size),
              values_rounded = values.map((value) => {return Numbers.round(value, this._precision)});

        //add upper limit to range if not present
        //by default range() doesn't include the upper limit, but it can be present caused by Numbers.round
        if (values_rounded[values_rounded.length - 1] !== limits[1]) {
            values_rounded.push(limits[1]);
        }

        return values_rounded;
    }

    _getStep() {
        if (this._step) return this._step;

        let container = this._legend.getContainer(),
        step          = (container.querySelector('.nlga_map-legend__gradient').offsetWidth) / this._gradientValues.length;

        return step;
    }
}