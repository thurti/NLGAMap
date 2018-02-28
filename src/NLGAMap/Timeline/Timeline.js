import defaultsDeep from 'lodash/defaultsDeep';
import clone from 'lodash/clone';
import each from 'lodash/each';
import EventEmitter from 'wolfy87-eventemitter/EventEmitter';
import {Timer} from '../../Utils/Timer';
import {defaults} from './defaults';
import {TimelineControl} from './TimelineControl';

export class Timeline {

    constructor(options) {
        options = defaultsDeep(options, defaults);
        
        this.fps             = options.fps;
        this.loop            = options.loop;
        this.times           = options.times;
        this.timeDomainName  = options.timeDomainName;
        this.isPlaying       = false;
        this.initialTime     = options.currentTime || options.times[options.times.length - 1];
        this.currentTime     = this.initialTime;
        this.controlsOptions = options.controls;

        this._callbacks = {};

        this.addCallbacks(options.onTimeChange);
    }

    get currentTime() {
        return this._currentTime;
    }

    set currentTime(time) {
        this._currentTime = time;
        this._currentIdx  = this.times.indexOf(this.currentTime);
    }

    start() {
        this.isPlaying = true;
        this._startLoop();
        this.controls.setPlayButtonState('play');
    }

    stop() {
        this.isPlaying = false;
        this.controls.setPlayButtonState('pause');
    }

    prev() {
        let prev = this._getPrevIdx(this._currentIdx);        
        this._setTimeByIdx(prev);
    }

    next() {
        let next = this._getNextIdx(this._currentIdx);        
        this._setTimeByIdx(next);
    }

    setTime(time) {
        this.currentTime = time;
        this.controls.setTime(time);
        this._callOnTimeChangeCallbacks(time);
    }

    toggleLoop() {
        this._toggleLoopState();
        this.controls.toggleLoop();
    }

    addCallbacks(callbacks) {
        if (Array.isArray(callbacks)) {
            callbacks.forEach((callback, idx) => {
                this._addOnTimeChangeCallback(callback);
            });
        } else {
            this._addOnTimeChangeCallback(callbacks);
        }
    }

    removeOnTimeChangeCallback(name){        
        this._callbacks[name] = null;
        delete this._callbacks[name];
        callback = null;
    }

    addTo(map) {
        this._listeners = {
            'start': this.start.bind(this),
            'stop' : this.stop.bind(this),
            'prev' : [this.stop.bind(this), this.prev.bind(this)],
            'next' : [this.stop.bind(this), this.next.bind(this)],
            'loop' : this._toggleLoopState.bind(this),
            'seek' : this._setTimeFromSeek.bind(this)
        };

        this.controls = L.control.timeline({
            ...this.controlsOptions,
            times: this.times, 
            currentTime: this.currentTime,
            timeDomainName: this.timeDomainName
        });

        this.controls.addListeners(this._listeners);
        this.controls.addTo(map);

        if (this.loop !== defaults.loop) this.controls.toggleLoop();
    }

    remove() {
        this.controls.removeListeners(this._listeners);
        this.controls.remove();

        this.controls   = null;
        this._listeners = null;
        this._callbacks = null;
    }

    _callOnTimeChangeCallbacks(time) {
        each(this._callbacks, (callback) => {
            callback(time);
        });
    }

    _setTimeByIdx(idx) {
        this.setTime(this.times[idx]);
    }

    _getPrevIdx(currentIdx) {
        let newIdx = currentIdx - 1;
        return (newIdx >= 0) ? newIdx : this.times.length - 1;
    }

    _getNextIdx(currentIdx) {
        let newIdx = currentIdx + 1;
        return (newIdx < this.times.length) ? newIdx : 0;
    }

    _toggleLoopState() {
        this.loop = !this.loop;
    }

    _startLoop() {
        let next = this._currentIdx;

        Timer.loop(function () {
            //stop if isPlaying is false
            if (!this.isPlaying) return false;

            this.next();

            //stop if looping is disabled and last index is shown
            if (this.isPlaying && !this.loop && this.currentTime === this.initialTime) {
                this.stop();
                return false;
            }

        }, this.fps, this);
    }

    _getTimeLimits(times) {
        return [times[0], times[times.length -1]];
    }

    _setTimeFromSeek(time) {
        this.stop();
        this.setTime(time);
    }

    _getNextCallbackName() {
        let next = Object.keys(this._callbacks).length +1;
        return `onTimeChange_${next}`;
    }

    _addOnTimeChangeCallback(callback, name) {
        if (this._callbacks[name]) throw('Callback name already exists!');
        
        name = (!name) ? this._getNextCallbackName() : name;
        this._callbacks[name] = callback;
    }
}