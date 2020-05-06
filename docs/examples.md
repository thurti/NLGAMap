# Examples

These are several basic and more advanced usage examples for NLGAMap. You can press the "Edit in JSFiddle" Button to play around with the examples.

---

## Choropleth

### Basic Choropleth
[Basic Choropleth Example](https://jsfiddle.net/nlga/bgresay7/)
<div class="fiddleEmbed">//jsfiddle.net/nlga/bgresay7/embed/result,js,html,css/</div>

### Custom Colors
You can define custom colors in the `choropleth.colors` configuration object. You can define different colors for each combination of `colorScheme` and number of `steps`.

```
...
choropleth: {
    colors: {
        'green': {
            4: ['#11ff11', '#22ff22', '#33ff33', '#44ff44'],
            5: [...],
            ...
        }
    },
    colorScheme: 'green' //set colorScheme to custom scheme
},
...
```

[Choropleth Custom Colors Example](https://jsfiddle.net/nlga/womm2soj/)
<div class="fiddleEmbed">//jsfiddle.net/nlga/womm2soj/embed/result,js,html,css/</div>


### Custom Limits
To use custom limits, set the mode to `'manual'` and define a custom limits array.
```
...
mode: 'manual',
limits: [0, 10, 20],
...
```

[Custom Limits Example](https://jsfiddle.net/nlga/4c36xhff/)
<div class="fiddleEmbed">//jsfiddle.net/nlga/4c36xhff/embed/result,js,html,css/</div>


### Open lower and upper limits
To create **open** lower and/or upper class limits, add an empty string at the beginning and/or the end of the `limits` array. This only works with  `mode: manual` set.
```
 ...
 mode: 'manual',
 limits: ['', 5, 10, 20, ''],
 ...
```

### Text Limits
To use text limits, set the mode to `'text'` and define a custom `limits` array  and the corresponding colors in `limitColors`.  
```
...
mode: 'text',
limits: ['low', 'mid', 'high'],
limitColors: ['red', '#ffff00', 'rgb(0,0,255)'],
...
```

[Text Limits Example](https://jsfiddle.net/nlga/qwadyedo/)
<div class="fiddleEmbed">//jsfiddle.net/nlga/qwadyedo/embed/result,js,html,css/</div>


### Striped Layer Background
To make a striped layer, provide the layer data as an obejct and set the key `striped: true`. 

To add a "striped" entry to the legend, use the `legend.stripe` option. 

**Important:** Striped backgrounds are **not supported** in `mode: 'continiuous'`or with option `steps`set to lower than `4` or greater than `8`. 

To use striped background in `mode: 'text'` you need to specify the used colors in the `defs.patternColors` array.

``` 
var test_data = {
    ...,
    "241": {
        value: 1,
        striped: true
    },
    ...
};

// in the legend options
legend: {
    striped: 'my striped category'
}
```

[Striped Background Example](https://jsfiddle.net/nlga/o7acuvmm/)
<div class="fiddleEmbed">//jsfiddle.net/nlga/o7acuvmm/embed/result,js,html,css/</div>

[Striped Background Text Mode Example](https://jsfiddle.net/nlga/muh33pwa/)
<div class="fiddleEmbed">//jsfiddle.net/nlga/muh33pwa/embed/result,js,html,css/</div>


### Custom Layer Callback
You can set a custom callback function for the layer creation through the `layerCallback` property in the `choropleth` configuration object. The function is called for each region in the choropleth map. 

The callback function has the parameters `layer`, which is the corresponding leaflet layer and `value` which is the actual layer value. You can also get the properties from the data input through `this.data[layerId]`.

This is useful for setting custom colors for specific regions or to set colors depending on a certain value.
```
layerCallback: function (layer, value) {
    var layerId = layer.feature.properties.id;
    
    //set layer color for specific region id
    if (layerId === '154') { //Helmstedt
        this.setLayerColor(layer, 'red');
        this.setLayerPopup(layer, 'neuer Wert');
    }
    
    //set layer color if value is lower equal 10
    if (value <= 10) {
        this.setLayerColor(layer, 'gold');
        this.setLayerPopup(layer, 'eigene Kategorie');
    }
}
```

[Custom Layer Callback Example](https://jsfiddle.net/nlga/5oLwpkwq/)
<div class="fiddleEmbed">//jsfiddle.net/nlga/5oLwpkwq/embed/result,js,html,css/</div>


## Marker

### Basic Circle Marker

[Basic Marker Example](https://jsfiddle.net/nlga/pfnmw0oo/)
<div class="fiddleEmbed">//jsfiddle.net/nlga/pfnmw0oo/embed/result,js,html,css/</div>

### Pie Chart Marker
[Pie Chart Marker Example](https://jsfiddle.net/nlga/be0dyov7/)
<div class="fiddleEmbed">//jsfiddle.net/nlga/be0dyov7/embed/result,js,html,css/</div>

### Custom Icon Callback
You can use CSS to change the markers or symbols appearance. The standard marker has the CSS class `.nlga_map-point-marker nlga_map-marker-icon`.

For more custom styling you can set a custom marker icon callback function which is used for creating the markers. The function must return a leaflet icon object. See http://leafletjs.com/reference-1.0.2.html#icon for details.

```
...
<style>
.myMarkerIcon{
    background: gold;
    border: 1px solid white;
    text-align: center;
}
</style>
...
customIcon: function (value) {
    //calculate height for value
    var markerWidth = 20,
    markerHeight    = value * 10;

    //for more icon options see http://leafletjs.com/reference-1.0.2.html#icon
    return L.divIcon({
            className: 'myMarkerIcon',
            iconSize: [markerWidth, markerHeight],
            html: '<span>'+value+'</span>'
        });
}
```


[Marker Custom Icon Callback Example](https://jsfiddle.net/nlga/dv4vk2np/)
<div class="fiddleEmbed">//jsfiddle.net/nlga/dv4vk2np/embed/result,js,html,css/</div>


## Symbols

### Arrows

[Symbols Arrows Example](https://jsfiddle.net/nlga/ugtnkprt/)
<div class="fiddleEmbed">//jsfiddle.net/nlga/ugtnkprt/embed/result,js,html,css/</div>


### Bars

[Symbols Bars Example](https://jsfiddle.net/nlga/nmvbb0qr/)
<div class="fiddleEmbed">//jsfiddle.net/nlga/nmvbb0qr/embed/result,js,html,css/</div>


## Tiles
You can add a tile layer from a Web Map Tile Service like Open Street Map.

[Open Street Map Example](https://jsfiddle.net/nlga/cqo2b49v/)
<div class="fiddleEmbed">//jsfiddle.net/nlga/cqo2b49v/embed/result,js,html,css/</div>


## Timeline
The `timeline` configuration object must only be set in one layer. All other layers must set `timeline: true` only (if they are time data).

**Marker layers** must define a `timeKey` which matches a property in the geojson object.

[Timeline Example](https://jsfiddle.net/nlga/956zjrm5/)
<div class="fiddleEmbed">//jsfiddle.net/nlga/956zjrm5/embed/result,js,html,css/</div>


### Timeline control functions
There is also a timeline object with some public methods to control the timeline playback.
```
var map = new NLGAMap({...});
map.render();

var timeline = map.layers.timeline;

timeline.start();
timeline.stop();
timeline.prev();
timeline.next();
timeline.toggleLoop();
timeline.currentTime;
timeline.setTime("2014");
timeline.addCallbacks([myFunction1, myFunction2, ...]);
```

## Custom Popup and Legend HTML Templates
The custom templates are defined by a template string. Javascript in the template must be wrapped in special delimiter `<% %>`. Varibables can be used through `${myVariable}` or `<% print(myVariable) %>`.

```
//print variable
value: '42',
template: 'Value: <b>${value}</b>'

//HTML output
Value: <b>42</b>


//javascript in template
myProp: [10,20,30],
template: '<% myProp.forEach( function (prop) { %>${prop} <% )} %>'

//HTML output
10 20 30
```

### Custom Popup HTML
You can customize the HTML output in the popup through the `template` property in the `popup` configuration object. In the template you can use the variables `name` and `value`.
```
...
popup: {
    template: '<b>${name}</b>: ${value}'
}
...
```

You can also add custom variables through the `data` object and through the `popup` configuration object.
```
var data = {
    "241": {
        data: 10,
        value: 1,
        myData: 'my data'
    }
}
...
popup: {
    myProperty: 'my value',
    template: '<b>${name}</b>: ${value} <br> ${myData} <br> ${myProperty}'
}
...
```

[Custom Popup Example](https://jsfiddle.net/nlga/cL1tbkhw/)
<div class="fiddleEmbed">//jsfiddle.net/nlga/cL1tbkhw/embed/result,js,html,css/</div>

### Custom Legend HTML
You can customize the HTML output in the legend through the `template` property in the `legend` configuration object. If you only want to add an entry to the standard legend, you can also use the `additional` property in the `legend` configuration object.

In **Choropleth layers** you have access to the limits and colors used in the layer through `limits` and `colors` array variables. You can also use the `_chromaFunction(limit)` to calculate a color (use in continuous mode).
```
legend: {
    template: '${title} limits: ${limits}<br> Colors: ${colors}<br>Color from Chroma Function: ${_chromaFunction(limits[0])}'
}
```


In **marker and symbol layers** you have acces to all properties in the legend configuration object.
```
legend: {
    myProperty: 'hello',
    infoText: 'info',
    template: '${title} ${infoText} ${markerNames} ${myProperty}',
    markerNames: ['1', '2', '3']
}
```

[Custom Legend Example](https://jsfiddle.net/nlga/6LstL8ur/)
<div class="fiddleEmbed">//jsfiddle.net/nlga/6LstL8ur/embed/result,js,html,css/</div>