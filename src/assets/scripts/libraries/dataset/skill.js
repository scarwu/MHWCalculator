'use strict';
/**
 * Dataset Skill
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Core Libraries
import Helper from 'core/helper';

// Load Dataset
import Skills from 'files/json/datasets/skills.json';

// [
//     0: id,
//     1: name,
//     2: description,
//     3: type,
//     4: from [
//         0: set,
//         1: jewel,
//         2: armor,
//         3: weapon
//     ],
//     5: list [
//         [
//             0: level,
//             1: description,
//             2: reaction { ... }
//         ],
//         [ ... ]
//     ]
// ]
let dataset = Skills.map((skill) => {
    return {
        id: skill[0],
        name: skill[1],
        description: skill[2],
        type: skill[3],
        from: {
            set: skill[4][0],
            jewel: skill[4][1],
            armor: skill[4][2],
            weapon: skill[4][3]
        },
        list: skill[5].map((item) => {
            return {
                level: item[0],
                description: item[1],
                reaction: item[2],
                idHidden: item[3]
            }
        })
    };
});

class SkillDataset {

    constructor (list) {
        this.mapping = {};

        list.forEach((data) => {
            this.mapping[data.id] = data;
        });
    }

    getIds = () => {
        return Object.keys(this.mapping);
    };

    getItems = () => {
        return Object.values(this.mapping);
    };

    getInfo = (name) => {
        return (Helper.isNotEmpty(this.mapping[name]))
            ? Helper.deepCopy(this.mapping[name]) : null;
    };
}

export default new SkillDataset(dataset);
