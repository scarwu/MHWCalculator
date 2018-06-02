'use strict';
/**
 * Data Set
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Constant & Lang
import Constant from 'constant';
import Lang from 'lang';

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
            if (null !== this.filterSkillName) {
                if (this.filterSkillName !== data.skill.name) {
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

    hasSkill = (name) => {
        this.filterSkillName = name;

        return this;
    };
}

/**
 * Enhance Helper
 */
class EnhanceHelper {

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
            if (null !== this.filterSkillName) {
                if (this.filterSkillName !== data.skill.name) {
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

    hasSkill = (name) => {
        this.filterSkillName = name;

        return this;
    };
}

/**
 * Weapon Helper
 */
class WeaponHelper {

    constructor (list) {
        this.mapping = {};

        list.forEach((data) => {
            this.mapping[data.name] = data;

            if (0 === data.slots.length) {
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
                slots: slots
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

    // Applyed Info
    getApplyedInfo = (extend) => {
        let info = this.getInfo(extend.name);

        if (null !== info.element.attack) {
            info.element.attack.value = info.element.attack.minValue;
        }

        if (null !== info.element.status) {
            info.element.status.value = info.element.status.minValue;
        }

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
        } else {
            enhanceTimes = [];
        }

        enhanceTimes.forEach((data, index) => {
            let enhanceName = null;

            if (null !== extend.enhanceNames
                && 'string' === typeof extend.enhanceNames[index]) {

                enhanceName = extend.enhanceNames[index];
            }

            // Update Info
            info.enhances.push({
                name: enhanceName
            });

            if (null === enhanceName) {
                return false;
            }

            if (undefined === enhanceLevelMapping[enhanceName]) {
                enhanceLevelMapping[enhanceName] = 0;
            }

            enhanceLevelMapping[enhanceName] += 1;
        });

        Object.keys(enhanceLevelMapping).forEach((enhanceName) => {
            let enhanceLevel = enhanceLevelMapping[enhanceName];
            let enhanceInfo = enhanceHelper.getInfo(enhanceName);

            if (null === enhanceInfo.list[enhanceLevel - 1].reaction) {
                return false;
            }

            Object.keys(enhanceInfo.list[enhanceLevel - 1].reaction).forEach((reactionType) => {
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

        info.skills.forEach((data, index) => {
            let skillName = data.name;

            if (undefined === skillLevelMapping[skillName]) {
                skillLevelMapping[skillName] = 0;
            }

            skillLevelMapping[skillName] += data.level;
        });

        info.slots.forEach((data, index) => {
            let jewelInfo = null;
            let jewelName = null;
            let jewelSize = null;
            let skillName = null;

            if (null !== extend.slotNames
                && 'string' === typeof extend.slotNames[index]) {

                jewelInfo = jewelHelper.getInfo(extend.slotNames[index]);
                jewelName = extend.slotNames[index];
                jewelSize = jewelInfo.size;
                skillName = jewelInfo.skill.name;
            }

            // Update Info
            info.slots[index].jewel = {
                name: jewelName,
                size: jewelSize
            };

            if (null === skillName) {
                return false;
            }

            if (undefined === skillLevelMapping[skillName]) {
                skillLevelMapping[skillName] = 0;
            }

            skillLevelMapping[skillName] += jewelInfo.skill.level;
        });

        // Reset Skill
        info.skills = [];

        Object.keys(skillLevelMapping).forEach((skillName) => {
            let skillLevel = skillLevelMapping[skillName];
            let skillInfo = skillHelper.getInfo(skillName);

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

/**
 * Armor Helper
 */
class ArmorHelper {

    constructor (list) {
        this.mapping = {};

        list.forEach((data) => {
            this.mapping[data.name] = data;

            if (0 === data.slots.length) {
                return true;
            }

            let slots = data.slots.sort((a, b) => {
                return b.size - a.size;
            });

            let slotEquipData = {
                name: slots.map((slot) => {
                    return '[' + slot.size + ']';
                }).join('') + ' 插槽' + Lang[data.type],
                series: "插槽",
                type: data.type,
                rare: 0,
                gender: "general",
                defense: 0,
                resistance: {
                    fire: 0,
                    water: 0,
                    thunder: 0,
                    ice: 0,
                    dragon: 0
                },
                slots: slots,
                skills: [],
                set: null,
                price: 0
            };

            this.mapping[slotEquipData.name] = slotEquipData;
        });

        // Filter Conditional
        this.resetFilter();
    }

    resetFilter = () => {
        this.filterType = null;
        this.filterRare = null;
        this.filterSet = null;
        this.filterSkillName = null;
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

            if (null !== this.filterSet) {
                if (null === data.set
                    || this.filterSet !== data.set.name) {

                    return false;
                }
            }

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

        info.skills.forEach((data, index) => {
            let skillName = data.name;

            if (undefined === skillLevelMapping[skillName]) {
                skillLevelMapping[skillName] = 0;
            }

            skillLevelMapping[skillName] += data.level;
        });

        info.slots.forEach((data, index) => {
            let jewelInfo = null;
            let jewelName = null;
            let jewelSize = null;
            let skillName = null;

            if (null !== extend.slotNames
                && 'string' === typeof extend.slotNames[index]) {

                jewelInfo = jewelHelper.getInfo(extend.slotNames[index]);
                jewelName = extend.slotNames[index];
                jewelSize = jewelInfo.size;
                skillName = jewelInfo.skill.name;
            }

            // Update Info
            info.slots[index].jewel = {
                name: jewelName,
                size: jewelSize
            };

            if (null === skillName) {
                return false;
            }

            if (undefined === skillLevelMapping[skillName]) {
                skillLevelMapping[skillName] = 0;
            }

            skillLevelMapping[skillName] += jewelInfo.skill.level;
        });

        // Reset Skill
        info.skills = [];

        Object.keys(skillLevelMapping).forEach((skillName) => {
            let skillLevel = skillLevelMapping[skillName];
            let skillInfo = skillHelper.getInfo(skillName);

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
    typeIs = (text) => {
        this.filterType = text;

        return this;
    };

    rareIs = (number) => {
        this.filterRare = number;

        return this;
    };

    setIs = (text) => {
        this.filterSet = text;

        return this;
    };

    hasSkill = (name) => {
        this.filterSkillName = name;

        return this;
    };
}

/**
 * Charm Helper
 */
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

        info.skills.forEach((data, index) => {
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

/**
 * Jewel Helper
 */
class JewelHelper {

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
                if (this.filterSkillName !== data.skill.name) {
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
        return undefined !== this.mapping[name]
            ? JSON.parse(JSON.stringify(this.mapping[name])) : null;
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

/**
 * Skill Helper
 */
class SkillHelper {

    constructor (list) {
        this.mapping = {};

        list.forEach((data) => {
            this.mapping[data.name] = data;
        });
    }

    getNames = () => {
        return Object.keys(this.mapping);
    };

    getItems = () => {
        return Object.values(this.mapping);
    };

    getInfo = (name) => {
        return undefined !== this.mapping[name]
            ? JSON.parse(JSON.stringify(this.mapping[name])) : null;
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
