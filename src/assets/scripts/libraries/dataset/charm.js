/**
 * Dataset Charm
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Core Libraries
import Helper from 'core/helper';

// Load Dataset
import Charms from 'files/json/datasets/charms.json';

// [
//     0: seriesId,
//     1: level,
//     2: id,
//     3: name,
//     4: rare,
//     5: skills [
//         [
//             0: id,
//             1: level
//         ],
//         [ ... ]
//     ]
// ]
let dataset = Charms.map((charm) => {
    return {
        seriesId: charm[0],
        level: charm[1],
        id: charm[2],
        name: charm[3],
        rare: charm[4],
        skills: charm[5].map((skill) => {
            return {
                id: skill[0],
                level: skill[1]
            };
        })
    };
});

class CharmDataset {

    constructor (list) {
        this.mapping = {};

        list.forEach((data) => {
            this.mapping[data.id] = data;
        });

        // Filter Conditional
        this.resetFilter();
    }

    resetFilter = () => {
        this.filterRare = null;
        this.filterSkillName = null;
    };

    getIds = () => {
        return Object.keys(this.mapping);
    };

    getItems = () => {
        let result = Object.values(this.mapping).filter((data) => {
            if (Helper.isNotEmpty(this.filterRare)) {
                if (this.filterRare !== data.rare) {
                    return false;
                }
            }

            let isSkip = true;

            if (Helper.isNotEmpty(this.filterSkillName)) {
                for (let index in data.skills) {
                    if (this.filterSkillName !== data.skills[index].id) {
                        continue;
                    }

                    isSkip = false;
                }

                if (isSkip) {
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
    rareIs = (number) => {
        this.filterRare = number;

        return this;
    };

    hasSkill = (name) => {
        this.filterSkillName = name;

        return this;
    };
}

export default new CharmDataset(dataset);
