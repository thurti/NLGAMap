import forEach from 'lodash/forEach';
import hash from 'hash-string';

/**
 * Create and remove event listeners for the DOM.
 * 
 * @example
 * import {Events} from 'lib/core/core/Utils/Events';
 *
 * var referenceStore = {},
 * node = document.querySelector('.myClass');
 * Events.addListener({
 *     el: node,
 *     type: 'click',
 *     capture: false,
 *     callback: function () {}
 * }, referenceStore);
 *
 * Events.removeLister(...);
 * Events.removeAllListeners(referenceStore);
 */
export class Events {

    /**
     * Adds event listener to DOM element & and stores references in listenerReferences 
     * and returns that for later use in removeEventLister() function.
     * @param {Object} listener Event parameter.
     * @param {HTMLElement}   listener.el       DOM element.
     * @param {String}   listener.type     Event type.
     * @param {Boolean}  listener.capture  Option useCapture.
     * @param {Function} listener.callback Callback function.
     * @param {Array} listenerReferences
     */
    static addListener(listener, listenerReferences) {
        var listenerHash = Events._getHash(listener);

        listener.el.addEventListener(listener.type, listener.callback, listener.capture);
        listenerReferences[listenerHash] = [listener.el, listener.type, listener.callback, listener.capture];
    }

    /**
     * Removes event listener from DOM element & deletes listener reference.
     * @param {Object} listener Event parameter.
     * @param {HTMLElement}   listener.el       DOM element.
     * @param {String}   listener.type     Event type.
     * @param {Boolean}  listener.capture  Option useCapture.
     * @param {Function} callback Callback function.
     */
    static removeListener(listener, listenerReferences) {
        var listenerHash = Events._getHash(listener),
        reference        = listenerReferences[listenerHash];

        reference[0].removeEventListener(reference[1], reference[2], reference[3]);
        delete listenerReferences[listenerHash];
    }

    /**
     * Removes all event listeners stored in listenerReferences.
     * @param {Object} listenerReferences Object with all listener references stored by hash.
     */
    static removeAllListeners(listenerReferences) {
        forEach(listenerReferences, function (listener) {
            listener[0].removeEventListener(listener[1], listener[2], listener[3]);
        });
        listenerReferences = {};
    }

    /**
     * Creates hash from nodeName, className, id, type and callback function.
     * @param {Object} listener Event parameter.
     * @param {HTMLElement}   listener.el       DOM element.
     * @param {String}   listener.type     Event type.
     * @param {Boolean}  listener.capture  Option useCapture.
     * @return {string} Generated Hash string.
     */
    static _getHash(listener) {
        return hash(listener.el.nodeName + 
                    listener.el.className + 
                    listener.el.id + 
                    listener.type + 
                    listener.callback.toString()
                );
    }

    /**
     * Handles input/change event from input[type=range].
     * Fixes problem with IE not triggering input event.
     * @see {@link http://stackoverflow.com/a/37623959}
     * @param  {HTMLElement} rangeInputElmt Range element.
     * @param  {function} listener       Callback.
     */
    static onRangeChange(rangeInputElmt, listener) {

        var inputEvtHasNeverFired = true;

        var rangeValue = {current: undefined, mostRecent: undefined};

        rangeInputElmt.addEventListener("input", function(evt) {
                inputEvtHasNeverFired = false;
                rangeValue.current = evt.target.value;

                if (rangeValue.current !== rangeValue.mostRecent) {
                    listener(evt);
                }

                rangeValue.mostRecent = rangeValue.current;
            });

        rangeInputElmt.addEventListener("change", function(evt) {
                if (inputEvtHasNeverFired) {
                    listener(evt);
                }
            }); 
    }
}