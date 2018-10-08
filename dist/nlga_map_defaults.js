/**
 * These are global defaults we use internaly. 
 * These are not required, but feel free to use this file in your own projects.
 */
window.nlga_map_global_defaults = {
    map: {
        fullscreenControl: true,
        center: [52.58496592431173, 9.10100025486628], 
        zoom: 7.5,
        minZoom:7, 
        maxZoom:10,
        scrollWheelZoom: false,
        maxBounds: [
            [50,6.3],
            [54.3,12.8]
        ],
        controls: {
            zoom: {
                zoomInTitle: 'vergrößern',
                zoomOutTitle: 'verkleinern'
            },
            attribution: {
                text: 'NLGA ' + new Date().getFullYear() + ' | © GeoBasis-DE / <a href="http://www.bkg.bund.de/">BKG</a> 2017 (Daten verändert)'
            }
        }
    },
    baseLayer: {
        ignoreLayerIds: ['04'],
        styles: {
            color: 'rgba(255, 255, 255, 1)'
        }
    },
    cityLayer: {
        order: 0,
        layerControl: {
            name: 'Städte'
        }
    },
    layers: {
        tiles: [{
            layerName: 'bkg',
            url: 'https://sgx.geodatenzentrum.de/wmts_topplus_web_open/tile/1.0.0/{id}/{Style}/{TileMatrixSet}/{z}/{y}/{x}.png',
            id: 'web_grau',
            Style: 'default',
            TileMatrixSet: 'WEBMERCATOR',
            attribution: '<a href="http://sg.geodatenzentrum.de/web_public/Datenquellen_TopPlus_Open.pdf">Datenquellen</a>',
            layerControl: {
                activate: false,
                name: 'Landkarte'
            }
        }],
        choropleth: {
            popup: {
                textNotFound: 'keine Daten'
            },
            colorScheme: 'blue',
            colors: {
                blue: {
                    4: ["rgb(189,201,225)","rgb(116,169,207)","rgb(5,112,176)","rgb(2,56,88)"],
                    5: ["rgb(189,201,225)","rgb(116,169,207)","rgb(43,140,190)","rgb(4,90,141)","rgb(2,56,88)"],
                    6: ["rgb(208,209,230)","rgb(166,189,219)","rgb(116,169,207)","rgb(43,140,190)","rgb(4,90,141)","rgb(2,56,88)"],
                    7: ["rgb(208,209,230)","rgb(166,189,219)","rgb(116,169,207)","rgb(54,144,192)","rgb(5,112,176)","rgb(3,78,123)","rgb(2,56,88)"],
                    8: ["rgb(236,231,242)","rgb(208,209,230)","rgb(166,189,219)","rgb(116,169,207)","rgb(54,144,192)","rgb(5,112,176)","rgb(3,78,123)","rgb(2,56,88)"]
                },
                red: {
                    4: ["rgb(255,255,178)","rgb(254,204,92)","rgb(253,141,60)","rgb(227,26,28)"],
                    5: ["rgb(255,255,178)","rgb(254,204,92)","rgb(253,141,60)","rgb(240,59,32)","rgb(189,0,38)"],
                    6: ["rgb(255,255,178)","rgb(254,217,118)","rgb(254,178,76)","rgb(253,141,60)","rgb(240,59,32)","rgb(189,0,38)"],
                    7: ["rgb(255,255,178)","rgb(254,217,118)","rgb(254,178,76)","rgb(253,141,60)","rgb(252,78,52)","rgb(227,26,28)","rgb(189,0,38)"],
                    8: ["rgb(255,255,204)","rgb(255,237,160)","rgb(254,217,118)","rgb(254,178,76)","rgb(253,141,60)","rgb(252,78,52)","rgb(227,26,28)","rgb(189,0,38)"]
                },
                diverging: {
                    3: ["rgb(202,0,32)","rgb(212,212,212)","rgb(5,113,176)"],
                    4: ["rgb(202,0,32)","rgb(244,165,130)","rgb(146,197,222)","rgb(5,113,176)"],
                    5: ["rgb(202,0,32)","rgb(244,165,130)","rgb(212,212,212)","rgb(146,197,222)","rgb(5,113,176)"],
                    6: ["rgb(178,24,43)","rgb(239,138,98)","rgb(253,219,199)","rgb(209,229,240)","rgb(103,169,207)","rgb(33,102,172)"],
                    7: ["rgb(178,24,43)","rgb(239,138,98)","rgb(253,219,199)","rgb(212,212,212)","rgb(209,229,240)","rgb(103,169,207)","rgb(33,102,172)"]
                }
            }
        }
    }
};

window.nlga_map_legend_defaults = {
    ignoredLayers: 'Bremen/<br>Bremerhaven',
    noData: 'keine Daten',
    modeNameText: 'Klassifizierung',
    separator: ' bis ',
    statistic_names: {
        min: 'Minimum',
        max: 'Maximum',
        mean: 'Mittelwert',
        median: 'Median',
        stddev: 'Std.-Abw.'
    },
    mode_names: {
        equal: 'Gleiches Intervall',
        quantile: 'Quantil',
        jenks: 'Natürliche Unterbrechungen',
        continuous: 'kontinuierlich',
        manual: 'manuelles Intervall',
        text: 'Text'
    }
};