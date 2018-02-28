# NLGAMap

NLGAMap is a javascript project based on http://leafletjs.com/. It was designed to make the creation of choropleth maps easier.

<p align="center" style="font-size:larger">
**[Download NLGAMap %VERSION%](NLGAMap_latest.zip)**
</p>
![NLGAMap](./manual/asset/nlga_map.png)

### Features

- data classification based on [geostats](https://github.com/simogeo/geostats) library
- custom class limits
- text classes
- map colors based on [ColorBrewer2.org](http://colorbrewer2.org), by Cynthia A. Brewer, Penn State.
- custom color schemes and striped colors
- continuous color mode
- add marker based on geojson data
- timeline with playback controls
- custom popup html


**It makes use of the following libraries:**
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