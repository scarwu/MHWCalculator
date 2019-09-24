/**
 * Dataset Enhance
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Core Libraries
import Helper from 'core/helper';

// Load Dataset
import Enhances from 'files/json/datasets/enhances.json';

// [
//     0: id,
//     1: name,
//     2: list [
//         [
//             0: level,
//             1: description,
//             2: reaction { ... }
//         ],
//         [ ... ]
//     ]
// ]
let dataset = Enhances.map((enhance) => {
    return {
        id: enhance[0],
        name: enhance[1],
        list: enhance[2].map((item) => {
            return {
                level: item[0],
                description: item[1],
                reaction: item[2]
            }
        })
    };
});

class EnhanceDataset {

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
    };

    getIds = () => {
        return Object.keys(this.mapping);
    };

    getItems = () => {
        let result = Object.values(this.mapping).filter((data) => {
            if (Helper.isNotEmpty(this.filterSkillName)) {
                if (this.filterSkillName !== data.skill.id) {
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

    hasSkill = (name) => {
        this.filterSkillName = name;

        return this;
    };
}

export default new EnhanceDataset(dataset);
