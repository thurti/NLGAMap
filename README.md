# NLGAMap

NLGAMap is a javascript project based on http://leafletjs.com/. It was designed to make the creation of choropleth maps easier.

**Please note that we cannot offer extensive support. Please check the examples in the [documentation](https://www.apps.nlga.niedersachsen.de/tools/NLGAMap).**

## Getting Started
Please see https://www.apps.nlga.niedersachsen.de/tools/NLGAMap for usage instructions and examples.

### Prerequisite
- [Leaflet](http://leafletjs.com/)
- base map in GeoJSON or TopoJSON format like [this](https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json) for example

### Usage
Download the bundled package files

**[NLGAMap Bundled](NLGAMap_latest.zip)**

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

### Needed Polyfills
- fetch
- Promise
- Object.assign
- classList support (including svg support)

### Load as ES6 module
Since NLGAMap is written in ES6 it should be possible to import it as a module in your own ES6 projects (I've never tried it though). Clone the repository and make sure you have installed all the production dependencies from the `package.json`.

```
import {NLGAMap} from 'NLGAMap/src/NLGAMap/NLGAMap';

var map = new NLGAMap({...});
map.render();
```

## Development
```
//clone repository
git clone https://github.com/nlga/NLGAMap.git

//install dependencies
npm install

//start webpack development server http://localhost:8080/dev/
npm start
```

## Built With
- [lodash](http://lodash.com)
- [geostats](https://github.com/simogeo/geostats)
- [TopoJSON Client](https://github.com/topojson/topojson-client)
- [colorbrewer](https://github.com/saikocat/colorbrewer)
- [RainbowVis-JS](https://github.com/anomal/RainbowVis-JS)
- [EventEmitter](https://github.com/Olical/EventEmitter)
- [Leaflet.fullscreen](https://github.com/Leaflet/Leaflet.fullscreen)
- [Font Awesome by Dave Gandy](http://fontawesome.io)
- [innersvg-polyfill](https://github.com/dnozay/innersvg-polyfill)
- [promise-polfyfill](https://github.com/taylorhakes/promise-polyfill)
- [whatwg-fetch](https://github.com/github/fetch)

Docs are build with [ESDoc](https://esdoc.org/).
Packaging is done with [Webpack](https://webpack.js.org/) and [Babel](https://babeljs.io/).

## Contribute
You are very welcome to contribute to NLGAMap. Please see the our [contribution guidelines](CONTRIBUTING.md).

## Versioning
We use [SemVer](http://semver.org/) for versioning.

## License
This project is licensed under the BSD 3-Clause License - see the [LICENSE.md](LICENSE.md) file for details.

## Known Bugs & ToDos
+ get Karma to work with webpack and add some tests
+ fullscreen is not working when the map is loaded in an iframe
+ classes legend: marker is not working working for custom colors
+ patterns are not printed in chrome
+ printing is not consistent accross different browsers
+ **Refactor**
    - prefix timeline css with "nlga_map-..."
    - prefix symbols css with "nlga_map-..."
    - replace Events class
    - (store ListenerRefs in class Events) or replace Events class
    - (rangechange removeListener) or replace Events class

+ **Features**
    - SVG, PNG export
    - WFM Layer integration
    - multiple choropleth layers
    - replace "striped" option in Legend with more flexible {patterns: [{pattern: 'striped', color: '...', text: 'my category'}, {...}]}