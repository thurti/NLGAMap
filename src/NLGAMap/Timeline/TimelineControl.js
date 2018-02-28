import {Events} from '../../Utils/Events';

import {defaults} from  './defaults';
import controlTemplate from './control.jst';
import EventEmitter from 'wolfy87-eventemitter/EventEmitter';
import './style.css';
import './icons.css';

L.Control.Timeline = L.Control.extend({
    
    includes: EventEmitter.prototype,

    options: defaults.controls,

    initialize(options = {}) {
        options.seekCurrent = this._timeToSeek(options.times, options.currentTime);
        options.seekMax     = options.times.length - 1;

        L.Util.setOptions(this, options);
    },

    onAdd() {
        let container       = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control-layers-expanded leaflet-control');
        container.innerHTML = controlTemplate(this);

        this._inputSeek       = container.querySelector('.seek');
        this._spanCurrentTime = container.querySelector('.currentTime .time');

        L.DomEvent.on(container, 'click', this._handleClick, this);
        Events.onRangeChange(this._inputSeek, this._handleSeek.bind(this));
        L.DomEvent.disableClickPropagation(container);
        L.DomEvent.disableClickPropagation(this._inputSeek);

        return container;
    },

    onRemove() {
        this.remove();
    },

    remove() {
        let container = this.getContainer();
        if (!container) return;

        L.DomEvent.off(container, 'click', this._handleClick, this);
        container.parentNode.removeChild(container);

        this._inputSeek       = null;
        this._spanCurrentTime = null;
        container             = null;
        this.options          = null;
    },

    _handleClick(e) {
        let action = e.target.dataset.action;

        if (action !== 'seek')
            this.trigger(action, [e.target]);

        switch (action) {
            case 'prev':
                this.setPlayButtonState('pause');
                break;
                
            case 'play':
                this.togglePlay();
                break;
                
            case 'next':
                this.setPlayButtonState('pause');
                break;

            case 'loop':
                this.toggleLoop();
                break;
        }
    },

    _handleSeek(e) {
        let newTime = this._seekToTime(this.options.times, e.target.value);
        this.trigger('seek', [newTime]);
        this.setPlayButtonState('pause');
    },

    _timeToSeek(times, time) {
        return times.indexOf(time);
    },

    _seekToTime(times, seek) {
        return times[parseInt(seek)];
    },

    togglePlay() {
        let btn = this.getContainer().querySelector('[data-action="play"]');

        if (btn.classList.contains('nlga_map-timeline-icon-play')) {
            this.trigger('start');
            this.setPlayButtonState('play', btn);
        } else {            
            this.trigger('stop');
            this.setPlayButtonState('pause', btn);
        }
    },

    setTime(time) {
        this._spanCurrentTime.innerText = time;
        this._inputSeek.value = this._timeToSeek(this.options.times, time);
    },

    toggleLoop() {
        let btn = this.getContainer().querySelector('[data-action="loop"]');
        btn.classList.toggle('is-active');
    },

    setPlayButtonState(state, btn) {
        btn = btn || this.getContainer().querySelector('[data-action="play"]');

        if (state === 'play') {
            btn.classList.remove('nlga_map-timeline-icon-play');
            btn.classList.add('nlga_map-timeline-icon-pause', 'is-active');
        } else {
            btn.classList.add('nlga_map-timeline-icon-play');
            btn.classList.remove('nlga_map-timeline-icon-pause', 'is-active');
        }
    },

});

L.control.timeline = (options) => {
    return new L.Control.Timeline(options);
};