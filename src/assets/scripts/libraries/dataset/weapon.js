'use strict';
/**
 * Dataset Weapon
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Core Libraries
import Helper from 'core/helper';

// Load Dataset
import Weapons from 'files/json/datasets/weapons.json';

let dataset = Weapons.map((weapon) => {
    return {
        id: weapon[0],
        rare: weapon[1],
        type: weapon[2],
        series: weapon[3],
        name: weapon[4],
        attack: weapon[5],
        criticalRate: weapon[6],
        defense: weapon[7],
        sharpness: (Helper.isNotEmpty(weapon[8])) ? {
            value: weapon[8][0],
            steps: {
                red: weapon[8][1][0],
                orange: weapon[8][1][1],
                yellow: weapon[8][1][2],
                green: weapon[8][1][3],
                blue: weapon[8][1][4],
                white: weapon[8][1][5],
                purple: weapon[8][1][6]
            }
        } : null,
        element: {
            attack: (Helper.isNotEmpty(weapon[9][0])) ? {
                type: weapon[9][0][0],
                minValue: weapon[9][0][1],
                maxValue: weapon[9][0][2],
                isHidden: weapon[9][0][3]
            } : null,
            status: (Helper.isNotEmpty(weapon[9][1])) ? {
                type: weapon[9][1][0],
                minValue: weapon[9][1][1],
                maxValue: weapon[9][1][2],
                isHidden: weapon[9][1][3]
            } : null
        },
        elderseal: (Helper.isNotEmpty(weapon[10])) ? {
            affinity: weapon[10]
        } : null,
        slots: (Helper.isNotEmpty(weapon[11])) ? weapon[11].map((size) => {
            return {
                size: size
            }
        }) : [],
        skills: (Helper.isNotEmpty(weapon[12])) ? weapon[12].map((skill) => {
            return {
                id: skill[0],
                level: skill[1]
            };
        }) : []
    };
});

class WeaponDataset {

    constructor (list) {
        this.mapping = {};

        list.forEach((data) => {
            this.mapping[data.id] = data;
        });

        // Filter Conditional
        this.resetFilter();
    }

    resetFilter = () => {
        this.filterType = null;
        this.filterRare = null;
        this.filterElementType = null;
        this.filterAttack = null;
        this.filterCriticalRate = null;
        this.filterDefense = null;
        this.filterElementValue = null;
        this.filterSlotCount = null;
    };

    getIds = () => {
        return Object.keys(this.mapping);
    };

    getItems = () => {
        let result = Object.values(this.mapping).filter((data) => {
            if (Helper.isNotEmpty(this.filterType)) {
                if (this.filterType !== data.type) {
                    return false;
                }
            }

            if (Helper.isNotEmpty(this.filterRare)) {
                if (this.filterRare !== data.rare) {
                    return false;
                }
            }

            return true;
        });

        this.resetFilter();

        return result;
    };

    getInfo = (name) => {
        return (Helper.isNotEmpty(this.mapping[name]))
            ? Helper.deepCopy(this.mapping[name]) : null;
    };

    // Conditional Functions
    typeIs = (text) => {
        this.filterType = text;

        return this;
    };

    rareIs = (number) => {
        this.filterRare = number;

        return this;
    };

    elementTypeIs = (text) => {
        this.filterElementType = text;

        return this;
    };

    attackIsGreaterEqualThen = (value) => {
        this.filterAttack = value;

        return this;
    };

    criticalRateIsGreaterEqualThen = (value) => {
        this.filterCriticalRate = value;

        return this;
    };

    defenseIsGreaterEqualThen = (value) => {
        this.filterDefense = value;

        return this;
    };

    elementValueIsGreaterEqualThen = (value) => {
        this.filterElementValue = value;

        return this;
    };

    slotCountIsGreaterEqualThen = (value) => {
        this.filterSlotCount = value;

        return this;
    };
}

export default new WeaponDataset(dataset);
