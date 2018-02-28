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
}