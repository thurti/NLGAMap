export const defaults = {
    position: 'bottomright',
    additional: '',
    infoText: '',
    striped: false,
    ignoredLayers: false,
    noData: 'no data',
    markerNames: [],
    modeName: true,
    modeNameText: 'Classification',
    separator: ' &ndash; ',
    statistics: {
        min: false,
        max: false,
        mean: false,
        median: false,
        stddev: false
    },
    statistic_names: {
        min: 'Minimum',
        max: 'Maximum',
        mean: 'Mean',
        median: 'Median',
        stddev: 'SD'
    },
    mode_names: {
        equal: 'Equal',
        quantile: 'Quantile',
        jenks: 'Natural Breaks',
        continuous: 'Continuous',
        manual: 'Manual Interval',
        text: 'Text'
    }
};