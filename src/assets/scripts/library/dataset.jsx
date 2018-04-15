'use strict';
/**
 * Data Set
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Constant
import Constant from 'constant';

// Load JSON Data
import Skills from '../../json/skills.json';
import Jewels from '../../json/jewels.json';
import Charms from '../../json/charms.json';
import Armors from '../../json/armors.json';
import Weapons from '../../json/weapons.json';
import Sets from '../../json/sets.json';
import Enhances from '../../json/enhances.json';

/**
 * Set Helper
 */
class SetHelper {

    constructor (list) {
        this.mapping = {};

        list.map((data) => {
            this.mapping[data.name] = data;
        });

        // Filter Conditional
        this.filterSkillKey = null;
    }

    getKeys = () => {
        return Object.keys(this.mapping);
    };

    getItems = () => {
        return Object.values(this.mapping).filter((data) => {
            if (null !== this.filterSkillKey) {
                if (this.filterSkillKey !== data.skill.key) {
                    return false;
                }
            }

            return true;
        });
    };

    getInfo = (key) => {
        return undefined !== this.mapping[key]
            ? JSON.parse(JSON.stringify(this.mapping[key])) : null;
    };

    hasSkill = (key) => {
        this.filterSkillKey = key;

        return this;
    };
}

/**
 * Enhance Helper
 */
class EnhanceHelper {

    constructor (list) {
        this.mapping = {};

        list.map((data) => {
            this.mapping[data.name] = data;
        });

        // Filter Conditional
        this.filterSkillKey = null;
    }

    getKeys = () => {
        return Object.keys(this.mapping);
    };

    getItems = () => {
        return Object.values(this.mapping).filter((data) => {
            if (null !== this.filterSkillKey) {
                if (this.filterSkillKey !== data.skill.key) {
                    return false;
                }
            }

            return true;
        });
    };

    getInfo = (key) => {
        return undefined !== this.mapping[key]
            ? JSON.parse(JSON.stringify(this.mapping[key])) : null;
    };

    hasSkill = (key) => {
        this.filterSkillKey = key;

        return this;
    };
}

/**
 * Weapon Helper
 */
class WeaponHelper {

    constructor (list) {
        this.mapping = {};

        list.map((data) => {
            this.mapping[data.name] = data;
        });

        // Filter Conditional
        this.filterType = null;
        this.filterElementType = null;
        this.filterAttack = null;
        this.filterCriticalRate = null;
        this.filterDefense = null;
        this.filterElementValue = null;
        this.filterSlotCount = null;
    }

    getKeys = () => {
        return Object.keys(this.mapping);
    };

    getItems = () => {
        return Object.values(this.mapping);
    };

    getInfo = (key) => {
        return (undefined !== this.mapping[key])
            ? JSON.parse(JSON.stringify(this.mapping[key])) : null;
    };

