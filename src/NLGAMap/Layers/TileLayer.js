import defaultsDeep from 'lodash/defaultsDeep';

import {tileDefaults} from './defaults.js';

export class TileLayer {

    constructor(options) {
        this.options = defaultsDeep(options, tileDefaults);
    }
    
    create() {
        let layer = L.tileLayer(this.options.url, this.options);
        return layer;
    }

    destroy() {
        this.options = null;
    }
}