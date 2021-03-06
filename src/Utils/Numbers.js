/**
 * Number related helper functions.
 */
export class Numbers {

    /**
     * Returns highest count of decimals from array of numbers.
     * @param {array} numbers 
     */
    static getPrecision(numbers) {
        let precision = 0;
        
        numbers.forEach(number => {
            const decimals = number.toString().split('.');

            if (decimals.length === 2 && decimals[1].length > precision) {
                precision = decimals[1].length;
            }
        });

        return precision;
    }

    /**
     * Rounds number to given precision.
     * https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Math/round
     * @param {Number} number 
     * @param {Number} precision    Round to [precision] decimals. Should be positive integer value.
     */
    static round(number, precision) {
        var factor = Math.pow(10, precision);
        return Math.round(number * factor) / factor;
    }
}