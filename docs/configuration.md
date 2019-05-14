# Configuration Options

Basic Usage
```
var map = new NLGAMap({
    id: 'map-id',
    map: {},
    baseLayer: {...},
    cityLayer: {...},
    layers: {
        tiles: [{}, ...],
        choropleth: {},
        markers: [{}, ...],
        symbols: [{}, ...]
    }
});
map.render();
```

---

## `map`
The `map` configuration object mainly reflects the leaflet map creation object.  See http://leafletjs.com/reference-1.3.0.html#map-option for details.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| center | Array | | Map center. **required** |
| fitBounds | Boolean | false | Center the map to the bounds of the BaseLayer. (depending on minZoom, maxZoom, maxBounds options)  |
| zoom | Float |  | Initial map zoom. **required** |
| minZoom | Float |  | Minimum zoom level. |
| maxZoom | Float |  | Maximum zoom level. | 
| maxBounds | Array | | Restricts map view to bounds. |
| fullscreenControl | Boolean | true | Show fullscreen control. (See https://github.com/Leaflet/Leaflet.fullscreen) |
| **controls** | Object | | Controls configuration object. |
| **controls.zoom** | Object | | Leaflet zoom controls options. See http://leafletjs.com/reference-1.3.0.html#control-zoom|
| controls.zoom.position | String | `topright` | Controls position. | 
| controls.zoom.zoomInTitle | String | `Zoom in` | Zoom in text. |
| controls.zoom.zoomOutTitle | String | `Zoom out` | Zoom out text. |
| **controls.attribution** | Object | | Leaflet attribution options. See http://leafletjs.com/reference-1.3.0.html#control-attribution |
| controls.attribution.position | String | `bottomleft` | Controls position. |
| controls.attribution.text | String | `'NLGA ' + new Date().getFullYear()` | Attribution text. | 

## `defs`
The `defs` configuration object contains svg pattern definitions used for eg. striped background. The striped patterns are constructed from a rotated `<rect>`. The stripe thickness can be set through the rects strokeWidth and width. Included patterns are `striped` and `striped_thin`. They can be used through the `pattern: '[pattern_id]'` property in choropleth data object.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| patterns | Array | default pattern | Contains pattern definitions. (see below) |

### `defs pattern definition`

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| id | String | | Pattern id used for later reference. (eg. `url('#id')`) |
| width | String | | Rect width. |
| height | String | | Rect height. |
| strokeWidth | String | | Rect stroke width. |
| color | String | | Default color. |
| rotate | String | | Rect rotation in degree. |


## `baseLayer`
The `baseLayer` configuration object creates a basic shape map from a GeoJSOn/TopoJSON source.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| json | String or Object | | Path to GeoJSON/TopoJSON file or JSON object. **required** |
| ignoreLayerIds | Array | | Ignore features with this `id`. Sets color to ignore value, doesn't show popup. |
| propertyName | String | `'name'` | GeoJSON property to get the name from. |
| layerControl | Boolen or Object | `false` | Don't show layer controls. |
| colors.ignore | Object | `{color: '#a6a6a6' , pattern: 'striped_thin'}` | Pattern & color for ignored layers. |
| **popup** | Boolean or Object | | Popup configuration object. Set to `false` to hide popup. See also http://leafletjs.com/reference-1.3.0.html#popup |
| popup.closeButton | Boolean | `false` | Don't show close button. |
| popup.offset | Array | `[0, -5]` | Set popup offset. |
| popup.autoPan | Boolean | `false` | Set auto map panning. |
| **styles** | Object | | Basic inline css styling for shapes. |
| styles.weight | Integer | `1` | |
| styles.color | String | `'rgba(150, 150, 150, 1)'` | Stroke color. | 
| styles.opacity | Float | `0.5` | Stroke opacity. |
| styles.fillColor | String | `'#337AB7'` | Fill color. |   
| styles.fillOpacity | Float | `1` | Fill opacity. |
| **styles.hover** | Object | | Hover styles. |
| styles.hover.color | String | `'#ff7f00'` | Stroke color on hover. |
| styles.hover.weight | Integer | `2` | Stroke width on hover. |
| styles.hover.opacity | Float | `1` | Stroke opacity on hover. |
| styles.hover.fillOpacity | Float | `1` | Fill opacity on hover. |



## `cityLayer`
The `cityLayer`configuration object creates the cities layer from  geojson/topojson source.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| layerName | String | `cities` | Internal layer name. Should be unique. |
| json | String or Object | | Path to GeoJSON/TopoJSON file or JSON object. |
| propertyName | String | `'name'` | GeoJSON property to get the name from. |
| addNameSpan | Boolean | `true` | Show Name above marker in map. | 
| **layerControl** | Boolen or Object |  | If false, don't show layer controls. |
| layerControl.name | String | `'Städte'` | Display name in layer control panel. |
| layerControl.activate | Boolean | `true` | Initialy activate layer. |
| **popup** | Boolean or Object | `false` | Popup configuration object. Set to `false` to hide popup. See also http://leafletjs.com/reference-1.3.0.html#popup |
| **styles** | Object | | Basic inline css styling for shapes. | 
| styles.className | String | `nlga_map-citiy-icon` | Marker CSS class name. |
| styles.htmlSpanClass | String | `nlga_map-city-icon__text` | HTML span wrapper class around marker icon text. | 
| styles.size | Array | `[10,10,]` | Marker size in px. |



## `layers`
The `layers` configuration object contains the different layers added to the map.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| tiles | Array | | Array of tile layer objects. |
| choropleth | Object | | Adds choropleth layer to map. Only one choropleth layer is supported by now. Multiple choropleth layer support may be added in the future. |
| markers | Array | | Array of marker layer objects. |
| symbols | Array | | Array of symbol layer objects. |


All layers have configurations for `timeline`, `legend`, `popup` and `layerControl` which can be set in the configuration object for the given layer. 


### Basic options
The basic options are all the same for `choropleth`, `marker` and `symbol` layers.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| layerName | String | | Layer name, should be unique. |
| title | String | `''` | Title for the data. Is used in legend. |
| unit | String | `''` | String added after values. |
| data | Object | | Data object. See examples for data structure. |
| timeline | Object or false | | Timeline options or false if no time data. |
| popup | Object or false | | Popup options or false to hide popup. |
| legend | Object or false | | Legend options or false to hide legend. |
| layerControl | Object | | Layer control options. |


### `tiles`
Loads tile layers on the map from given options.  It is basicaly a wrapper for `L.tileLayer`. See https://leafletjs.com/reference-1.3.0.html#tilelayer for all options.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| url | String | | URL to Web Map Tiles Service (WMTS; eg. Open Street Map). |
| layerControl.name | String | `'map'` | |

### `choropleth`
The choropleth layer colors a specific map region by finding a color for a given value.

#### Data format
The data must be provided as an Object with the layer region id as key and a number (float or integer) as the value. The value could also be an object with a member `value` and additional members. **The value must be of type Number (except in text mode).**

The choropleth data keys must match the ids from `baseLayer` GeoJSON.

To make a region "striped", provide the value as object and set `pattern: 'striped'`. (example below) You can use any pattern which is defined in `defs.patterns`.

If the data contains multiple objects, the data is assumed to be a timeline where the object key is used as time reference.

```
var choropleth_data = {
    241: 10.4,  //GKZ id of Hannover with value of 10.4
    254: {  //define custom vars
        value: 11,
        myVar: 'test'
    },
    456: {  //make color striped
        value: 13,
        pattern: 'striped'
    }
    ...
};

var choropleth_text = {
    241: 'low',
    254: { //show additional data value in popup
        value: 'mid',
        data: '3.5%'
};

//timeline data
var choroleth_data_timeline = {
    "2012" : {
        "241": 10.4,  //value of 10.4 in year 2012 for id "241"
        ...
    },
    "2013": {
        "241": 7.5,  //value of 7.5 in year 2013 for id "241"
        ...
    },
    ...
}
```

#### Options
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| colorScheme | String | `'PuBu'` | Color scheme name. See [Colorbrewer](http://colorbrewer2.org) for possible color scheme names. |
| limitColors | Array | | Only in mode `text`. Set colors for limits. |
| steps | Integer | `5` | Number of classification steps. |
| mode | String | `'jenks'` | Classification mode. Possible values `['equal',  'quantile', 'jenks', 'continuous', 'manual', 'text']`. In modes `text` and `manual` the limits must be set manualy. |
| limits | Array | | Class limits. Can only be set in modes `text` and `manual`. |
| timeline | Object or Boolean | `false` | Timeline options or false if no time data. |
| layerCallback | function (layer, value) | null | Callback on every layer. Useful for setting custom colors, popup ect. for specific values. |
| **colors** | Object | | Color definitions. |
| colors.notFound | Object | `{color: 'rgb(100,100,100)', pattern: ''}` | This color is used, if no data is found for a region id. |
| **colors[colorScheme]** | Object | | Each color scheme is defined as an object. |
| colors[schemeName][step] | | | You can define different colors for specific combinations of colorScheme and number of steps. See examples... | 
| **legend** | Object or Boolean | | Legend options or false for no legend. See Legend options for details. |
| legend.ignoredLayers | Boolean | `false` | Show ignored layers text in legend. |
| legend.ignoredLayersText | String | `''` | Text for ignored layers in legend. |
| legend.modeName | Boolean | `true` | Display name of selected classification mode in legend. |
| legend.modeNameText | String | `'Classification'` | Text to show before mode name. |
| legend.striped | Boolean or String | `false` | **deprecated (use legend.patterns)** Show striped icon in legend with given text. |
| legend.patterns | Object[] | | Array of patterns to show in legend. eg. `[{id: 'striped', text: 'My striped categgory}, {id: 'striped_thin', text: 'my thin cat'}, ...]`|
| **popup** | Object | | Popup options. For more options see http://leafletjs.com/reference-1.3.0.html#popup |
| popup.closeButton | Boolean | `false` | |
| popup.offset | L.point | `L.point(0, -5)` | |
| popup.autoPan | Boolean | `false` | |


### `marker`
The marker layer adds a circle marker to a specific positions (lat/lon). You can customize the markers apperance through css. You can also provide a `customIcon()` callback function.

#### Data format
The data must be provided as **geojson** FeatureCollection. The value must be stored under `properties.[valuePropPath]`. The "name" and "value" property name can be set through the marker layer options.

The time data is stored inside the properties. The key of the time value  must match the `timeKey` property in the marker layer configuration object.

```
var marker_data = {
    type: "FeatureCollection",
    features: [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [lng, lat]
            },
            "properties": {
                "name": "MyName",
                "value": "3.4",
                "year": "2012"
            }
        },
        ...
    ]
};
```

#### Pie Chart Data Format
If a marker layer is added with `type: 'pie'`, the data must contain values for the pie slices and a total value. The size of the single pie chart slices is calculated from the single values. The total value is use for calculating the pie radius (like circle markers).

| Property | Type | Description |
|----------|------|-------------|
| value.total | Number | Used to calculate the pie chart radius and will be displayed as "total" in popup. |
| value.slices | Array | Array of slice objects. |
| **slice** | Object | Represents a pie chart slice. |
| slice.label | String | Name of the slice. |
| slice.value | Number | Value (size) of the slice. |
| slice.color | String | Color of the slize. Can be hex, rgb() or HTMl color. |
| slice.style | String | Custom SVG-styles (like stroke-width, opacity, ...) for slice. |

```
var marker_data = {
    type: "FeatureCollection",
    features: [
        {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [lng, lat]
            },
            "properties": {
                "name": "MyName",
                "value": {
                    "total": 24,
                    "slices": [
                        {"label": "A", "value": 24.4, "color": "red"},
                        ...
                    ]
                }
            }
        },
        ...
    ]
};
```


#### Options
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| type | String | `'circle'` | Type of marker. `['circle', 'pie']` |
| timeKey | String | `''` | Key that matches the time value key in the data object. |
| maxRadius | Number | `20` | Maximum circle radius. |
| scale | String | `'linear'` | Scaling type of the circle. Possible values `['log', 'linear']` |
| logFactor | Number | 1 | Multiply circle width with factor to scale. | 
| power_function_exponent | Number | `0.58` | |
| order | Number | `null` | Sets the order, if multiple marker layers are added. | 
| style | String | `'fill: rgba(224, 0, 60, 0.8)'` | Set css styles for the circle marker. The apperance of the marker can also be changed through css.|
| precision | Integer | | Number of decimals for calculated percent values. **(only used for `type: 'pie'`)** |
| valuePropPath | String | `'value'` | A string or object path where to find the real "value" in the geojson properties. (eg. `value.data`) |
| customIcon | function (value) | | Function that returns an leaflet Icon (eg. `L.icon()`) based on the given `value`. |
| timeline | Object or Boolean | `false` | Timeline options or false if no time data. |
| **legend** | Object or Boolean | | Legend options or false for no legend. |
| legend.ignoredLayers | Boolean | `false` | Show ignored layers text in legend. |
| legend.ignoredLayersText | String | `''` | Text for ignored layers in legend. |
| popup.total| String | `'Total: '` | Label for total value in popup.  **(only used for `type: 'pie'`)** | 



### `symbol`
The symbol layer adds markes to predefined position in the map. The positions must be provided through a GeoJSON/TopoJSON file. Like with choropleth maps, the data is bound through the id. 


#### Data format
The `value` represents the specific `legend.markerNames` array index. The `data` value is the actual data to display in popup. Other properties can be set to use in the popup template. See examples for usage instructions.

```
var symbol_data = {
    "241": 1,   // displayed as symbol legend.markerNames[1] at position with id "241"
    ...
};

// advanced examlpe
// popup shows value of 3.4
// property customProp can be used in popup template
var symbol_data = {
    "241": {
        "value": 1,
        "data": 3.4,
        "customProp": "hello"
    }
};

var symbols_data_time = {
    "2012": {
        "241": 1, // displayed as symbol 1 in year 2012 at position with id "241"
        ...
    },
    "2013": {
        "241": 3,
        ...
    }
};
```

#### Options
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| timeKey | String | `''` | Key that matches the time value key in the data object. |
| type | String | `'arrows'` | Symbol type. Possible values `['arrows', 'bars']` |
| **legend** | Object or Boolean | | Legend options or false for no legend. |
| legend.markerNames | Array | | Marker names to show in the legend. |



### `timeline`
Set to `false` to disable timeline for specific layer.

#### Options
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| fps | Integer | `1` | Playback framerate. |
| loop | Boolean | `true` | Loop playback. |
| timeDomainName | String | `''` | Name for the timedomain displayed in playback controls, eg. 'Year'. | 
| onTimeChange | Function | | Callback function called everytime the time changes. |


### `popup`
For all options see http://leafletjs.com/reference-1.3.0.html#popup .

Set to `false` to disable popup for specific layer.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| template | String | | Custom popup html template. Variables can be use in form of `${name}`. See examples for details. |



### `legend`
For all options see http://leafletjs.com/reference-1.3.0.html#control .

Set to `false` to disable legend for specific layer.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| position | String | 'bottomright' | Legend position. Possible values `['topleft', 'topright', 'bottomleft', 'bottomright']` |
| striped | String, Boolean | `false` | **deprecated (use legend.patterns**) Add stripe pattern legend entry. |
| patterns | Object[] | | Array of patterns to show in legend. eg. `[{id: 'striped', text: 'My striped categgory}, {id: 'striped_thin', text: 'my thin cat'}, ...]`|
| additional | String | `''` | Html to be added after last legend entry. |
| infoText | String | `''` | Information popup text after legend title. |
| template | String | | Custom popup html template. Variables can be use in form of `${name}`. See examples for details. |
| ignoredLayers | Boolean | `false` | Ignored layers text in legend. Set to `false` to hide in legend. |
| ignoredLayersText | String | `''`| Text to show for ignored layers. |
| noData | Boolean | `true` | Show "No Data" in legend. |
| noDataText | String | `'no data'` | Text to show for no data. |
| separator | String | ` &ndash; ` | Separator string between classes in legend. |
| modeName | Boolean | `true` | Show classification mode name in legend. **Only for choropleth layer.**|
| **mode_names** | Object | | Display name for specific mode. |
| mode_names.equal | String | `'Equal'` | Display name for mode equal. |
| mode_names.quantile | String | `'Quantile'` | Display name for mode quantile. |
| mode_names.jenks | String | `'Natural Breaks'` | Display name for mode jenks. |
| mode_names.continuous | String | `'Continuous'` | Display name for mode continuous. |
| mode_names.manual | String | `'Manual Interval'` | Display name for mode manual. |
| mode_names.text | String | `'Text'` | Display name for mode text. |
| **statistics** | Object | | Show different statistic values in legend. **Doesn't work with symbol maps.** |
| statistics.min | Boolean | `false` | Show minimum data value. |
| statistics.max | Boolean | `false` | Show maximum data value. |
| statistics.mean | Boolean | `false` | Show mean. |
| statistics.median | Boolean | `false` | Show median. |
| statistics.stddev | Boolean | `false` | Show standard deviation. |
| **statistic_names** | Object | | Name of statistic property. |
| statistic_names.min | String | `'Minimum'` | Name of prop *min* to show in legend. |
| statistic_names.max| String | `'Maximum'` | Name of prop *max* to show in legend. |
| statistic_names.mean | String | `'Mean'` | Name of prop *mean* to show in legend. |
| statistic_names.median | String | `'Median'` | Name of prop *median* to show in legend. |
| statistic_names.stddev | String | `'SD'` | Name of prop *stddev* to show in legend. |


### `layerControl`
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| name | String | | Name to show in layer controls. |
| activate | Boolean | true | Set to false to initialy hide layer. |