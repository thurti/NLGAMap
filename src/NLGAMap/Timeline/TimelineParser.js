import uniq from 'lodash/uniq';
import filter from 'lodash/filter';
import map from 'lodash/map';

export class TimelineParser {

    static getTimesFromGeoJSON(geojson, timeKey) {
        let times = geojson.features.map((feature) => {
            return feature.properties[timeKey];
        });

        return uniq(times);
    }

    static parseGeoJSON(geojson, times, timeKey) {
        let data = {};

        times.forEach((time) => {
            let timeFeatures = filter(geojson.features, (feature) => {
                return feature.properties[timeKey] === time;
            });

            data[time] = timeFeatures;
        });

        return data;
    }

    static getTimesFromJSON(json, timeKey) {
        let times = map(json, data => data[timeKey]);
                         
        return uniq(times);
    }

    static parseJSON(json, times, timeKey) {
        let data = {};

        times.forEach((time) => {
            data[time] = filter(json, data => data[timeKey] === time);
        });

        return data;
    }
}