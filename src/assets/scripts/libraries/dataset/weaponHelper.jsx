'use strict';
/**
 * Dataset Weapon Helper
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Custom Libraries
import Lang from 'libraries/lang';

// Load Constant
import Constant from 'constant';

// Load Dataset
import Weapons from 'datasets/weapons';

let dataset = Weapons;

class WeaponHelper {

    constructor (list) {
        this.mapping = {};

        list.forEach((data) => {
            this.mapping[data.name] = data;

            if (null === data.slots || 0 === data.slots.length) {
                return true;
            }

            let slots = data.slots.sort((a, b) => {
                return b.size - a.size;
            });

            let slotEquipData = {
                name: slots.map((slot) => {
                    return '[' + slot.size + ']';
                }).join('') + ' 插槽' + Lang[data.type],
                rare: 0,
                type: data.type,
                series: "插槽",
                attack: 0,
                criticalRate: 0,
                defense: 0,
                sharpness: null,
                element: {
                    attack: null,
                    status: null
                },
                elderseal: null,
                slots: slots,
                skills: []
            };

            this.mapping[slotEquipData.name] = slotEquipData;
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

    getNames = () => {
        return Object.keys(this.mapping);
    };

    getItems = () => {
        let result = Object.values(this.mapping).filter((data) => {
            if (null !== this.filterType) {
                if (this.filterType !== data.type) {
                    return false;
                }
            }

            if (null !== this.filterRare) {
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
        return (undefined !== this.mapping[name])
            ? JSON.parse(JSON.stringify(this.mapping[name])) : null;
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

export default new WeaponHelper(dataset);
