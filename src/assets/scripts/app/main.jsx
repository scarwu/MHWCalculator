'use strict';
/**
 * Main Module
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Load Core Libraries
import Status from 'core/status';
import Event from 'core/event';

// Load Custom Libraries
import Misc from 'library/misc';
import DataSet from 'library/dataset';

// Load Constant & Lang
import Constant from 'constant';
import Lang from 'lang';

// Load Components
import EquipItemSelector from 'component/main/equipItemSelector';
import SkillItemSelector from 'component/main/skillItemSelector';
import EquipsDisplayer from 'component/main/equipsDisplayer';
import CharacterStatus from 'component/main/characterStatus';

export default class Main extends Component {

    // Default Props
    static defaultProps = {
        hash: null
    };

    // Initial State
    state = {
        skills: [],
        equips: Misc.deepCopy(Constant.defaultEquips),
        equipsLock: Misc.deepCopy(Constant.defaultEquipsLock),
        equipSelector: {},
        isShowEquipSelector: false,
        isShowSkillSelector: false
    };

    /**
     * Handle Functions
     */
    handleSkillLevelDown = (index) => {
        let skills = this.state.skills;
        let skill = DataSet.skillHelper.getInfo(skills[index].name);

        if (1 === skills[index].level) {
            return false;
        }

        skills[index].level -= 1;

        this.setState({
            skills: skills
        });
    };

    handleSkillLevelUp = (index) => {
        let skills = this.state.skills;
        let skill = DataSet.skillHelper.getInfo(skills[index].name);

        if (skill.list.length === skills[index].level) {
            return false;
        }

        skills[index].level += 1;

        this.setState({
            skills: skills
        });
    };

    handleEquipSearch = () => {
        let skills = this.state.skills;
        let equips = this.state.equips;
        let equipsLock = this.state.equipsLock;

        let requireEquips = [];
        let requireSkills = {};
        let generation = [];
        let bundle = Misc.deepCopy(Constant.defaultBundle);

        skills.sort((a, b) => {
            return b.level - a.level;
        }).map((skill) => {
            requireSkills[skill.name] = skill.level;
        });

        ['weapon', 'helm', 'chest', 'arm', 'waist', 'leg', 'charm'].map((equipType) => {
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

                equipInfo.skills.map((skill) => {
                    if (undefined === bundle.skills[skill.name]) {
                        bundle.skills[skill.name] = 0
                    }

                    bundle.skills[skill.name] += skill.level;
                });

                equipInfo.slots.map((slot) => {
                    bundle.slots[slot.size] += 1;

                    if (undefined === bundle.jewels[slot.name]) {
                        bundle.jewels[slot.name] = 0;
                    }

                    bundle.jewels[slot.name] += 1;
                });
            } else if ('helm' === equipType
                || 'chest' === equipType
                || 'arm' === equipType
                || 'waist' === equipType
                || 'leg' === equipType) {

                equipInfo = DataSet.armorHelper.getApplyedInfo(equips[equipType]);

                bundle.equips[equipType] = equipInfo.name;

                equipInfo.skills.map((skill) => {
                    if (undefined === bundle.skills[skill.name]) {
                        bundle.skills[skill.name] = 0
                    }

                    bundle.skills[skill.name] += skill.level;
                });

                equipInfo.slots.map((slot) => {
                    bundle.slots[slot.size] += 1;

                    if (undefined === bundle.jewels[slot.name]) {
                        bundle.jewels[slot.name] = 0;
                    }

                    bundle.jewels[slot.name] += 1;
                });
            } else if ('charm' === equipType) {
                equipInfo = DataSet.charmHelper.getApplyedInfo(equips.charm);

                bundle.equips[equipType] = equipInfo.name;

                equipInfo.skills.map((skill) => {
                    if (undefined === bundle.skills[skill.name]) {
                        bundle.skills[skill.name] = 0
                    }

                    bundle.skills[skill.name] += skill.level;
                });
            }
        });

        generation.push(bundle);

        console.log(requireSkills);
        console.log(requireEquips);
        console.log(generation);

        // let dataMap = {};

        // skills.sort((a, b) => {
        //     return b.level - a.level;
        // }).map((data) => {
        //     dataMap[data.name] = {
        //         level: data.level,
        //         equips: {
        //             helm: {},
        //             chest: {},
        //             arm: {},
        //             waist: {},
        //             leg: {},
        //             charm: {},
        //             jewel: {}
        //         }
        //     };

        //     DataSet.armorHelper.hasSkill(data.name).getItems().map((equip) => {
        //         equip.skills.map((skill) => {
        //             if (skill.name !== data.name) {
        //                 return false;
        //             }

        //             dataMap[data.name].equips[equip.type][equip.name] = skill.level;
        //         });
        //     });

        //     DataSet.charmHelper.hasSkill(data.name).getItems().map((equip) => {
        //         equip.skills.map((skill) => {
        //             if (skill.name !== data.name) {
        //                 return false;
        //             }

        //             dataMap[data.name].equips.charm[equip.name] = skill.level;
        //         });
        //     });

        //     DataSet.jewelHelper.hasSkill(data.name).getItems().map((equip) => {
        //         dataMap[data.name].equips.jewel[equip.name] = equip.skill.level;
        //     });
        // });

        // console.log(equipsLock);
        // console.log(dataMap);

        // Object.names(equips).map((equipType) => {
        //     let equip = equips[equipType];
        //     let isLock = equipsLock[equipType];

        //     if (null === equip.name) {
        //         return false;
        //     }

        //     if (false === isLock) {
        //         return false;
        //     }

        //     let equipInfo = null;

        //     if ('weapon' === equipType) {
        //         equipInfo = DataSet.weaponHelper.getApplyedInfo(equips.weapon);
        //         equipInfo.skills.map((skill) => {
        //             if (undefined === dataMap[skill.name]) {
        //                 return false;
        //             }

        //             dataMap[skill.name].level -= skill.level;

        //             if (0 >= dataMap[skill.name].level) {
        //                 delete dataMap[skill.name];
        //             }
        //         });
        //     } else if ('helm' === equipType
        //         || 'chest' === equipType
        //         || 'arm' === equipType
        //         || 'waist' === equipType
        //         || 'leg' === equipType) {

        //         equipInfo = DataSet.armorHelper.getApplyedInfo(equips[equipType]);

        //         Object.names(dataMap).map((skillName) => {
        //             delete dataMap[skillName].equips[equipType];
        //         });

        //         equipInfo.skills.map((skill) => {
        //             if (undefined === dataMap[skill.name]) {
        //                 return false;
        //             }

        //             dataMap[skill.name].level -= skill.level;

        //             if (0 >= dataMap[skill.name].level) {
        //                 delete dataMap[skill.name];
        //             }
        //         });
        //     } else if ('charm' === equipType) {
        //         equipInfo = DataSet.charmHelper.getApplyedInfo(equips.charm);

        //         Object.names(dataMap).map((skillName) => {
        //             delete dataMap[skillName][equipType];
        //         });

        //         equipInfo.skills.map((skill) => {
        //             delete dataMap[skill.name].equips[equipType];
        //         });
        //     }
        // });

        // console.log(dataMap);
    };

    handleEquipsLockToggle = (equipType) => {
        let equipsLock = this.state.equipsLock;

        equipsLock[equipType] = !equipsLock[equipType];

        this.setState({
            equipsLock: equipsLock
        });
    };

    handleSkillSelectorOpen = (data) => {
        this.setState({
            isShowSkillSelector: true
        });
    };

    handleSkillSelectorClose = () => {
        this.setState({
            isShowSkillSelector: false
        });
    };

    handleSkillSelectorPickup = (data) => {
        let skills = this.state.skills;

        skills.push({
            name: data.skillName,
            level: 1
        });

        this.setState({
            skills: skills
        });
    };

    handleSkillRemove = (index) => {
        let skills = this.state.skills;

        delete skills[index];

        this.setState({
            skills: skills
        });
    };

    handleEquipSelectorOpen = (data) => {
        this.setState({
            isShowEquipSelector: true,
            equipSelector: data
        });
    };

    handleEquipSelectorClose = () => {
        this.setState({
            isShowEquipSelector: false
        });
    };

    handleEquipSelectorPickup = (data) => {
        let equips = this.state.equips;
        let equipsLock = this.state.equipsLock;

        if (undefined !== data.enhanceIndex) {
            if ('object' !== typeof equips.weapon.enhanceNames
                || null === equips.weapon.enhanceNames) {

                equips.weapon.enhanceNames = {};
            }

            equips.weapon.enhanceNames[data.enhanceIndex] = data.enhanceName;
        } else if (undefined !== data.slotIndex) {
            if ('object' !== typeof equips[data.equipType].slotNames
                || null === equips.weapon.slotNames) {

                equips[data.equipType].slotNames = {};
            }

            equips[data.equipType].slotNames[data.slotIndex] = data.slotName;
        } else if ('weapon' === data.equipType) {
            equips.weapon = {
                name: data.equipName,
                enhanceNames: {},
                slotNames: {}
            };

            equipsLock.weapon = false;
        } else if ('helm' === data.equipType
            || 'chest' === data.equipType
            || 'arm' === data.equipType
            || 'waist' === data.equipType
            || 'leg' === data.equipType) {

            equips[data.equipType] = {
                name: data.equipName,
                slotNames: {}
            };

            equipsLock[data.equipType] = false;
        } else if ('charm' === data.equipType) {
            equips.charm = {
                name: data.equipName
            };

            equipsLock.charm = false;
        }

        this.setState({
            equips: equips,
            equipsLock: equipsLock
        }, () => {
            this.refershUrlHash();
        });
    };

    refershUrlHash = () => {
        let equips = Misc.deepCopy(this.state.equips);
        let base64 = Misc.base64.encode(JSON.stringify(equips));

        window.location.hash = `#/${base64}`;
    };

    /**
     * Lifecycle Functions
     */
    componentWillMount () {
        let base64 = this.props.match.params.base64;
        let equips = (undefined !== base64)
            ? JSON.parse(Misc.base64.decode(base64))
            : Misc.deepCopy(Constant.testEquipsSetting[0]);
        let skills = Misc.deepCopy(Constant.defaultSkills);

        this.setState({
            equips: equips,
            skills: skills
        }, () => {
            this.refershUrlHash();
        });
    }

    /**
     * Render Functions
     */
    renderSelectedSkillItems = () => {
        let skills = this.state.skills;

        return skills.map((data, index) => {
            let skill = DataSet.skillHelper.getInfo(data.name);

            return (
                <div key={skill.name} className="row mhwc-item">
                    <div className="col-12 mhwc-name">
                        <span>
                            {skill.name}
                            &nbsp;
                            Lv.{data.level} / {skill.list.length}
                        </span>

                        <div className="mhwc-icons_bundle">
                            <a className="mhwc-icon" onClick={() => {this.handleSkillLevelDown(index)}}>
                                <i className="fa fa-minus"></i>
                            </a>
                            <a className="mhwc-icon" onClick={() => {this.handleSkillLevelUp(index)}}>
                                <i className="fa fa-plus"></i>
                            </a>
                            <a className="mhwc-icon" onClick={() => {this.handleSkillRemove(index)}}>
                                <i className="fa fa-times"></i>
                            </a>
                        </div>
                    </div>
                    <div className="col-12 mhwc-value">
                        <span>{skill.list[data.level - 1].description}</span>
                    </div>
                </div>
            );
        });
    };

    render () {
        return (
            <div id="main" className="container-fluid">
                <div className="row mhwc-header">
                    <a href="./">
                        <h1>Monster Hunter: World Calculator</h1>
                    </a>
                </div>

                <div className="row mhwc-container">
                    <div className="col mhwc-skills">
                        <div className="mhwc-section_name">
                            <span>已選技能</span>
                        </div>

                        <div className="row mhwc-function_bar">
                            <div className="col-6">
                                <a onClick={this.handleSkillSelectorOpen}>
                                    <i className="fa fa-plus"></i>
                                </a>
                            </div>
                            <div className="col-6">
                                <a onClick={this.handleEquipSearch}>
                                    <i className="fa fa-search"></i>
                                </a>
                            </div>
                        </div>

                        <div className="mhwc-list">
                            {this.renderSelectedSkillItems()}
                        </div>
                    </div>

                    <div className="col mhwc-bundles">
                        <div className="mhwc-section_name">
                            <span>備選裝備</span>
                        </div>

                        <div className="mhwc-list">

                        </div>
                    </div>

                    <div className="col mhwc-equips">
                        <div className="mhwc-section_name">
                            <span>已選裝備</span>
                        </div>

                        <div className="mhwc-list">
                            <EquipsDisplayer equips={this.state.equips}
                                equipsLock={this.state.equipsLock}
                                onToggleEquipsLock={this.handleEquipsLockToggle}
                                onOpenSelector={this.handleEquipSelectorOpen}
                                onPickup={this.handleEquipSelectorPickup} />
                        </div>
                    </div>

                    <div className="col mhwc-status">
                        <div className="mhwc-section_name">
                            <span>狀態</span>
                        </div>

                        <div className="mhwc-list">
                            <CharacterStatus equips={this.state.equips} />
                        </div>
                    </div>
                </div>

                <div className="row mhwc-footer">
                    <div className="col-12">
                        <span>Copyright (c) Scar Wu</span>
                    </div>

                    <div className="col-12">
                        <a href="//scar.tw" target="_blank">
                            <span>Blog</span>
                        </a>
                        &nbsp;|&nbsp;
                        <a href="https://github.com/scarwu/MHWCalculator" target="_blank">
                            <span>Github</span>
                        </a>
                    </div>
                </div>

                {this.state.isShowSkillSelector ? (
                    <SkillItemSelector data={this.state.skills}
                        onPickup={this.handleSkillSelectorPickup}
                        onClose={this.handleSkillSelectorClose} />
                ) : false}

                {this.state.isShowEquipSelector ? (
                    <EquipItemSelector data={this.state.equipSelector}
                        onPickup={this.handleEquipSelectorPickup}
                        onClose={this.handleEquipSelectorClose} />
                ) : false}
            </div>
        );
    }
}