    // Applyed Info
    getApplyedInfo = (extend) => {
        let info = this.getInfo(extend.key);

        // Handle Enhance
        let enhanceLevelMapping = {};
        let enhanceTimes = 0;
        info.enhances = [];

        if (8 === info.rare) {
            enhanceTimes = [...Array(1).keys()];
        } else if (7 === info.rare) {
            enhanceTimes = [...Array(2).keys()];
        } else if (6 === info.rare) {
            enhanceTimes = [...Array(3).keys()];
        }

        enhanceTimes.map((data, index) => {
            let enhanceKey = null;

            if (null !== extend.enhanceKeys
                && null !== extend.enhanceKeys[index]) {

                enhanceKey = extend.enhanceKeys[index];
            }

            // Update Info
            info.enhances.push({
                key: enhanceKey
            });

            if (null === enhanceKey) {
                return false;
            }

            if (undefined === enhanceLevelMapping[enhanceKey]) {
                enhanceLevelMapping[enhanceKey] = 0;
            }

            enhanceLevelMapping[enhanceKey] += 1;
        });

        Object.keys(enhanceLevelMapping).map((enhanceKey) => {
            let enhanceLevel = enhanceLevelMapping[enhanceKey];
            let enhanceInfo = enhanceHelper.getInfo(enhanceKey);

            if (null === enhanceInfo.list[enhanceLevel - 1].reaction) {
                return false;
            }

            Object.keys(enhanceInfo.list[enhanceLevel - 1].reaction).map((reactionType) => {
                let data = enhanceInfo.list[enhanceLevel - 1].reaction[reactionType];

                switch (reactionType) {
                case 'attack':
                    info.attack += data.value * Constant.weaponMultiple[info.type];
                    info.attack = parseInt(Math.round(info.attack));

                    break;
                case 'criticalRate':
                    info.criticalRate += data.value;

                    break;
                case 'defense':
                    info.defense = data.value;

                    break;
                case 'addSlot':
                    info.slots.push({
                        size: data.size
                    });

                    break;
                }
            });
        });

        // Handler Slot
        let skillLevelMapping = {};

        info.slots.map((data, index) => {
            let jewelKey = null;
            let jewelInfo = null;
            let skillKey = null;


            if (null !== extend.slotKeys
                && null !== extend.slotKeys[index]) {

                jewelKey = extend.slotKeys[index];
                jewelInfo = jewelHelper.getInfo(jewelKey);
                skillKey = jewelInfo.skill.key;
            }

            // Update Info
            info.slots[index].key = jewelKey;

            if (null === skillKey) {
                return false;
            }

            if (undefined === skillLevelMapping[skillKey]) {
                skillLevelMapping[skillKey] = 0;
            }

            skillLevelMapping[skillKey] += jewelInfo.skill.level;
        });

        // Reset Skill
        info.skills = [];

        Object.keys(skillLevelMapping).map((skillKey) => {
            let skillLevel = skillLevelMapping[skillKey];
            let skillInfo = skillHelper.getInfo(skillKey);

            info.skills.push({
                key: skillKey,
                level: skillLevel,
                description: skillInfo.list[skillLevel - 1].description
            });
        });

        return info;
    };

