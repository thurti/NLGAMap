import uniq from 'lodash/uniq';
import filter from 'lodash/filter';

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
}