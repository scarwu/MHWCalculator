'use strict';
/**
 * Dataset
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Helpers
import SetHelper from 'libraries/dataset/setHelper';
import EnhanceHelper from 'libraries/dataset/enhanceHelper';
import WeaponHelper from 'libraries/dataset/weaponHelper';
import ArmorHelper from 'libraries/dataset/armorHelper';
import CharmHelper from 'libraries/dataset/charmHelper';
import JewelHelper from 'libraries/dataset/jewelHelper';
import SkillHelper from 'libraries/dataset/skillHelper';

let getAppliedWeaponInfo = (extend) => {
    let info = WeaponHelper.getInfo(extend.name);

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
        let enhanceInfo = EnhanceHelper.getInfo(enhanceName);

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

    info.skills && info.skills.forEach((data, index) => {
        let skillName = data.name;

        if (undefined === skillLevelMapping[skillName]) {
            skillLevelMapping[skillName] = 0;
        }

        skillLevelMapping[skillName] += data.level;
    });

    info.slots && info.slots.forEach((data, index) => {
        let jewelInfo = null;
        let jewelName = null;
        let jewelSize = null;
        let skillName = null;

        if (null !== extend.slotNames
            && 'string' === typeof extend.slotNames[index]) {

            jewelInfo = JewelHelper.getInfo(extend.slotNames[index]);
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
        let skillInfo = SkillHelper.getInfo(skillName);

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

let getAppliedArmorInfo = (extend) => {
    let info = ArmorHelper.getInfo(extend.name);

    // Handler Skill & Slot
    let skillLevelMapping = {};

    info.skills && info.skills.forEach((data, index) => {
        let skillName = data.name;

        if (undefined === skillLevelMapping[skillName]) {
            skillLevelMapping[skillName] = 0;
        }

        skillLevelMapping[skillName] += data.level;
    });

    info.slots && info.slots.forEach((data, index) => {
        let jewelInfo = null;
        let jewelName = null;
        let jewelSize = null;
        let skillName = null;

        if (null !== extend.slotNames
            && 'string' === typeof extend.slotNames[index]) {

            jewelInfo = JewelHelper.getInfo(extend.slotNames[index]);
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
        let skillInfo = SkillHelper.getInfo(skillName);

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

let getAppliedCharmInfo = (extend) => {
    let info = CharmHelper.getInfo(extend.name);

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
        let skillInfo = SkillHelper.getInfo(skillName);

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

export default {
    setHelper: SetHelper,
    enhanceHelper: EnhanceHelper,
    weaponHelper: WeaponHelper,
    armorHelper: ArmorHelper,
    charmHelper: CharmHelper,
    jewelHelper: JewelHelper,
    skillHelper: SkillHelper,
    getAppliedWeaponInfo: getAppliedWeaponInfo,
    getAppliedArmorInfo: getAppliedArmorInfo,
    getAppliedCharmInfo: getAppliedCharmInfo
};
