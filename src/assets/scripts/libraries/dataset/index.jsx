'use strict';
/**
 * Dataset
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Constant
import Constant from 'constant';

// Load Helpers
import SetHelper from 'libraries/dataset/setHelper';
import EnhanceHelper from 'libraries/dataset/enhanceHelper';
import WeaponHelper from 'libraries/dataset/weaponHelper';
import ArmorHelper from 'libraries/dataset/armorHelper';
import CharmHelper from 'libraries/dataset/charmHelper';
import JewelHelper from 'libraries/dataset/jewelHelper';
import SkillHelper from 'libraries/dataset/skillHelper';

let getAppliedWeaponInfo = (extend) => {
    let info = WeaponHelper.getInfo(extend.id);

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
        let enhanceId = null;

        if (null !== extend.enhanceIds
            && 'string' === typeof extend.enhanceIds[index]) {

            enhanceId = extend.enhanceIds[index];
        }

        // Update Info
        info.enhances.push({
            id: enhanceId
        });

        if (null === enhanceId) {
            return false;
        }

        if (undefined === enhanceLevelMapping[enhanceId]) {
            enhanceLevelMapping[enhanceId] = 0;
        }

        enhanceLevelMapping[enhanceId] += 1;
    });

    Object.keys(enhanceLevelMapping).forEach((enhanceId) => {
        let enhanceLevel = enhanceLevelMapping[enhanceId];
        let enhanceInfo = EnhanceHelper.getInfo(enhanceId);

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
        let skillId = data.id;

        if (undefined === skillLevelMapping[skillId]) {
            skillLevelMapping[skillId] = 0;
        }

        skillLevelMapping[skillId] += data.level;
    });

    info.slots && info.slots.forEach((data, index) => {
        let jewelInfo = null;
        let jewelId = null;
        let jewelSize = null;
        let skillId = null;

        if (null !== extend.slotIds
            && 'string' === typeof extend.slotIds[index]) {

            jewelInfo = JewelHelper.getInfo(extend.slotIds[index]);
            jewelId = extend.slotIds[index];
            jewelSize = jewelInfo.size;
            skillId = jewelInfo.skill.id;
        }

        // Update Info
        info.slots[index].jewel = {
            id: jewelId,
            size: jewelSize
        };

        if (null === skillId) {
            return false;
        }

        if (undefined === skillLevelMapping[skillId]) {
            skillLevelMapping[skillId] = 0;
        }

        skillLevelMapping[skillId] += jewelInfo.skill.level;
    });

    // Reset Skill
    info.skills = [];

    Object.keys(skillLevelMapping).forEach((skillId) => {
        let skillLevel = skillLevelMapping[skillId];
        let skillInfo = SkillHelper.getInfo(skillId);

        // Fix Skill Level Overflow
        if (skillLevel > skillInfo.list.length) {
            skillLevel = skillInfo.list.length;
        }

        info.skills.push({
            id: skillId,
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
    let info = ArmorHelper.getInfo(extend.id);

    // Handler Skill & Slot
    let skillLevelMapping = {};

    info.skills && info.skills.forEach((data, index) => {
        let skillId = data.id;

        if (undefined === skillLevelMapping[skillId]) {
            skillLevelMapping[skillId] = 0;
        }

        skillLevelMapping[skillId] += data.level;
    });

    info.slots && info.slots.forEach((data, index) => {
        let jewelInfo = null;
        let jewelId = null;
        let jewelSize = null;
        let skillId = null;

        if (null !== extend.slotIds
            && 'string' === typeof extend.slotIds[index]) {

            jewelInfo = JewelHelper.getInfo(extend.slotIds[index]);
            jewelId = extend.slotIds[index];
            jewelSize = jewelInfo.size;
            skillId = jewelInfo.skill.id;
        }

        // Update Info
        info.slots[index].jewel = {
            id: jewelId,
            size: jewelSize
        };

        if (null === skillId) {
            return false;
        }

        if (undefined === skillLevelMapping[skillId]) {
            skillLevelMapping[skillId] = 0;
        }

        skillLevelMapping[skillId] += jewelInfo.skill.level;
    });

    // Reset Skill
    info.skills = [];

    Object.keys(skillLevelMapping).forEach((skillId) => {
        let skillLevel = skillLevelMapping[skillId];
        let skillInfo = SkillHelper.getInfo(skillId);

        info.skills.push({
            id: skillId,
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
    let info = CharmHelper.getInfo(extend.id);

    // Handler Skill & Slot
    let skillLevelMapping = {};

    info.skills || info.skills.forEach((data, index) => {
        let skillId = data.id;

        if (undefined === skillLevelMapping[skillId]) {
            skillLevelMapping[skillId] = 0;
        }

        skillLevelMapping[skillId] += data.level;
    });

    // Reset Skill
    info.skills = [];

    Object.keys(skillLevelMapping).forEach((skillId) => {
        let skillLevel = skillLevelMapping[skillId];
        let skillInfo = SkillHelper.getInfo(skillId);

        // Fix Skill Level Overflow
        if (skillLevel > skillInfo.list.length) {
            skillLevel = skillInfo.list.length;
        }

        info.skills.push({
            id: skillId,
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
