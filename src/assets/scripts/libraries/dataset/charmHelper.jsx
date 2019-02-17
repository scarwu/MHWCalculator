'use strict';
/**
 * Dataset Charm Helper
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Constant
import Constant from 'constant';

// Load Dataset
import Charms from 'datasets/charms';

// [
//     0: name,
//     1: rare,
//     2: skills [
//         [
//             0: name,
//             1: level
//         ],
//         [ ... ]
//     ]
// ]
let dataset = Charms.map((charm) => {
    return {
        name: charm[0],
        rare: charm[1],
        skills: charm[2].map((skill) => {
            return {
                name: skill[0],
                level: skill[1]
            };
        })
    };
});

class CharmHelper {

    constructor (list) {
        this.mapping = {};

        list.forEach((data) => {
            this.mapping[data.name] = data;
        });

        // Filter Conditional
        this.resetFilter();
    }

    resetFilter = () => {
        this.filterSkillName = null;
    };

    getNames = () => {
        return Object.keys(this.mapping);
    };

    getItems = () => {
        let result = Object.values(this.mapping).filter((data) => {
            let isSkip = true;

            if (null !== this.filterSkillName) {
                for (let index in data.skills) {
                    if (this.filterSkillName !== data.skills[index].name) {
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
        return undefined !== this.mapping[name]
            ? JSON.parse(JSON.stringify(this.mapping[name])) : null;
    };

    // Applyed Info
    getApplyedInfo = (extend) => {
        let info = this.getInfo(extend.name);

        // Handler Skill & Slot
        let skillLevelMapping = {};

        info.skills || info.skills.forEach((data, index) => {
            let skillName = data.name;

            if (undefined === skillLevelMapping[skillName]) {
                skillLevelMapping[skillName] = 0;
            }

            skillLevelMapping[skillName] += data.level;
        });

        // Reset Skill
        info.skills = [];

        Object.keys(skillLevelMapping).forEach((skillName) => {
            let skillLevel = skillLevelMapping[skillName];
            let skillInfo = skillHelper.getInfo(skillName);

            // Fix Skill Level Overflow
            if (skillLevel > skillInfo.list.length) {
                skillLevel = skillInfo.list.length;
            }

            info.skills.push({
                name: skillName,
                level: skillLevel,
                description: skillInfo.list[skillLevel - 1].description
            });
        });

        info.skills = info.skills.sort((a, b) => {
            return b.level - a.level;
        });

        return info;
    };

    // Conditional Functions
    hasSkill = (name) => {
        this.filterSkillName = name;

        return this;
    };
}

export default new CharmHelper(dataset);
