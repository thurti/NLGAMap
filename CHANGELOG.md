# Changelog

## 1.1.0 (2019-03-27)
- Remove: wolfy87-eventemitter dependency - replace by L.Evented
- Remove: Events class dependency replaced by L.DomEvent
- Add: marker type "pie": adds pie chart marker to the map
- Fix karma test runner
- Updated development dependencies (webpack, esdoc, babel, karma)
- Updated dependencies 
- Add: layers.tiles option to add L.TileLayer like Open Street Map
- Deprecated: option legend.striped (replaced by legend.patterns)
- Add: legend.patterns: option to add pattern backgrounds from `defs` to legend with custom text
- Add: legend.noDataText to set legend text (instead of noData) 
- Add: legend.ignoredLayersText to set legend text (instead of ignoredLayers)
- Add: legend option to set the separator string between classes
- Add: localize numbers in legend and popups with Number.toLocaleString()
- Fix: continuous legend wrong upper limit when using float data
- Fix: out of range error when using open limits

## 1.0.1 (2018-03-07)
- Fix: number precision in limits calculation
- Fix: wrong position of continuous legend marker caused by rounding
- Fix: rounding of legend statistic values
- Fix: examples: path to polyfills js file; added position json file to symbol bars examples
- some improvements to build process

## 1.0.0 (2018-02-28)
- initial public release