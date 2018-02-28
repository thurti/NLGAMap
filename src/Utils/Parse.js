export class Parse {

    static int(value) {
        if (typeof value === 'number') return parseInt(value);
        if (typeof value !== 'string') return;

        let parsed = parseInt(value);
        return (!isNaN(parsed)) ? parsed : null;
    }

    static float(value) {
        if (typeof value === 'number') return value;
        if (typeof value !== 'string') return;

        let parsed = parseFloat(value.replace(',', '.'));
        return (!isNaN(parsed)) ? parsed : null;
    }

    static boolean(value) {
        switch(value) {
            case 'true':
                return true;
            case 'false':
                return false;
            default:
                return undefined;
        }
    }

    static truncateFloat(floatInput, decimals) {
        let regex = new RegExp("^(\\d*)(\\.+)(\\d{0," + decimals + "}).*$");
        return Number(floatInput.toString().replace(regex, '$1$2$3'));
    }
}