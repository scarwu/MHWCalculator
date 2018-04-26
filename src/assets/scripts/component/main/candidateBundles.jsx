'use strict';
/**
 * Candidate Bundles
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React, { Component } from 'react';
import MD5 from 'md5';

// Load Core Libraries
import Event from 'core/event';

// Load Custom Libraries
import Misc from 'library/misc';
import DataSet from 'library/dataset';

// Load Constant & Lang
import Constant from 'constant';
import Lang from 'lang';

export default class CandidateBundles extends Component {

    // Default Props
    static defaultProps = {
        data: {},
        onPickup: (data) => {}
    };

    // Initial State
    state = {
        data: null,
        bundleList: []
    };

    /**
     * Handle Functions
     */
    handleBundlePickup = (index) => {
        this.props.onPickup(bundleList[index]);
    };

    bundleSearch = () => {
        let data = this.state.data;

        if (null === data) {
            return false;
        }

        let skills = data.skills;
        let equips = data.equips;
        let equipsLock = data.equipsLock;

        // Create 1st Generation & Extra Info
        let requireEquips = [];
        let requireSkills = {};
        let pervGeneration = {};
        let bundle = Misc.deepCopy(Constant.defaultBundle);

        skills.sort((a, b) => {
            return b.level - a.level;
        }).forEach((skill) => {
            requireSkills[skill.name] = skill.level;
        });

        ['weapon', 'helm', 'chest', 'arm', 'waist', 'leg', 'charm'].forEach((equipType) => {
            if (false === equipsLock[equipType]) {
                if ('weapon' !== equipType) {
                    requireEquips.push(equipType);
                }

                return false;
            }

            let equipInfo = null;

            if ('weapon' === equipType) {
                equipInfo = DataSet.weaponHelper.getApplyedInfo(equips.weapon);

                bundle.equips[equipType] = equipInfo.name;

                equipInfo.skills.forEach((skill) => {
                    if (undefined === bundle.skills[skill.name]) {
                        bundle.skills[skill.name] = 0
                    }

                    bundle.skills[skill.name] += skill.level;
                });

                equipInfo.slots.forEach((slot) => {
                    if (null === slot.name) {
                        bundle.remainingSlotCount[slot.size] += 1;
                    } else {
                        if (undefined === bundle.jewels[slot.name]) {
                            bundle.jewels[slot.name] = 0;
                        }

                        bundle.jewels[slot.name] += 1;
                    }
                });
            } else if ('helm' === equipType
                || 'chest' === equipType
                || 'arm' === equipType
                || 'waist' === equipType
                || 'leg' === equipType) {

                equipInfo = DataSet.armorHelper.getApplyedInfo(equips[equipType]);

                bundle.equips[equipType] = equipInfo.name;

                equipInfo.skills.forEach((skill) => {
                    if (undefined === bundle.skills[skill.name]) {
                        bundle.skills[skill.name] = 0
                    }

                    bundle.skills[skill.name] += skill.level;
                });

                equipInfo.slots.forEach((slot) => {
                    if (null === slot.name) {
                        bundle.remainingSlotCount[slot.size] += 1;
                    } else {
                        if (undefined === bundle.jewels[slot.name]) {
                            bundle.jewels[slot.name] = 0;
                        }

                        bundle.jewels[slot.name] += 1;
                    }
                });
            } else if ('charm' === equipType) {
                equipInfo = DataSet.charmHelper.getApplyedInfo(equips.charm);

                bundle.equips[equipType] = equipInfo.name;

                equipInfo.skills.forEach((skill) => {
                    if (undefined === bundle.skills[skill.name]) {
                        bundle.skills[skill.name] = 0
                    }

                    bundle.skills[skill.name] += skill.level;
                });
            }
        });

        pervGeneration[this.generateBundleHash(bundle)] = bundle;

        let requireEquipsCount = requireEquips.length;
        let requireSkillsCount = Object.keys(requireSkills).length;

        console.log(requireSkills);
        console.log(requireEquips);
        console.log(pervGeneration);

        // Create Next Generation with Skill Equips
        console.log('Create Next Generation with Skill Equips');

        let firstSkillName = Object.keys(requireSkills).shift();
        let lastSkillName = Object.keys(requireSkills).pop();
        let usedSkills = {};

        Object.keys(requireSkills).forEach((skillName, index) => {
            if (2 < index) {
                return false;
            }

            let skillLevel = requireSkills[skillName];

            // Set Past Skills
            usedSkills[skillName] = skillLevel;

            requireEquips.forEach((equipType) => {

                // Get Candidate Equips
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

                let candidateEquips = this.createCandidateEquips(equips, equipType);

                // Add Empty Equip
                if ('charm' === equipType &&
                    skillName === lastSkillName) {

                    // pass
                } else {
                    let candidateEquip = Misc.deepCopy(Constant.defaultCandidateEquip);

                    candidateEquip.type = equipType;

                    candidateEquips.push(candidateEquip);
                }

                if (0 === candidateEquips.length) {
                    return false;
                }

                // Create Next Generation By Skill Equips
                pervGeneration = Misc.deepCopy(this.createNextGenerationBySkillEquips(
                    pervGeneration, equipType, candidateEquips,
                    skillName, skillLevel
                ));

                // Create Next Generation By Skills
                pervGeneration = Misc.deepCopy(this.createNextGenerationBySkills(
                    pervGeneration, usedSkills, requireEquipsCount
                ));
            });

            // Create Next Generation By Skills
            // pervGeneration = Misc.deepCopy(this.createNextGenerationBySkills(
            //     pervGeneration, usedSkills
            // ));

            console.log(Object.keys(pervGeneration).length, pervGeneration);
        });

        // Devide Generation
        console.log('Devide Generation');

        let completedGeneration = {};
        let incompletedGeneration = {};

        Object.keys(pervGeneration).forEach((hash) => {
            let bundle = Misc.deepCopy(pervGeneration[hash]);

            if (Object.keys(usedSkills).length === bundle.completedSkillCount) {
                completedGeneration[hash] = bundle;
            } else {
                incompletedGeneration[hash] = bundle;
            }
        });

        if (0 === Object.keys(completedGeneration).length) {
            pervGeneration = Misc.deepCopy(incompletedGeneration);

            // Create Next Generation with Slot Equips
            requireEquips.forEach((equipType) => {
                if ('charm' === equipType) {
                    return false;
                }

                // Get Candidate Equips
                let equips = DataSet.armorHelper.typeIs(equipType).rareIs(0).getItems();
                let candidateEquips = this.createCandidateEquips(equips, equipType);

                if (0 === candidateEquips.length) {
                    return false;
                }

                // Create Next Generation By Slot Equips
                pervGeneration = Misc.deepCopy(this.createNextGenerationBySlotEquips(
                    pervGeneration, equipType, candidateEquips
                ));

                // Create Next Generation By Skills
                pervGeneration = Misc.deepCopy(this.createNextGenerationBySkills(
                    pervGeneration, usedSkills, requireEquipsCount
                ));
            });

            // Create Next Generation By Skills
            pervGeneration = Misc.deepCopy(this.createNextGenerationBySkills(
                pervGeneration, usedSkills
            ));

            Object.keys(pervGeneration).forEach((hash) => {
                let bundle = Misc.deepCopy(pervGeneration[hash]);

                if (Object.keys(usedSkills).length === bundle.completedSkillCount) {
                    completedGeneration[hash] = bundle;
                }
            });
        }

        console.log('Completed Generation:', Object.keys(completedGeneration).length);
        console.log('In-Completed Generation:', Object.keys(incompletedGeneration).length);

        pervGeneration = Misc.deepCopy(completedGeneration);

        console.log('Final Generations:', Object.keys(pervGeneration).length)

        let lastGeneration = Object.values(pervGeneration).sort((a, b) => {
            let valueA = (7 - a.euqipCount) * 1000 + a.defense;
            let valueB = (7 - b.euqipCount) * 1000 + b.defense;

            return valueB - valueA;
        }).slice(0, 100);

        console.log(lastGeneration);
    };

    generateBundleHash = (bundle) => {
        return MD5(JSON.stringify({
            equips: bundle.equips,
            jewels: bundle.jewels
        }));
    };

    convertEquipToCandidateEquip = (equip) => {
        let candidateEquip = Misc.deepCopy(Constant.defaultCandidateEquip);

        // Set Name, Type & Defense
        candidateEquip.name = equip.name;
        candidateEquip.type = equip.type;
        candidateEquip.defense = (undefined !== equip.defense) ? equip.defense : 0;

        // Set Skills
        if (undefined === equip.skills) {
            equip.skills = [];
        }

        equip.skills.forEach((skill) => {
            candidateEquip.skills[skill.name] = skill.level;
        });

        // Set Slots
        if (undefined === equip.slots) {
            equip.slots = [];
        }

        equip.slots.forEach((slot) => {
            candidateEquip.ownSlotCount[slot.size] += 1;
        });

        return candidateEquip;
    };

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

        Object.keys(candidateEquip.skills).forEach((skillName) => {
            let skillLevel = candidateEquip.skills[skillName];

            if (undefined === bundle.skills[skillName]) {
                bundle.skills[skillName] = 0
            }

            bundle.skills[skillName] += skillLevel;
        });

        for (let size = 1; size <= 3; size++) {
            bundle.remainingSlotCount[size] += candidateEquip.ownSlotCount[size];
        }

        bundle.euqipCount += 1;

        return bundle;
    };

    createCandidateEquips = (equips, equipType) => {
        let candidateEquips = [];

        equips.forEach((equip) => {
            equip.type = equipType;

            let candidateEquip = this.convertEquipToCandidateEquip(equip);

            candidateEquips.push(candidateEquip);
        });

        return candidateEquips;
    };

    createNextGenerationBySkillEquips = (pervGeneration, equipType, candidateEquips, skillName, skillLevel) => {
        let nextGeneration = {};

        console.log(
            'CreateNextGenerationBySkillEquips:',
            Object.keys(pervGeneration).length,
            equipType,
            candidateEquips,
            skillName,
            skillLevel
        );

        candidateEquips.forEach((candidateEquip) => {
            Object.keys(pervGeneration).forEach((hash) => {
                let bundle = Misc.deepCopy(pervGeneration[hash]);

                if (undefined === bundle.equips[equipType]) {
                    bundle.equips[equipType] = null;
                }

                if (undefined === bundle.skills[skillName]) {
                    bundle.skills[skillName] = 0;
                }

                if (null !== bundle.equips[equipType]
                    || skillLevel === bundle.skills[skillName]) {

                    nextGeneration[hash] = bundle;

                    return false;
                }

                bundle = this.addCandidateEquipToBundle(bundle, candidateEquip);

                if (skillLevel < bundle.skills[skillName]) {
                    bundle = Misc.deepCopy(pervGeneration[hash]);
                }

                if (skillLevel === bundle.skills[skillName]) {
                    bundle.completedSkillCount += 1;
                }

                nextGeneration[this.generateBundleHash(bundle)] = bundle;
            });
        });

        return nextGeneration;
    };

    createNextGenerationBySlotEquips = (pervGeneration, equipType, candidateEquips) => {
        let nextGeneration = {};

        console.log(
            'CreateNextGenerationBySlotEquips:',
            Object.keys(pervGeneration).length,
            equipType,
            candidateEquips
        );

        candidateEquips.forEach((candidateEquip) => {
            Object.keys(pervGeneration).forEach((hash) => {
                let bundle = Misc.deepCopy(pervGeneration[hash]);

                if (undefined === bundle.equips[equipType]) {
                    bundle.equips[equipType] = null;
                }

                if (null !== bundle.equips[equipType]) {
                    nextGeneration[hash] = bundle;

                    return false;
                }

                bundle = this.addCandidateEquipToBundle(bundle, candidateEquip);

                nextGeneration[this.generateBundleHash(bundle)] = bundle;
            });
        });

        return nextGeneration;
    };

    addJewelToBundleSpecificSkill = (bundle, skillName, skillLevel) => {
        let skillDiffLevel = skillLevel - bundle.skills[skillName];

        if (0 === skillDiffLevel) {
            return bundle;
        }

        // Get Jewel
        let jewel = DataSet.jewelHelper.hasSkill(skillName).getItems();
        jewel = (0 !== jewel.length) ? jewel[0] : null;

        if (null === jewel && 0 !== skillDiffLevel) {
            // console.log('無法提昇: 沒珠');

            return false;
        }

        if (skillDiffLevel > bundle.remainingSlotCount[jewel.size]) {
            // console.log('無法提昇: 沒槽');

            return false;
        }

        if (undefined === bundle.skills[skillName]) {
            bundle.skills[skillName] = 0;
        }

        if (undefined === bundle.jewels[jewel.name]) {
            bundle.jewels[jewel.name] = 0;
        }

        bundle.skills[skillName] += skillDiffLevel;
        bundle.jewels[jewel.name] += skillDiffLevel;
        bundle.remainingSlotCount[jewel.size] -= skillDiffLevel;

        if (skillLevel === bundle.skills[skillName]) {
            bundle.completedSkillCount += 1;
        }

        return bundle;
    };

    createNextGenerationBySkills = (pervGeneration, skills, requireEquipsCount = null) => {
        let nextGeneration = {};

        console.log(
            'CreateNextGenerationBySkills:',
            Object.keys(pervGeneration).length,
            Object.keys(skills).join(' '),
            requireEquipsCount
        );

        Object.keys(pervGeneration).forEach((hash) => {
            let bundle = Misc.deepCopy(pervGeneration[hash]);

            // In-completed Bundle force into Next Generation
            if (null !== requireEquipsCount
                && requireEquipsCount !== bundle.euqipCount) {

                nextGeneration[hash] = bundle;

                return false;
            }

            let isSkip = false;

            Object.keys(skills).forEach((skillName) => {
                if (true === isSkip) {
                    return false;
                }

                let skillLevel = skills[skillName];

                bundle = this.addJewelToBundleSpecificSkill(bundle, skillName, skillLevel);

                if (false === bundle) {
                    isSkip = true;
                }
            });

            if (false === isSkip) {
                nextGeneration[this.generateBundleHash(bundle)] = bundle;
            }
        });

        return nextGeneration;
    };

    /**
     * Lifecycle Functions
     */
    componentWillMount () {
        this.setState({
            data: this.props.data
        }, () => {
            this.bundleSearch();
        });
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            data: nextProps.data
        }, () => {
            this.bundleSearch();
        });
    }
    /**
     * Render Functions
     */
    render () {
        return (
            <div className="mhwc-candidate_bundles">

            </div>
        );
    }
}
