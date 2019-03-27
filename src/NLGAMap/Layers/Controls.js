export class Controls {
    constructor(options, leaflet) {
        this.options = options;
        this.leaflet = leaflet;

        this._layerControlNames = {};
        this._disabledLayers = [];

        this.addEvents();
    }

    addLayer(layer) {
        if (!layer.options.layerControl) return;

        this._addLayerName(layer);

        this.layerControls = this.layerControls || L.control.layers(null, null, this.options).addTo(this.leaflet);
        this.layerControls.addOverlay(layer, layer.options.layerControl.name);
    }

    removeLayer(layer) {
        if (this.layerControls) {
            this.layerControls.removeLayer(layer);
        }
        
        layer = null;
    }

    layerIsEnabled(name) {
        return this._disabledLayers.indexOf(name) <= -1;
    }

    addEvents() {
        //save reference for later remove event
        this._onOverlayAddFunction    = this._onOverlayAdd.bind(this);
        this._onOverlayRemoveFunction = this._onOverlayRemove.bind(this);
        
        this.leaflet.on('overlayadd', this._onOverlayAddFunction);
        this.leaflet.on('overlayremove', this._onOverlayRemoveFunction);
    }

    removeEvents() {        
        this.leaflet.off('overlayadd', this._onOverlayAddFunction);
        this.leaflet.off('overlayremove', this._onOverlayRemoveFunction);

        this._onOverlayAddFunction =
        this._onOverlayRemoveFunction =
        null;
    }

    remove() {
        this.removeEvents();
        this.layerControls.remove();
        this.layerControls = null;
    }

    _onOverlayAdd(e) {
        this._removeFromDisabled(e.layer);
    }

    _onOverlayRemove(e) {
        this._addToDisabled(e.layer);
    }

    _addLayerName(layer) {
        let options = layer.options;

        if (typeof options.layerControl !== 'object') return;

        if (!this._layerControlNames[options.layerControl.name]) {
            //first time
            this._layerControlNames[options.layerControl.name] = options.layerName;
            
            //add to disabled if was set in options
            if (options.layerControl.activate === false) {
                this._addToDisabled(layer);
            }
        }
    }

    _addToDisabled(layer) {
        let name = layer.options.layerName;

        if (this._disabledLayers.indexOf(name) <= -1) {
            this._disabledLayers.push(name);
        }

    }

    _removeFromDisabled(layer) {
        let name = layer.options.layerName,
        idx      = this._disabledLayers.indexOf(name);

        if (idx > -1) {
            delete this._disabledLayers[idx];
        }
    }
}