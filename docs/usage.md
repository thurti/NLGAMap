# Getting Started

## Prerequisite
- [Leaflet](http://leafletjs.com/)
- base map in GeoJSON or TopoJSON format like [this](https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json) for example

## Bundled package
Download the bundled package files

**[NLGAMap %VERSION%](NLGAMap_latest.zip)**

Include stylesheets

    <link rel="stylesheet" type="text/css" href="path/to/leaflet/leaflet.css">

Include scripts

    <!-- Polyfills are optional for better browser support. You can use your own, if you like -->
    <script src="path/to/NLGAMap/nlga.polyfills.min.js"></script>

    <script src="path/to/leaflet/leaflet.js"></script>
    <script src="path/to/NLGAMap/NLGAMap.min.js"></script>

Create a map container `div` with width and height set through css or html attribute.

    <div id="myMap" width="600" height="500"></div>

Create new NLGAMap object and call the `render()` function.
```
var map = new NLGAMap({
    id: 'myMap',
    map: {
        center: [lon, lat],
        zoom: 10
    },
    baseLayer: {
        json: 'path/to/my/geo.json'
    },
    layers: {
        choropleth: {
            layerName: 'myLayer',
            title: 'My Data',
            data: {
                geoId: value,
                ...
            }
        }
    }
});

map.render();
```

## Needed Polyfills
- fetch
- Promise
- Object.assign
- classList support (including svg support)

## Load as ES6 module
Since NLGAMap is written in ES6 it should be possible to import it as a module in your own ES6 projects (I've never tried it though). Make sure you have installed all the production dependencies from the `package.json`.

```
import {NLGAMap} from 'NLGAMap/src/NLGAMap/NLGAMap';

var map = new NLGAMap({...});
map.render();
```