/**
 * String related helper functions.
 */
export class Strings {
    /**
     * Convertes UTF8 string to Base64.
     * @param  {string} str
     * @return {string} 
     */
    static utf8ToB64(str) {
        return window.btoa(unescape(encodeURIComponent(str)));
    }

    /**
     * Convertes Base64 string to UTF8.
     * @param  {string} str
     * @return {string} 
     */
    static b64ToUtf8(str) {
        return decodeURIComponent(escape(window.atob(str)));
    }

    /**
     * Check if string is a number.
     * @param  {string}  value 
     * @return {Boolean}
     */
    static isNumber(value) {
        return /^[-\d,\.]+$/.test(value);
    }

    /**
     * Check if string is parsable date.
     * @param  {string}  value Date string.
     * @return {Boolean}       
     */
    static isDate(value) {
        return !isNaN(Date.parse(value));
    }

    /**
     * Removes tabs and newlines from the end of a string
     * @param  {string} string 
     * @return {string}        
     */
    static trimNewlineTab(string) {
        return string.replace(/[\n\t]*$/g, '');
    }
}