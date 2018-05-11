'use strict';
/**
 * Fitting Algorithm
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import MD5 from 'md5';

// Load Custom Libraries
import Misc from 'library/misc';
import DataSet from 'library/dataset';

// Load Constant & Lang
import Constant from 'constant';

export default class FittingAlgorithm {

    /**
     * Search
     */
    search = (equips, ignoreEquips, sets, skills) => {

        if (0 === sets.length
            && 0 === skills.length) {

            return [];
        }

        this.conditionEquips = [];
        this.conditionSets = {};
        this.conditionSkills = {};
        this.correspondJewels = {};
        this.skipSkills = {};
        this.usedEquips = {};
        this.usedEquipTypes = {};
        this.conditionExpectedValue = 0;
        this.conditionExpectedLevel = 0;
        this.maxEquipsExpectedValue = {};
        this.maxEquipsExpectedLevel = {};

        let candidateEquips = {};
        let lastBundleLimit = 200;
        let prevBundleList = {};
        let nextBundleList = {};
        let lastBundleList = {};
        let bundle = Misc.deepCopy(Constant.defaultBundle);

        // Create Info by Sets
        sets.sort((a, b) => {
            let setInfoA = DataSet.setHelper.getInfo(a.name);
            let setInfoB = DataSet.setHelper.getInfo(b.name);

            return setInfoB.skills.pop().require - setInfoA.skills.pop().require;
        }).forEach((set) => {
            let setInfo = DataSet.setHelper.getInfo(set.name);

            this.conditionSets[set.name] = setInfo.skills[set.step - 1].require;
        });

        // Create Info by Skills
        skills.sort((a, b) => {
            return b.level - a.level;
        }).forEach((skill) => {
            if (0 === skill.level) {
                this.skipSkills[skill.name] = true;

                return;
            }

            this.conditionSkills[skill.name] = skill.level;

            let jewelInfo = DataSet.jewelHelper.hasSkill(skill.name).getItems();
            let jewel = (0 !== jewelInfo.length) ? jewelInfo[0] : null;

            this.correspondJewels[skill.name] = (null !== jewel) ? {
                name: jewel.name,
                size: jewel.size,
            } : null;

            // Increase Expected Value & Level
            if (null !== jewel) {
                this.conditionExpectedValue += skill.level * jewel.size; // 1, 2, 3
            } else {
                this.conditionExpectedValue += skill.level * 4;
            }

            this.conditionExpectedLevel += skill.level;
        });

        // Create First Bundle
        ['weapon', 'helm', 'chest', 'arm', 'waist', 'leg', 'charm'].forEach((equipType) => {
            if (undefined === equips[equipType]) {
                if ('weapon' !== equipType) {
                    this.conditionEquips.push(equipType);
                }

                return;
            }

            let equipInfo = null;
            let candidateEquip = null;

            // Get Equipment Info
            if ('weapon' === equipType) {
                equipInfo = DataSet.weaponHelper.getApplyedInfo(equips.weapon);
                equipInfo.type = equipType;
            } else if ('helm' === equipType
                || 'chest' === equipType
                || 'arm' === equipType
                || 'waist' === equipType
                || 'leg' === equipType) {

                equipInfo = DataSet.armorHelper.getApplyedInfo(equips[equipType]);
            } else if ('charm' === equipType) {
                equipInfo = DataSet.charmHelper.getApplyedInfo(equips.charm);
                equipInfo.type = equipType;
            }

            // Convert Equip to Candidate Equip
            candidateEquip = this.convertEquipToCandidateEquip(equipInfo);

            // Add Candidate Equip to Bundle
            bundle = this.addCandidateEquipToBundle(bundle, candidateEquip);

            // Add Jewels info to Bundle
            if (undefined !== equipInfo.slots) {
                equipInfo.slots.forEach((slot) => {
                    if (null === slot.jewel.name) {
                        return;
                    }

                    if (undefined === bundle.jewels[slot.jewel.name]) {
                        bundle.jewels[slot.jewel.name] = 0;
                    }

                    bundle.jewels[slot.jewel.name] += 1;
                    bundle.meta.remainingSlotCount[slot.size] -= 1;
                    bundle.meta.remainingSlotCount.all -= 1;
                });
            }

            // Set Used Candidate Equip
            this.usedEquips[candidateEquip.name] = true;
        });

        // Reset Equip Count
        bundle.meta.equipCount = 0;

        prevBundleList[this.generateBundleHash(bundle)] = bundle;

        let requireEquipCount = this.conditionEquips.length;
        let requireSkillCount = Object.keys(this.conditionSkills).length;

        Misc.log('Condition Skills:', this.conditionSkills);
        Misc.log('Condition Equips:', this.conditionEquips);
        Misc.log('Correspond Jewels:', this.correspondJewels);
        Misc.log('Condition Expected Value:', this.conditionExpectedValue);
        Misc.log('Condition Expected Level:', this.conditionExpectedLevel);
        Misc.log('Init - Bundle List:', prevBundleList);

        if (0 !== Object.keys(this.conditionSets).length) {

            // Create Candidate Equips with Set Equips
            Misc.log('Create Candidate Equips with Set Equips');

            candidateEquips = {};

            this.conditionEquips.forEach((equipType) => {
                if ('charm' === equipType) {
                    return;
                }

                if (undefined === candidateEquips[equipType]) {
                    candidateEquips[equipType] = {};
                }

                // Create Candidate Equips
                Object.keys(this.conditionSets).forEach((setName) => {
                    let equips = DataSet.armorHelper.typeIs(equipType).setIs(setName).getItems();

                    // Get Candidate Equips
                    candidateEquips[equipType] = this.createCandidateEquips(equips, equipType, candidateEquips[equipType]);
                });

                // Append Empty Candidate Equip
                let candidateEquip = Misc.deepCopy(Constant.defaultCandidateEquip);
                candidateEquip.type = equipType;

                candidateEquips[equipType]['empty'] = candidateEquip;
            });

            this.conditionEquips.forEach((equipType) => {
                if ('charm' === equipType) {
                    return;
                }

                Misc.log('Equip Count:', equipType, Object.keys(candidateEquips[equipType]).length, candidateEquips[equipType]);
            });

            this.conditionEquips.forEach((equipType) => {
                if ('charm' === equipType) {
                    return;
                }

                Misc.log('Bundle Count:', equipType, Object.keys(prevBundleList).length);

                nextBundleList = {};

                Object.values(candidateEquips[equipType]).forEach((candidateEquip) => {
                    Object.keys(prevBundleList).forEach((hash) => {
                        let bundle = Misc.deepCopy(prevBundleList[hash]);

                        if (undefined === bundle.equips[equipType]) {
                            bundle.equips[equipType] = null;
                        }

                        // Check Equip Part is Used
                        if (null !== bundle.equips[equipType]) {
                            nextBundleList[this.generateBundleHash(bundle)] = bundle;

                            return;
                        }

                        // Check Candidate Equip Name
                        if (null === candidateEquip.name) {
                            nextBundleList[this.generateBundleHash(bundle)] = bundle;

                            return;
                        }

                        // Add Candidate Equip to Bundle
                        bundle = this.addCandidateEquipToBundle(bundle, candidateEquip);

                        // Sets
                        let setRequire = this.conditionSets[candidateEquip.setName];

                        if (undefined === bundle.sets[candidateEquip.setName]) {
                            bundle.sets[candidateEquip.setName] = 0;
                        }

                        if (setRequire < bundle.sets[candidateEquip.setName]) {
                            bundle = Misc.deepCopy(prevBundleList[hash]);
                            nextBundleList[this.generateBundleHash(bundle)] = bundle;

                            return;
                        }

                        nextBundleList[this.generateBundleHash(bundle)] = bundle;
                    });
                });

                prevBundleList = nextBundleList;
            });

            Object.keys(this.conditionSets).forEach((setName) => {
                nextBundleList = {};

                let setRequire = this.conditionSets[setName];

                Object.keys(prevBundleList).forEach((hash) => {
                    let bundle = Misc.deepCopy(prevBundleList[hash]);

                    if (setRequire !== bundle.sets[setName]) {
                        return;
                    }

                    nextBundleList[this.generateBundleHash(bundle)] = bundle;
                });

                prevBundleList = nextBundleList;
            });

            Misc.log('Bundle Count:', Object.keys(prevBundleList).length);

            // Sets Require Equips is Overflow
            if (0 === Object.keys(prevBundleList).length) {
                return [];
            }
        }

        // Completed Skills
        Misc.log('Reset Completed Skills');

        nextBundleList = {};

        Object.keys(prevBundleList).forEach((hash) => {
            let bundle = Misc.deepCopy(prevBundleList[hash]);

            bundle.meta.completedSkills = {};

            Object.keys(bundle.skills).forEach((skillName) => {
                if (undefined === this.conditionSkills[skillName]) {
                    return;
                }

                let skillLevel = this.conditionSkills[skillName];

                if (skillLevel === bundle.skills[skillName]) {
                    bundle.meta.completedSkills[skillName] = true;
                }
            });

            nextBundleList[this.generateBundleHash(bundle)] = bundle;
        });

        prevBundleList = nextBundleList;

        // Create Candidate Equips with Skill & Slot Equips
        Misc.log('Create Candidate Equips with Skill & Slot Equips');

        candidateEquips = {};

        this.conditionEquips.forEach((equipType) => {
            if (undefined === candidateEquips[equipType]) {
                candidateEquips[equipType] = {};
            }

            // Create Candidate Equips
            Object.keys(this.conditionSkills).forEach((skillName) => {
                let equips = null;

                // Get Equips With Skill
                if ('helm' === equipType
                    || 'chest' === equipType
                    || 'arm' === equipType
                    || 'waist' === equipType
                    || 'leg' === equipType) {

                    equips = DataSet.armorHelper.typeIs(equipType).hasSkill(skillName).getItems();
                } else if ('charm' === equipType) {
                    equips = DataSet.charmHelper.hasSkill(skillName).getItems();
                }

                // Get Candidate Equips
                candidateEquips[equipType] = this.createCandidateEquips(equips, equipType, candidateEquips[equipType]);

                if ('charm' !== equipType) {

                    // Get Equips With Slot
                    equips = DataSet.armorHelper.typeIs(equipType).rareIs(0).getItems();

                    // Get Candidate Equips
                    candidateEquips[equipType] = this.createCandidateEquips(equips, equipType, candidateEquips[equipType]);
                }
            });

            // Append Empty Candidate Equip
            let candidateEquip = Misc.deepCopy(Constant.defaultCandidateEquip);
            candidateEquip.type = equipType;

            candidateEquips[equipType]['empty'] = candidateEquip;
        });

        Object.keys(candidateEquips).forEach((equipType) => {
            if (undefined === this.maxEquipsExpectedValue[equipType]) {
                this.maxEquipsExpectedValue[equipType] = 0;
            }

            if (undefined === this.maxEquipsExpectedLevel[equipType]) {
                this.maxEquipsExpectedLevel[equipType] = 0;
            }

            Object.values(candidateEquips[equipType]).forEach((candidateEquip) => {
                if (this.maxEquipsExpectedValue[equipType] <= candidateEquip.expectedValue) {
                    this.maxEquipsExpectedValue[equipType] = candidateEquip.expectedValue;
                }

                if (this.maxEquipsExpectedLevel[equipType] <= candidateEquip.expectedLevel) {
                    this.maxEquipsExpectedLevel[equipType] = candidateEquip.expectedLevel;
                }
            });
        });

        this.conditionEquips.forEach((equipType) => {
            Misc.log('Equip Count:', equipType, Object.keys(candidateEquips[equipType]).length, candidateEquips[equipType]);
        });

        Misc.log('Equips Expected Value:', this.maxEquipsExpectedValue);
        Misc.log('Equips Expected Level:', this.maxEquipsExpectedLevel);

        // Create Next BundleList
        Misc.log('Create Next BundleList');

        this.conditionEquips.forEach((equipType) => {
            Misc.log('Bundle Count:', equipType, Object.keys(prevBundleList).length);

            this.usedEquipTypes[equipType] = true;

            nextBundleList = {};

            Object.values(candidateEquips[equipType]).forEach((candidateEquip) => {
                Object.keys(prevBundleList).forEach((hash) => {
                    let bundle = Misc.deepCopy(prevBundleList[hash]);

                    if (undefined === bundle.equips[equipType]) {
                        bundle.equips[equipType] = null;
                    }

                    // Check Equip Part is Used
                    if (null !== bundle.equips[equipType]) {
                        nextBundleList[this.generateBundleHash(bundle)] = bundle;

                        return;
                    }

                    // Check Candidate Equip Name
                    if (null === candidateEquip.name) {
                        nextBundleList[this.generateBundleHash(bundle)] = bundle;

                        return;
                    }

                    // Add Candidate Equip to Bundle
                    bundle = this.addCandidateEquipToBundle(bundle, candidateEquip);

                    // Check Bundle Have a Future
                    if (false === this.isBundleHaveFuture(bundle)) {
                        return;
                    }

                    // Count & Check Skills from Candidate Equip
                    let isSkip = false;

                    Object.keys(candidateEquip.skills).forEach((skillName) => {
                        if (true === isSkip) {
                            return;
                        }

                        if (undefined == this.conditionSkills[skillName]) {
                            return;
                        }

                        let skillLevel = this.conditionSkills[skillName];

                        if (skillLevel < bundle.skills[skillName]) {
                            bundle = Misc.deepCopy(prevBundleList[hash]);
                            nextBundleList[this.generateBundleHash(bundle)] = bundle;

                            isSkip = true;

                            return;
                        }

                        if (skillLevel === bundle.skills[skillName]) {
                            bundle.meta.completedSkills[skillName] = true;
                        }
                    });

                    if (true === isSkip) {
                        return;
                    }

                    if (requireSkillCount === Object.keys(bundle.meta.completedSkills).length) {
                        lastBundleList[this.generateBundleHash(bundle)] = bundle;

                        return;
                    }

                    // If Equips Is Full Then Do Fully Check
                    if (requireEquipCount === bundle.meta.equipCount) {

                        // Completed Bundle By Skills
                        bundle = this.completeBundleBySkills(bundle);

                        if (false === bundle) {
                            return;
                        }

                        if (requireSkillCount === Object.keys(bundle.meta.completedSkills).length) {
                            lastBundleList[this.generateBundleHash(bundle)] = bundle;
                        }

                        return;
                    }

                    nextBundleList[this.generateBundleHash(bundle)] = bundle;
                });
            });

            prevBundleList = nextBundleList;

            Misc.log('Result - Bundle Count (Pre):', Object.keys(lastBundleList).length);
        });

        // Find Completed Bundle into Last BundleList
        Misc.log('Find Completed Bundles');

        Misc.log('Bundle List:', Object.keys(prevBundleList).length);

        nextBundleList = {};

        Object.keys(prevBundleList).forEach((hash) => {
            let bundle = Misc.deepCopy(prevBundleList[hash]);

            // Completed Bundle By Skills
            bundle = this.completeBundleBySkills(bundle);

            if (false === bundle) {
                return;
            }

            if (requireSkillCount === Object.keys(bundle.meta.completedSkills).length) {
                lastBundleList[this.generateBundleHash(bundle)] = bundle;
            }
        });

        Misc.log('Result - Bundle Count (Final):', Object.keys(lastBundleList).length);

        lastBundleList = Object.values(lastBundleList).sort((a, b) => {
            let valueA = (8 - a.meta.equipCount) * 1000 + a.defense;
            let valueB = (8 - b.meta.equipCount) * 1000 + b.defense;

            return valueB - valueA;
        }).slice(0, lastBundleLimit);

        return lastBundleList;
    };

    /**
     * Generate Bundle Hash
     */
    generateBundleHash = (bundle) => {
        let equips = {};
        let jewels = {};

        Object.keys(bundle.equips).forEach((equipType) => {
            if (null === bundle.equips[equipType]) {
                return;
            }

            equips[equipType] = bundle.equips[equipType];
        });

        Object.keys(bundle.jewels).sort().forEach((jewelName) => {
            if (0 === bundle.jewels[jewelName]) {
                return;
            }

            jewels[jewelName] = bundle.jewels[jewelName];
        });

        return MD5(JSON.stringify([equips, jewels]));
    };

    /**
     * Create Candidate Equips
     */
    createCandidateEquips = (equips, equipType, candidateEquips = {}) => {
        equips.forEach((equip) => {

            // Check Equip is in Ignore Equips
            if (undefined !== this.ignoreEquips[equipType]
                && true === this.ignoreEquips[equipType][equip.name]) {

                return;
            }

            let candidateEquip = this.convertEquipToCandidateEquip(equip);
            candidateEquip.type = equipType;

            // Check is Skip Equips
            if (true === this.isSkipCandidateEquip(candidateEquip)) {
                return;
            }

            // Check Used Equips
            if (true === this.usedEquips[candidateEquip.name]) {
                return;
            }

            // Set Used Candidate Equip Name
            this.usedEquips[candidateEquip.name] = true;

            // Set Candidate Equip
            candidateEquips[candidateEquip.name] = candidateEquip;
        });

        return candidateEquips;
    };

    /**
     * Convert Equip To Candidate Equip
     */
    convertEquipToCandidateEquip = (equip) => {
        let candidateEquip = Misc.deepCopy(Constant.defaultCandidateEquip);

        // Set Name, Type & Defense
        candidateEquip.name = equip.name;
        candidateEquip.type = equip.type;
        candidateEquip.defense = (undefined !== equip.defense) ? equip.defense : 0;

        if (undefined !== equip.set && null !== equip.set) {
            candidateEquip.setName = equip.set.name;
        }

        if (undefined === equip.skills) {
            equip.skills = [];
        }

        if (undefined === equip.slots) {
            equip.slots = [];
        }

        equip.skills.forEach((skill) => {
            candidateEquip.skills[skill.name] = skill.level;

            // Increase Expected Value & Level
            if (undefined !== this.correspondJewels[skill.name]) {
                let jewel = this.correspondJewels[skill.name];

                if (null !== jewel) {
                    candidateEquip.expectedValue += skill.level * jewel.size; // 1, 2, 3
                } else {
                    candidateEquip.expectedValue += skill.level * 4;
                }

                candidateEquip.expectedLevel += skill.level;
            }
        });

        equip.slots.forEach((slot) => {
            candidateEquip.ownSlotCount[slot.size] += 1;

            // Increase Expected Value & Level
            candidateEquip.expectedValue += slot.size;
            candidateEquip.expectedLevel += 1;
        });

        return candidateEquip;
    };

    isSkipCandidateEquip = (candidateEquip) => {

        let isSkip = false;

        Object.keys(candidateEquip.skills).forEach((skillName) => {
            if (true === isSkip) {
                return;
            }

            if (undefined !== this.skipSkills[skillName]
                && true === this.skipSkills[skillName]) {

                isSkip = true;
            }
        });

        return isSkip;
    };

    /**
     * Is Bundle Have Future
     *
     * Thisi is magic function, which is see through the future
     */
    isBundleHaveFuture = (bundle) => {
        let currentExpectedValue = bundle.meta.expectedValue;
        let currentExpectedLevel = bundle.meta.expectedLevel;

        if (currentExpectedValue >= this.conditionExpectedValue
            && currentExpectedLevel >= this.conditionExpectedLevel) {

            return true;
        }

        let haveFuture = false;

        this.conditionEquips.forEach((equipType) => {
            if (true === haveFuture) {
                return;
            }

            if (true === this.usedEquipTypes[equipType]) {
                return;
            }

            if (undefined === bundle.equips[equipType]
                || null !== bundle.equips[equipType]) {

                return;
            }

            currentExpectedValue += this.maxEquipsExpectedValue[equipType];
            currentExpectedLevel += this.maxEquipsExpectedLevel[equipType];

            if (currentExpectedValue >= this.conditionExpectedValue
                && currentExpectedLevel >= this.conditionExpectedLevel) {

                haveFuture = true;
            }
        });

        return haveFuture;
    };

    /**
     * Add Candidate Equip To Bundle
     */
    addCandidateEquipToBundle = (bundle, candidateEquip) => {
        if (null === candidateEquip.name) {
            return bundle;
        }

        if (undefined !== bundle.equips[candidateEquip.type]
            && null !== bundle.equips[candidateEquip.type]) {

            return bundle;
        }

        bundle.equips[candidateEquip.type] = candidateEquip.name;
        bundle.defense += candidateEquip.defense;

        if (null !== candidateEquip.setName) {
            if (undefined === bundle.sets[candidateEquip.setName]) {
                bundle.sets[candidateEquip.setName] = 0;
            }

            bundle.sets[candidateEquip.setName] += 1;
        }

        Object.keys(candidateEquip.skills).forEach((skillName) => {
            let skillLevel = candidateEquip.skills[skillName];

            if (undefined === bundle.skills[skillName]) {
                bundle.skills[skillName] = 0;
            }

            bundle.skills[skillName] += skillLevel;
        });

        for (let size = 1; size <= 3; size++) {
            bundle.meta.remainingSlotCount[size] += candidateEquip.ownSlotCount[size];
            bundle.meta.remainingSlotCount.all += candidateEquip.ownSlotCount[size];
        }

        // Increase Equip Count
        bundle.meta.equipCount += 1;

        // Increase Expected Value & Level
        bundle.meta.expectedValue += candidateEquip.expectedValue;
        bundle.meta.expectedLevel += candidateEquip.expectedLevel;

        return bundle;
    };

    /**
     * Complete Bundle By Skills
     */
    completeBundleBySkills = (bundle) => {
        let isSkip = false;

        Object.keys(this.conditionSkills).forEach((skillName) => {
            if (true === isSkip) {
                return;
            }

            let skillLevel = this.conditionSkills[skillName];

            if (undefined === bundle.skills[skillName]) {
                bundle.skills[skillName] = 0
            }

            // Add Jewel to Bundle
            bundle = this.addJewelToBundleBySpecificSkill(bundle, {
                name: skillName,
                level: skillLevel
            }, this.correspondJewels[skillName]);

            if (false === bundle) {
                isSkip = true;

                return;
            }

            if (skillLevel === bundle.skills[skillName]) {
                bundle.meta.completedSkills[skillName] = true;
            }
        });

        if (true === isSkip) {
            return false;
        }

        return bundle;
    };

    /**
     * Add Jewel To Bundle By Specific Skill
     */
    addJewelToBundleBySpecificSkill = (bundle, skill, jewel) => {
        let diffSkillLevel = skill.level - bundle.skills[skill.name];

        if (0 === diffSkillLevel) {
            return bundle;
        }

        // Failed - No Jewel
        if (null === jewel.name && 0 !== diffSkillLevel) {
            return false;
        }

        let currentSlotSize = jewel.size;
        let usedSlotCount = {
            1: 0,
            2: 0,
            3: 0
        };

        while (true) {
            if (0 !== bundle.meta.remainingSlotCount[currentSlotSize]) {
                if (diffSkillLevel > bundle.meta.remainingSlotCount[currentSlotSize]) {
                    usedSlotCount[currentSlotSize] = bundle.meta.remainingSlotCount[currentSlotSize];
                    diffSkillLevel -= bundle.meta.remainingSlotCount[currentSlotSize];
                } else {
                    usedSlotCount[currentSlotSize] = diffSkillLevel;
                    diffSkillLevel = 0;
                }
            }

            currentSlotSize += 1;

            if (0 === diffSkillLevel) {
                break;
            }

            // Failed - No Slots
            if (3 < currentSlotSize) {
                return false;
            }
        }

        if (undefined === bundle.skills[skill.name]) {
            bundle.skills[skill.name] = 0;
        }

        if (undefined === bundle.jewels[jewel.name]) {
            bundle.jewels[jewel.name] = 0;
        }

        diffSkillLevel = skill.level - bundle.skills[skill.name];

        bundle.skills[skill.name] += diffSkillLevel;
        bundle.jewels[jewel.name] += diffSkillLevel;

        Object.keys(usedSlotCount).forEach((slotSize) => {
            bundle.meta.remainingSlotCount[slotSize] -= usedSlotCount[slotSize];
            bundle.meta.remainingSlotCount.all -= usedSlotCount[slotSize];
        });

        return bundle;
    };
};
