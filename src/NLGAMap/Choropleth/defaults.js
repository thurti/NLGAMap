import colors from 'colorbrewer';

colors.notFound = {color: 'rgb(100,100,100)', pattern: ''};

export const defaults = {
    propertyValue: 'value',
    colors: colors,
    colorScheme: 'PuBu',
    data: [],
    steps: 5,
    mode: 'jenks',
    title: '',
    layerName: 'choropleth',
    unit: '',
    popup: {
        closeButton: false,
        offset: L.point(0, -5),
        autoPan: false,
        textNotFound: 'no data'
    },
    timeline: false
};

export const modes = {
    equal: 'getClassEqInterval',
    quantile: 'getClassQuantile',
    jenks: 'getClassJenks',
    continuous: 'setClassManually',
    manual: 'setClassManually',
    text: 'text'
};