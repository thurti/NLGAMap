export const defaults = {
    map: {
        fullscreenControl: true,
        fitBounds: false,
        zoomSnap: 0.5,
        zoomControl: false, 
        zoomDelta: 0.5,
        wheelPxPerZoomLevel: 80,
        controls: {
            zoom: {
                position: 'topright'
            },
            attribution: {
                text: 'NLGA ' + new Date().getFullYear()
            }
        }
    },
    baseLayer: {
        layerName: 'baselayer',
        ignoreLayerIds: [],
        colors: {
            ignore: {color: '#a6a6a6' , pattern: 'striped_thin'}
        },
        propertyName: 'name',
        styles: {
            weight: 1,
            color: 'rgba(150,150,150,1)',
            opacity: 1,
            fillColor: '#337AB7',
            hover: {
                color: '#ff7f00',
                weight: 2,
                opacity: 1
            }
        }
    },
    cityLayer: {
        order: 0,
        layerName: 'cities',
        propertyName: 'name',
        addNameSpan: true,
        layerControl: {
            name: 'Cities',
            activate: false
        },
        styles: {
            className: 'nlga_map-city-icon',
            htmlSpanClass: 'nlga_map-city-icon__text',
            size: [10,10]
        },
        popup: false
    },
    layers: {
        layerControls: {
            collapsed: true
        }
    },
    defs: {
        patterns: [
            {
                id: "striped",
                width:"10",
                height:"10",
                color: '#a6a6a6',
                rotate: '45',
                strokeWidth: '4',
            },
            {
                id: "striped_thin",
                width:"4",
                height:"4",
                color: '#a6a6a6',
                rotate: '-45',
                strokeWidth: '1',
            }
        ]
    }
};