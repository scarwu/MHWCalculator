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

var defaultCandidateEquip = {
    name: null,
    defense: 0,
    skillLevel: 0,
    slotSizeCount: {
        1: 0,
        2: 0,
        3: 0
    }
};

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
        let nextGeneration = {};
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
                    bundle.lostPartCount += 1;
                }

                return false;
            }

            let equipInfo = null;

            if ('weapon' === equipType) {
                equipInfo = DataSet.weaponHelper.getApplyedInfo(equips.weapon);

                bundle.equips[equipType] = equipInfo.name;

                equipInfo.skills.forEach((skill) => {
                    if (undefined === bundle.skillLevel[skill.name]) {
                        bundle.skillLevel[skill.name] = 0
                    }

                    bundle.skillLevel[skill.name] += skill.level;
                });

                equipInfo.slots.forEach((slot) => {
                    if (null === slot.name) {
                        bundle.slotSizeCount[slot.size] += 1;
                    } else {
                        if (undefined === bundle.jewelCount[slot.name]) {
                            bundle.jewelCount[slot.name] = 0;
                        }

                        bundle.jewelCount[slot.name] += 1;
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
                    if (undefined === bundle.skillLevel[skill.name]) {
                        bundle.skillLevel[skill.name] = 0
                    }

                    bundle.skillLevel[skill.name] += skill.level;
                });

                equipInfo.slots.forEach((slot) => {
                    if (null === slot.name) {
                        bundle.slotSizeCount[slot.size] += 1;
                    } else {
                        if (undefined === bundle.jewelCount[slot.name]) {
                            bundle.jewelCount[slot.name] = 0;
                        }

                        bundle.jewelCount[slot.name] += 1;
                    }
                });
            } else if ('charm' === equipType) {
                equipInfo = DataSet.charmHelper.getApplyedInfo(equips.charm);

                bundle.equips[equipType] = equipInfo.name;

                equipInfo.skills.forEach((skill) => {
                    if (undefined === bundle.skillLevel[skill.name]) {
                        bundle.skillLevel[skill.name] = 0
                    }

                    bundle.skillLevel[skill.name] += skill.level;
                });
            }
        });

        pervGeneration[this.generateBundleHash(bundle)] = bundle;

        console.log(requireSkills);
        console.log(requireEquips);
        console.log(pervGeneration);

        // Create Next Generation with Skill Equips
        console.log('Create Next Generation with Skill Equips');

        let firstSkillName = Object.keys(requireSkills).shift();
        let lastSkillName = Object.keys(requireSkills).pop();
        let usedSkills = {};

        Object.keys(requireSkills).forEach((skillName, index) => {
            if (3 < index) {
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

                let candidateEquips = this.createCandidateEquips(equips, skillName);

                // Add Empty Equip
                if ('charm' === equipType &&
                    skillName === lastSkillName) {

                    // pass
                } else {
                    candidateEquips.push(Misc.deepCopy(defaultCandidateEquip));
                }

                if (0 === candidateEquips.length) {
                    return false;
                }

                // Create Next Generation
                nextGeneration = this.createNextGenerationBySkillEquips(
                    pervGeneration, equipType, candidateEquips,
                    skillName, skillLevel
                );

                if (0 < Object.keys(nextGeneration).length) {
                    pervGeneration = Misc.deepCopy(nextGeneration);
                }

                nextGeneration = this.createNextGenerationBySkills(pervGeneration, usedSkills, true);

                if (0 < Object.keys(nextGeneration).length) {
                    pervGeneration = Misc.deepCopy(nextGeneration);
                }
            });

            nextGeneration = this.createNextGenerationBySkills(pervGeneration, usedSkills, false);

            if (0 < Object.keys(nextGeneration).length) {
                pervGeneration = Misc.deepCopy(nextGeneration);
            }
        });

        // Devide Generation
        console.log('Devide Generation');

        let completedGeneration = {};
        let incompletedGeneration = {};

        Object.keys(pervGeneration).forEach((hash) => {
            let bundle = Misc.deepCopy(pervGeneration[hash]);

            if (0 === bundle.lostPartCount) {
                completedGeneration[hash] = bundle;
            } else {
                incompletedGeneration[hash] = bundle;
            }
        });

        console.log('Compeleted Generation:', Object.keys(completedGeneration).length);
        console.log('In-Compeleted Generation:', Object.keys(incompletedGeneration).length);

        if (0 < Object.keys(completedGeneration).length) {
            pervGeneration = Misc.deepCopy(completedGeneration);
        } else {
            pervGeneration = Misc.deepCopy(incompletedGeneration);

            // Create Next Generation with Slot Equips
            requireEquips.forEach((equipType) => {
                if ('charm' === equipType) {
                    return false;
                }

                // Get Candidate Equips
                let equips = DataSet.armorHelper.typeIs(equipType).rareIs(0).getItems();
                let candidateEquips = this.createCandidateEquips(equips, null);

                if (0 === candidateEquips.length) {
                    return false;
                }

                // Create Next Generation
                nextGeneration = this.createNextGenerationBySlotEquips(
                    pervGeneration, equipType, candidateEquips
                );

                if (0 < Object.keys(nextGeneration).length) {
                    pervGeneration = Misc.deepCopy(nextGeneration);
                }

                nextGeneration = this.createNextGenerationBySkills(pervGeneration, usedSkills);

                if (0 < Object.keys(nextGeneration).length) {
                    pervGeneration = Misc.deepCopy(nextGeneration);
                }
            });
        }

        // Last Clean with In-completed Bundle
        console.log('Last Clean with In-completed Bundle');

        nextGeneration = {};

        Object.keys(pervGeneration).forEach((hash) => {
            let bundle = Misc.deepCopy(pervGeneration[hash]);

            if (0 !== bundle.lostPartCount) {
                return false;
            }

            nextGeneration[hash] = bundle;
        });

        if (0 < Object.keys(nextGeneration).length) {
            pervGeneration = Misc.deepCopy(nextGeneration);
        }

        console.log('Final Generations:', Object.keys(pervGeneration).length)

        let lastGeneration = Object.values(pervGeneration).sort((a, b) => {
            return b.defense - a.defense;
        }).slice(0, 100);

        console.log(lastGeneration);
    };

    generateBundleHash = (bundle) => {
        return MD5(JSON.stringify({
            equips: bundle.equips,
            jewelCount: bundle.jewelCount
        }));
    };

    createCandidateEquips = (equips, skillName) => {
        let candidateEquips = []

        equips.forEach((equip) => {
            let candidateEquip = Misc.deepCopy(defaultCandidateEquip);

            // Set Name & Defense
            candidateEquip.name = equip.name;
            candidateEquip.defense = equip.defense;

            // Set Skills
            if (null !== skillName) {
                equip.skills.forEach((skill) => {
                    if (skill.name !== skillName) {
                        return false;
                    }

                    candidateEquip.skillLevel = skill.level;
                });
            }

            // Set Slots
            if (undefined !== equip.slots) {
                equip.slots.forEach((slot) => {
                    candidateEquip.slotSizeCount[slot.size] += 1;
                });
            }

            candidateEquips.push(candidateEquip);
        });

        return candidateEquips;
    };

    createNextGenerationBySkillEquips = (pervGeneration, equipType, candidateEquips, skillName, skillLevel) => {
        let nextGeneration = {};

        console.log('SkillEquips:', Object.keys(pervGeneration).length, equipType, candidateEquips, skillName, skillLevel);

        candidateEquips.forEach((equip) => {
            Object.keys(pervGeneration).forEach((hash) => {
                let bundle = Misc.deepCopy(pervGeneration[hash]);

                if (undefined === bundle.equips[equipType]) {
                    bundle.equips[equipType] = null;
                }

                if (undefined === bundle.skillLevel[skillName]) {
                    bundle.skillLevel[skillName] = 0;
                }

                if (bundle.skillLevel[skillName] < skillLevel) {
                    if (null !== bundle.equips[equipType]) {
                        nextGeneration[hash] = bundle;

                        return false;
                    }

                    if (null !== equip.name) {
                        bundle.equips[equipType] = equip.name;
                        bundle.defense += equip.defense;

                        if (undefined === bundle.skillLevel[skillName]) {
                            bundle.skillLevel[skillName] = 0
                        }

                        bundle.skillLevel[skillName] += equip.skillLevel;

                        for (let size = 1; size <= 3; size++) {
                            bundle.slotSizeCount[size] += equip.slotSizeCount[size];
                        }

                        bundle.lostPartCount -= 1;
                        bundle.isCompleted = false;
                    }

                    if (bundle.skillLevel[skillName] <= skillLevel) {
                        nextGeneration[this.generateBundleHash(bundle)] = bundle;
                    }
                }
            });
        });

        return nextGeneration;
    };

    createNextGenerationBySlotEquips = (pervGeneration, equipType, candidateEquips) => {
        let nextGeneration = {};

        console.log('SlotEquips:', Object.keys(pervGeneration).length, equipType, candidateEquips);

        candidateEquips.forEach((equip) => {
            Object.keys(pervGeneration).forEach((hash) => {
                let bundle = Misc.deepCopy(pervGeneration[hash]);

                if (undefined === bundle.equips[equipType]) {
                    bundle.equips[equipType] = null;
                }

                if (null !== bundle.equips[equipType]) {
                    nextGeneration[hash] = bundle;

                    return false;
                }

                if (null !== equip.name) {
                    bundle.equips[equipType] = equip.name;
                    bundle.defense += equip.defense;

                    for (let size = 1; size <= 3; size++) {
                        bundle.slotSizeCount[size] += equip.slotSizeCount[size];
                    }

                    bundle.lostPartCount -= 1;
                    bundle.isCompleted = false;
                }

                nextGeneration[this.generateBundleHash(bundle)] = bundle;
            });
        });

        return nextGeneration;
    };

    createNextGenerationBySkills = (pervGeneration, skills, withPartCheck = false) => {
        let nextGeneration = {};

        console.log('Skills:', Object.keys(pervGeneration).length, Object.keys(skills).join(' '));

        Object.keys(pervGeneration).forEach((hash) => {
            let bundle = Misc.deepCopy(pervGeneration[hash]);

            // In-completed Bundle force into Next Generation
            if (true === withPartCheck && 0 !== bundle.lostPartCount) {
                nextGeneration[hash] = bundle;

                return false;
            }

            let isSkip = false;

            Object.keys(skills).forEach((skillName) => {
                if (true === isSkip) {
                    return false;
                }

                let skillLevel = skills[skillName];
                let skillDiffLevel = skillLevel - bundle.skillLevel[skillName];

                // Get Jewel
                let jewel = DataSet.jewelHelper.hasSkill(skillName).getItems();
                jewel = (0 !== jewel.length) ? jewel[0] : null;

                if (null === jewel && 0 !== skillDiffLevel) {
                    isSkip = true;
                    console.log('無法提昇: 沒珠');

                    return false;
                }

                if (skillDiffLevel > bundle.slotSizeCount[jewel.size]) {
                    isSkip = true;
                    console.log('無法提昇: 沒槽');

                    return false;
                }

                if (undefined === bundle.skillLevel[skillName]) {
                    bundle.skillLevel[skillName] = 0;
                }

                if (undefined === bundle.jewelCount[jewel.name]) {
                    bundle.jewelCount[jewel.name] = 0;
                }

                bundle.skillLevel[skillName] += skillDiffLevel;
                bundle.jewelCount[jewel.name] += skillDiffLevel;
                bundle.slotSizeCount[jewel.size] -= skillDiffLevel;
            });

            if (false === isSkip) {
                bundle.isCompleted = true;
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