    // Conditional Functions
    typeIs = (text) => {
        this.filterType = text;

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

/**
 * Armor Helper
 */
class ArmorHelper {

    constructor (list) {
        this.mapping = {};

        list.map((data) => {
            this.mapping[data.name] = data;
        });

        // Filter Conditional
        this.filterType = null;
        this.filterSkillKey = null;
    }

    getKeys = () => {
        return Object.keys(this.mapping);
    };

    getItems = () => {
        return Object.values(this.mapping).filter((data) => {
            if (null !== this.filterType) {
                if (this.filterType !== data.type) {
                    return false;
                }
            }

            let isSkip = true;

            if (null !== this.filterSkillKey) {
                for (let index in data.skills) {
                    if (this.filterSkillKey !== data.skills[index].key) {
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
    };

    getInfo = (key) => {
        return undefined !== this.mapping[key]
            ? JSON.parse(JSON.stringify(this.mapping[key])) : null;
    };

    // Applyed Info
    getApplyedInfo = (extend) => {
        let info = this.getInfo(extend.key);

        // Handler Skill & Slot
        let skillLevelMapping = {};

        info.skills.map((data, index) => {
            let skillKey = data.key;

            if (undefined === skillLevelMapping[skillKey]) {
                skillLevelMapping[skillKey] = 0;
            }

            skillLevelMapping[skillKey] += data.level;
        });

        info.slots.map((data, index) => {
            let jewelKey = null;
            let jewelInfo = null;
            let skillKey = null;

            if (null !== extend.slotKeys
                && null !== extend.slotKeys[index]) {

                jewelKey = extend.slotKeys[index];
                jewelInfo = jewelHelper.getInfo(jewelKey);
                skillKey = jewelInfo.skill.key;
            }

            // Update Info
            info.slots[index].key = jewelKey;

            if (null === skillKey) {
                return false;
            }

            if (undefined === skillLevelMapping[skillKey]) {
                skillLevelMapping[skillKey] = 0;
            }

            skillLevelMapping[skillKey] += jewelInfo.skill.level;
        });

        // Reset Skill
        info.skills = [];

        Object.keys(skillLevelMapping).map((skillKey) => {
            let skillLevel = skillLevelMapping[skillKey];
            let skillInfo = skillHelper.getInfo(skillKey);

            info.skills.push({
                key: skillKey,
                level: skillLevel,
                description: skillInfo.list[skillLevel - 1].description
            });
        });

        info.skills = info.skills.sort((a, b) => {
            return a.level < b.level;
        });

        return info;
    };

    // Conditional Functions
    typeIs = (text) => {
        this.filterType = text;

        return this;
    };

    hasSkill = (key) => {
        this.filterSkillKey = key;

        return this;
    };
}

/**
 * Charm Helper
 */
class CharmHelper {

    constructor (list) {
        this.mapping = {};

        list.map((data) => {
            this.mapping[data.name] = data;
        });

        // Filter Conditional
        this.filterSkillKey = null;
    }

    getKeys = () => {
        return Object.keys(this.mapping);
    };

    getItems = () => {
        return Object.values(this.mapping).filter((data) => {
            let isSkip = true;

            if (null !== this.filterSkillKey) {
                for (let index in data.skills) {
                    if (this.filterSkillKey !== data.skills[index].key) {
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
    };

    getInfo = (key) => {
        return undefined !== this.mapping[key]
            ? JSON.parse(JSON.stringify(this.mapping[key])) : null;
    };

    // Applyed Info
    getApplyedInfo = (extend) => {
        let info = this.getInfo(extend.key);

        // Handler Skill & Slot
        let skillLevelMapping = {};

        info.skills.map((data, index) => {
            let skillKey = data.key;

            if (undefined === skillLevelMapping[skillKey]) {
                skillLevelMapping[skillKey] = 0;
            }

            skillLevelMapping[skillKey] += data.level;
        });

        // Reset Skill
        info.skills = [];

        Object.keys(skillLevelMapping).map((skillKey) => {
            let skillLevel = skillLevelMapping[skillKey];
            let skillInfo = skillHelper.getInfo(skillKey);

            info.skills.push({
                key: skillKey,
                level: skillLevel,
                description: skillInfo.list[skillLevel - 1].description
            });
        });

        return info;
    };

    // Conditional Functions
    hasSkill = (key) => {
        this.filterSkillKey = key;

        return this;
    };
}

/**
 * Jewel Helper
 */
class JewelHelper {

    constructor (list) {
        this.mapping = {};

        list.map((data) => {
            this.mapping[data.name] = data;
        });

        // Filter Conditional
        this.filterSkillKey = null;
        this.filterSize = null;
        this.filterSizeCondition = null;
    }

    getKeys = () => {
        return Object.keys(this.mapping);
    };

    getItems = () => {
        return Object.values(this.mapping).filter((data) => {
            if (null !== this.filterSkillKey) {
                if (this.filterSkillKey !== data.skill.key) {
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
    };

    getInfo = (key) => {
        return undefined !== this.mapping[key]
            ? JSON.parse(JSON.stringify(this.mapping[key])) : null;
    };

    hasSkill = (key) => {
        this.filterSkillKey = key;

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

/**
 * Skill Helper
 */
class SkillHelper {

    constructor (list) {
        this.mapping = {};

        list.map((data) => {
            this.mapping[data.name] = data;
        });
    }

    getKeys = () => {
        return Object.keys(this.mapping);
    };

    getItems = () => {
        return Object.values(this.mapping);
    };

    getInfo = (key) => {
        return undefined !== this.mapping[key]
            ? JSON.parse(JSON.stringify(this.mapping[key])) : null;
    };
}

let setHelper = new SetHelper(Sets);
let enhanceHelper = new EnhanceHelper(Enhances);
let weaponHelper = new WeaponHelper(Weapons);
let armorHelper = new ArmorHelper(Armors);
let charmHelper = new CharmHelper(Charms);
let jewelHelper = new JewelHelper(Jewels);
let skillHelper = new SkillHelper(Skills);

export default {
    setHelper: setHelper,
    enhanceHelper: enhanceHelper,
    weaponHelper: weaponHelper,
    armorHelper: armorHelper,
    charmHelper: charmHelper,
    jewelHelper: jewelHelper,
    skillHelper: skillHelper
};
