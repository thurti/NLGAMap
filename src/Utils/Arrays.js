export class Arrays {
    /**
     * Transpose array.
     * @param  {array} array
     * @return {array}
     */
    static transpose(array) {
        return Object.keys(array[0]).map(
            function (c) { return array.map(function (r) { return r[c]; }); }
        );
    }

    static sort(array, direction = 'ASC') {
        if (direction === 'DESC') {
            array.sort((a,b) => {return b-a;});
        }

        if (direction === 'ASC') {
            array.sort((a,b) => {return a-b;});
        }

        return array;
    }
}