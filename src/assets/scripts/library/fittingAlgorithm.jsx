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
    search = (equips, sets, skills) => {

        // Create 1st BundleList & Extra Info
        this.conditionEquips = [];
        this.conditionSets = {};
        this.conditionSkills = {};
        this.correspondJewels = {};
        this.usedEquips = {};

        let candidateEquips = {};
        let prevBundleList = {};
        let nextBundleList = {};
        let lastBundleList = {};
        let bundle = Misc.deepCopy(Constant.defaultBundle);

        let conditionExpectedValue = 0;
        let maxEquipsExpectedValue = {};

        sets.sort((a, b) => {
            let setInfoA = DataSet.setHelper.getInfo(a.name);
            let setInfoB = DataSet.setHelper.getInfo(b.name);

            return setInfoB.skills.pop().require - setInfoA.skills.pop().require;
        }).forEach((set) => {
            let setInfo = DataSet.setHelper.getInfo(set.name);

            this.conditionSets[set.name] = setInfo.skills[set.step - 1].require;
        });

        skills.sort((a, b) => {
            return b.level - a.level;
        }).forEach((skill) => {
            this.conditionSkills[skill.name] = skill.level;

            let jewelInfo = DataSet.jewelHelper.hasSkill(skill.name).getItems();
            let jewel = (0 !== jewelInfo.length) ? jewelInfo[0] : null;

            this.correspondJewels[skill.name] = (null !== jewel) ? {
                name: jewel.name,
                size: jewel.size,
            } : null;

            // Increase Expected Value
            if (null !== jewel) {
                conditionExpectedValue += skill.level * jewel.size; // 1, 2, 3
            } else {
                conditionExpectedValue += skill.level * 4;
            }
        });

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
                });
            }

            // Set Used Candidate Equip
            this.usedEquips[candidateEquip.name] = true;
        });

        // Reset Equip Count
        bundle.meta.euqipCount = 0;

        prevBundleList[this.generateBundleHash(bundle)] = bundle;

        let requireEquipCount = this.conditionEquips.length;
        let requireSkillCount = Object.keys(this.conditionSkills).length;

        console.log(this.conditionSkills);
        console.log(this.conditionEquips);
        console.log(this.correspondJewels);
        console.log(conditionExpectedValue);
        console.log(prevBundleList);

        // Create Candidate Equips
        if (0 !== Object.keys(this.conditionSets).length) {
            console.log('Create Candidate Equips with Set Equips');

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

            console.log('Set - helm', Object.keys(candidateEquips.helm).length, candidateEquips.helm);
            console.log('Set - chest', Object.keys(candidateEquips.chest).length, candidateEquips.chest);
            console.log('Set - arm', Object.keys(candidateEquips.arm).length, candidateEquips.arm);
            console.log('Set - waist', Object.keys(candidateEquips.waist).length, candidateEquips.waist);
            console.log('Set - leg', Object.keys(candidateEquips.leg).length, candidateEquips.leg);

            this.conditionEquips.forEach((equipType) => {
                if ('charm' === equipType) {
                    return;
                }

                console.log('Set - Bundle List:', equipType, Object.keys(prevBundleList).length);

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

            console.log('Set - BundleList:', Object.keys(prevBundleList).length);

            // Sets Require Equips is Overflow
            if (0 === Object.keys(prevBundleList).length) {
                return [];
            }
        }

        // Completed Skills
        console.log('Reset Completed Skills');

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

        // Create Candidate Equips
        console.log('Create Candidate Equips with Skill Equips');

        candidateEquips = {};

        this.conditionEquips.forEach((equipType) => {
            if (undefined === candidateEquips[equipType]) {
                candidateEquips[equipType] = {};
            }

            // Create Candidate Equips
            Object.keys(this.conditionSkills).forEach((skillName) => {
                let equips = null;

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
            });

            // Append Empty Candidate Equip
            let candidateEquip = Misc.deepCopy(Constant.defaultCandidateEquip);
            candidateEquip.type = equipType;

            candidateEquips[equipType]['empty'] = candidateEquip;
        });

        maxEquipsExpectedValue = this.cerateMaxEquipsExpectedValue(candidateEquips);

        console.log('Skill - helm', Object.keys(candidateEquips.helm).length, candidateEquips.helm);
        console.log('Skill - chest', Object.keys(candidateEquips.chest).length, candidateEquips.chest);
        console.log('Skill - arm', Object.keys(candidateEquips.arm).length, candidateEquips.arm);
        console.log('Skill - waist', Object.keys(candidateEquips.waist).length, candidateEquips.waist);
        console.log('Skill - leg', Object.keys(candidateEquips.leg).length, candidateEquips.leg);
        console.log('Skill - charm', Object.keys(candidateEquips.charm).length, candidateEquips.charm);
        console.log('Equips Expected Value', maxEquipsExpectedValue);

        // Create Next BundleList By Skill Equips
        console.log('Create Next BundleList By Skill Equips');

        this.conditionEquips.forEach((equipType) => {

            console.log('Skill - Bundle List:', equipType, Object.keys(prevBundleList).length);

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
                    if (false === this.isBundleHavaFuture(bundle, maxEquipsExpectedValue, conditionExpectedValue)) {
                        return;
                    }

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
                    if (requireEquipCount === bundle.meta.euqipCount) {

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

            console.log('Result - BundleList (Zero):', Object.keys(lastBundleList).length);
        });

        console.log('Skill - BundleList:', Object.keys(prevBundleList).length);

        // Find Completed Bundle into Last BundleList
        console.log('Find Completed Bundle');

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
            } else {
                nextBundleList[this.generateBundleHash(bundle)] = bundle;
            }
        });

        prevBundleList = nextBundleList;

        console.log('Result - BundleList (One):', Object.keys(lastBundleList).length);

        if (0 === Object.keys(lastBundleList).length) {
            console.log('Create Candidate Equips with Slot Equips');

            candidateEquips = {};

            this.conditionEquips.forEach((equipType) => {
                if ('charm' === equipType) {
                    return;
                }

                if (undefined === candidateEquips[equipType]) {
                    candidateEquips[equipType] = {};
                }

                let equips = DataSet.armorHelper.typeIs(equipType).rareIs(0).getItems();

                // Get Candidate Equips
                candidateEquips[equipType] = this.createCandidateEquips(equips, equipType, candidateEquips[equipType]);
            });

            maxEquipsExpectedValue = this.cerateMaxEquipsExpectedValue(candidateEquips);

            console.log('Slot - helm', Object.keys(candidateEquips.helm).length, candidateEquips.helm);
            console.log('Slot - chest', Object.keys(candidateEquips.chest).length, candidateEquips.chest);
            console.log('Slot - arm', Object.keys(candidateEquips.arm).length, candidateEquips.arm);
            console.log('Slot - waist', Object.keys(candidateEquips.waist).length, candidateEquips.waist);
            console.log('Slot - leg', Object.keys(candidateEquips.leg).length, candidateEquips.leg);
            console.log('Equips Expected Value', maxEquipsExpectedValue);

            // Create Next BundleList By Slot Equips
            console.log('Create Next BundleList By Slot Equips');

            this.conditionEquips.forEach((equipType) => {
                if ('charm' === equipType) {
                    return;
                }

                console.log('Slot - Bundle List:', equipType, Object.keys(prevBundleList).length);

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
                        if (false === this.isBundleHavaFuture(bundle, maxEquipsExpectedValue, conditionExpectedValue)) {
                            return;
                        }

                        // If Equips Is Full Then Do Fully Check
                        if (requireEquipCount === bundle.meta.euqipCount) {

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
            });

            console.log('Slot - BundleList:', Object.keys(prevBundleList).length);

            // Find Completed Bundle into Last BundleList
            console.log('Find Completed Bundle');

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

            console.log('Result - BundleList (Two):', Object.keys(lastBundleList).length);
        }

        lastBundleList = Object.values(lastBundleList).sort((a, b) => {
            let valueA = (8 - a.meta.euqipCount) * 1000 + a.defense;
            let valueB = (8 - b.meta.euqipCount) * 1000 + b.defense;

            return valueB - valueA;
        }).slice(0, 200);

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

    cerateMaxEquipsExpectedValue = (candidateEquips) => {
        let maxEquipsExpectedValue = {};

        Object.keys(candidateEquips).forEach((equipType) => {
            if (undefined === maxEquipsExpectedValue[equipType]) {
                maxEquipsExpectedValue[equipType] = 0;
            }

            Object.values(candidateEquips[equipType]).forEach((candidateEquip) => {
                if (maxEquipsExpectedValue[equipType] > candidateEquip.expectedValue) {
                    return;
                }

                maxEquipsExpectedValue[equipType] = candidateEquip.expectedValue;
            });
        });

        return maxEquipsExpectedValue
    };

    /**
     * Create Candidate Equips
     */
    createCandidateEquips = (equips, equipType, candidateEquips = {}) => {
        equips.forEach((equip) => {
            let candidateEquip = this.convertEquipToCandidateEquip(equip);
            candidateEquip.type = equipType;

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

            // Increase Expected Value
            if (undefined !== this.correspondJewels[skill.name]) {
                let jewel = this.correspondJewels[skill.name];

                if (null !== jewel) {
                    candidateEquip.expectedValue += skill.level * jewel.size; // 1, 2, 3
                } else {
                    candidateEquip.expectedValue += skill.level * 4;
                }
            }
        });

        equip.slots.forEach((slot) => {
            candidateEquip.ownSlotCount[slot.size] += 1;

            // Increase Expected Value
            candidateEquip.expectedValue += slot.size;
        });

        return candidateEquip;
    };

    isBundleHavaFuture = (bundle, maxEquipsExpectedValue, conditionExpectedValue) => {

        let currentExpectedValue = bundle.meta.expectedValue;

        if (currentExpectedValue >= conditionExpectedValue) {
            return true;
        }

        let isHaveFuture = false;

        Object.keys(maxEquipsExpectedValue).forEach((equipType) => {
            if (true === isHaveFuture) {
                return;
            }

            if (undefined === bundle.equips[equipType]
                || null !== bundle.equips[equipType]) {

                return;
            }

            currentExpectedValue += maxEquipsExpectedValue[equipType];

            if (currentExpectedValue >= conditionExpectedValue) {
                isHaveFuture = true;
            }
        });

        return isHaveFuture;
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
        }

        // Increase Equip Count
        bundle.meta.euqipCount += 1;

        // Increase Expected Value
        bundle.meta.expectedValue += candidateEquip.expectedValue;

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
            }, this.correspondJewels[skillName], true);

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
    addJewelToBundleBySpecificSkill = (bundle, skill, jewel, isAllowLargerSlot = false) => {
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

        if (true === isAllowLargerSlot) {
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
        } else {

            // Failed - No Slots
            if (0 === bundle.meta.remainingSlotCount[currentSlotSize]
                || diffSkillLevel > bundle.meta.remainingSlotCount[currentSlotSize]) {

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
        });

        return bundle;
    };
};
