'use strict';
/**
 * Dataset Jewel
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Core Libraries
import Helper from 'core/helper';

// Load Dataset
import Jewels from 'json/datasets/jewels.json';

// [
//     0: id,
//     1: name,
//     2: rare,
//     3: size,
//     4: skill [
//         0: id,
//         1: level
//     ]
// ]
let dataset = Jewels.map((jewel) => {
    return {
        id: jewel[0],
        name: jewel[1],
        rare: jewel[2],
        size: jewel[3],
        skill: {
            id: jewel[4][0],
            level: jewel[4][1]
        }
    };
});

class JewelDataset {

    constructor (list) {
        this.mapping = {};

        list.forEach((data) => {
            this.mapping[data.id] = data;
        });

        // Filter Conditional
        this.resetFilter();
    }

    resetFilter = () => {
        this.filterSkillName = null;
        this.filterRare = null;
        this.filterSize = null;
        this.filterSizeCondition = null;
    };

    getNames = () => {
        return Object.keys(this.mapping);
    };

    getItems = () => {
        let result = Object.values(this.mapping).filter((data) => {
            if (null !== this.filterRare) {
                if (this.filterRare !== data.rare) {
                    return false;
                }
            }

            if (null !== this.filterSkillName) {
                if (this.filterSkillName !== data.skill.id) {
                    return false;
                }
            }

            if (null !== this.filterSize) {
                switch (this.filterSizeCondition) {
                case 'equal':
                    if (this.filterSize !== data.size) {
                        return false;
                    }

                    break;
                case 'greaterEqual':
                    if (this.filterSize > data.size) {
                        return false;
                    }

                    break;
                }
            }

            return true;
        });

        this.resetFilter();

        return result;
    };

    getInfo = (name) => {
        return (undefined !== this.mapping[name])
            ? Helper.deepCopy(this.mapping[name]) : null;
    };

    // Conditional Functions
    rareIs = (number) => {
        this.filterRare = number;

        return this;
    };

    hasSkill = (name) => {
        this.filterSkillName = name;

        return this;
    };

    sizeIsGreaterEqualThen = (value) => {
        this.filterSize = value;
        this.filterSizeCondition = 'greaterEqual';

        return this;
    };

    sizeIsEqualThen = (value) => {
        this.filterSize = value;
        this.filterSizeCondition = 'equal';

        return this;
    };
}

export default new JewelDataset(dataset);
