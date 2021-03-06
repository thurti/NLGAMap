import {Legend} from '../Legend';
import legendTemplateClasses from './legend.classes.jst';
import legendTemplateText from './legend.classes.text.jst';

export class ClassesLegend extends Legend {
    constructor(options) {
        super(options);
        this._tpl = (options.mode === 'text') ? legendTemplateText : legendTemplateClasses;
    }

    render() {
        let legend       = L.DomUtil.create('div', `nlga_map-legend leaflet-control-layers leaflet-control-layers-expanded leaflet-control nlga_map-legend-classes ${this.options.colorScheme}`);
        legend.innerHTML = this._tpl(this.options);

        return legend;
    }

    setMarkerPosition(e) {
        this.hideMarker();

        let rects = this._legend.getContainer().querySelectorAll('rect'),
        rect      = rects[e.idx];
        
        if (rect) {
            rect.classList.add('is-active');
        }
    }

    hideMarker() {
        let rect_active = this._legend.getContainer().querySelector('rect.is-active');
        
        if (rect_active) {
            rect_active.classList.remove('is-active');
        }
    }
}