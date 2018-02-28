import {Legend} from '../Legend';
import legendTemplate from './legend.marker.jst';

export class MarkerLegend extends Legend {
    constructor(options) {
        super(options);
        this._tpl = legendTemplate;
    }

    render() {
        let legend       = L.DomUtil.create('div', `nlga_map-legend leaflet-control-layers leaflet-control-layers-expanded leaflet-control nlga_map-legend-marker`);
        legend.innerHTML = this._tpl(this.options);

        return legend;
    }
}