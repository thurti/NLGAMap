import findIndex from 'lodash/findIndex';
import {Parse} from '../Utils/Parse';
import geostats from 'geostats';

const modes = {
    equal: 'getClassEqInterval',
    quantile: 'getClassQuantile',
    stdDeviation: 'getClassStdDeviation',
    jenks: 'getClassJenks',
    continuous: 'setClassManually',
    manual: 'setClassManually'
};

export class Classification extends geostats {

    constructor(data) {
        super(data);
        this.silent = true;
        this.limits = [];
    }

    setLimits(limits) {
        this.limits = limits.map((limit) => {
            if(limit === '') {
                return limit;
            } else {
                return Parse.float(limit);
            }
        });

        if (!this.isOpenRange(this.limits)) {
            this.setBounds(this.limits);
            this.setRanges();
        }

        return this.limits;
    }
    
    getLimits(mode, steps) {
        switch(mode) {

            case 'manual':
                break;

            case 'continuous':
                if (this._lastMode !== 'continuous') 
                    this.limits = this.getMinMax();
                break;

            default: 
                if (this.pop() > steps) {
                    this.limits = this[modes[mode]](steps);
                } else {
                    console.error('Number of steps must be lower than number of values.');
                }

        }

        this._lastMode = mode;
        
        return this.limits;
    }

    getMinMax() {
        return [this.min(), this.max()];
    }

    getClassIdx(value) {
        if (this.isOpenRange(this.limits)) {
            return this.getClassOpenRange(this.limits, value);
        } else {
            let idx = this.getClass(value);
            return (isFinite(idx)) ? idx : -1;
        }
    }

    isOpenRange(limits) {
        return (limits[0] === '' || limits[limits.length -1 ] === '') ? true : false;
    }

    getClassOpenRange(limits, value) {
        return findIndex(limits, (limit, idx) => {
                if (idx === 0) {
                    //value is open lower class
                    if (limit === '' && value <= limits[idx+1])
                        return true;

                    return (value >= limit && value <= limits[idx+1]);
                }

                //value in open upper class
                if (idx === limits.length-2 && limits[idx+1] === '' && value > limits[idx]){
                    return true;
                }

                // return (value <= limits[idx+1]);
                return (value > limit && value <= limits[idx+1]);
            });
    }
}