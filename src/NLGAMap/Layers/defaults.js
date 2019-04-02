export const markerDefaults = {
    styles: {
        className: 'nlga_map-marker-icon',
        htmlSpanClass: '',
        addNameSpan: false,
        size: [7,7]
    },
    propertyName: 'name',
    popup: {
        closeButton: false,
        offset: L.point(0, -10),
        autoPan: false
    },
    layerControl: {
        activate: true
    }
};

export const regionDefaults = {
    popup: {
        closeButton: false, 
        offset: L.point(0, -5),
        autoPan: false
    },
    layerControl: false,
    colors: {
        ignore: {color: '#a6a6a6' , pattern: 'striped_thin'}        
    }
};

export const tileDefaults = {
    popup: false,
    legend: false,
    autoSetChoroplethOpacity: 0.7,
    layerControl: {
        name: 'map'
    }
}