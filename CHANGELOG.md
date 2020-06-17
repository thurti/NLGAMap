# Changelog

- Add: Choropleth option `propertyTimeKey` to set the property which is used to map the data to a time. Data must be already ordered!
  - Example: `data = [{id: 123, value: 100, year:'2020'}, {id: 101, value: 1023, year:'2021'}]` with `propertyTimeKey: 'year'`, `propertyId: 'id'` and `propertyValue: 'value'`
- Add: Choropleth option `propertyId` to set the property which is used to map the data to the baselayer ids. 
  - Example: `data = [{id: 123, value: 100}, {id: 101, value: 1023}]` with `propertyId: 'id'` and `propertyValue: 'value'`
- Add: Choropleth option `valueIfNoData` to add a value if no data is provided for baselayer area
- Add: Choropleth option `propertyValue` to set the property which is used as map data
- Add: Choropleth use additional data in popup template

## 1.1.3 (2019-07-02)
- Updated dependencies
- Fix: Leaflet error (since v1.5) when calling NLGAMap.remove()
- Updated leaflet to v1.5

## 1.1.2 (2019-05-14)
- Fix: Choropleth wrong color if value is '0' and set through object {value:0}

## 1.1.1 (2019-05-13)
- Fix: Choropleth wrong color if value is '0'

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