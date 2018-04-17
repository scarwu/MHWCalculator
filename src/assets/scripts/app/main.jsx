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
        equipSelector: {},
        isShowEquipSelector: false,
        isShowSkillSelector: false
    };

    /**
     * Handle Functions
     */
    handleSkillLevelDown = (index) => {
        let skills = this.state.skills;
        let skill = DataSet.skillHelper.getInfo(skills[index].key);

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
        let skill = DataSet.skillHelper.getInfo(skills[index].key);

        if (skill.list.length === skills[index].level) {
            return false;
        }

        skills[index].level += 1;

        this.setState({
            skills: skills
        });
    };

    handleSkillMoveUp = (index) => {
        let skills = this.state.skills;

        if (0 === index) {
            return false;
        }

        [skills[index], skills[index - 1]] = [skills[index - 1], skills[index]];

        this.setState({
            skills: skills
        });
    };

    handleSkillMoveDown = (index) => {
        let skills = this.state.skills;

        if (skills.length - 1 === index) {
            return false;
        }

        [skills[index], skills[index + 1]] = [skills[index + 1], skills[index]];

        this.setState({
            skills: skills
        });
    };

    handleEquipSearch = () => {
        let skills = this.state.skills;
        let equips = this.state.equips;
        let dataMap = {};

        skills.map((data) => {
            dataMap[data.key] = {
                level: data.level,
                equips: {
                    helm: {},
                    chest: {},
                    arm: {},
                    waist: {},
                    leg: {},
                    charm: {},
                    jewel: {}
                }
            };

            DataSet.armorHelper.hasSkill(data.key).getItems().map((equip) => {
                equip.skills.map((skill) => {
                    if (skill.key !== data.key) {
                        return false;
                    }

                    dataMap[data.key].equips[equip.type][equip.name] = skill.level;
                });
            });

            DataSet.charmHelper.hasSkill(data.key).getItems().map((equip) => {
                equip.skills.map((skill) => {
                    if (skill.key !== data.key) {
                        return false;
                    }

                    dataMap[data.key].equips.charm[equip.name] = skill.level;
                });
            });

            DataSet.jewelHelper.hasSkill(data.key).getItems().map((equip) => {
                dataMap[data.key].equips.jewel[equip.name] = equip.skill.level;
            });
        });

        console.log(dataMap);

        Object.keys(equips).map((equipType) => {
            let equip = equips[equipType];

            if (null === equip.key) {
                return false;
            }

            if (false === equip.isLock) {
                return false;
            }

            let equipInfo = null;

            if ('weapon' === equipType) {
                equipInfo = DataSet.weaponHelper.getApplyedInfo(equips.waepon);

            } else if ('helm' === equipType
                || 'chest' === equipType
                || 'arm' === equipType
                || 'waist' === equipType
                || 'leg' === equipType) {

                equipInfo = DataSet.armorHelper.getApplyedInfo(equips[equipType]);

            } else if ('charm' === equipType) {
                equipInfo = DataSet.charmHelper.getApplyedInfo(equips.charm);
            }
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
            key: data.skillKey,
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

        if (undefined !== data.enhanceIndex) {
            if ('object' !== typeof equips.weapon.enhanceKeys
                || null === equips.weapon.enhanceKeys) {

                equips.weapon.enhanceKeys = {};
            }

            equips.weapon.enhanceKeys[data.enhanceIndex] = data.enhanceKey;
        } else if (undefined !== data.slotIndex) {
            if ('object' !== typeof equips[data.equipType].slotKeys
                || null === equips.weapon.slotKeys) {

                equips[data.equipType].slotKeys = {};
            }

            equips[data.equipType].slotKeys[data.slotIndex] = data.slotKey;
        } else if ('weapon' === data.equipType) {
            equips.weapon = {
                key: data.equipKey,
                enhanceKeys: {},
                slotKeys: {},
                isLock: false
            };
        } else if ('helm' === data.equipType
            || 'chest' === data.equipType
            || 'arm' === data.equipType
            || 'waist' === data.equipType
            || 'leg' === data.equipType) {

            equips[data.equipType] = {
                key: data.equipKey,
                slotKeys: {},
                isLock: false
            };
        } else if ('charm' === data.equipType) {
            equips.charm = {
                key: data.equipKey,
                isLock: false
            };
        }

        this.setState({
            equips: equips
        });
    };

    /**
     * Lifecycle Functions
     */
    componentWillMount () {
        this.setState({
            equips: Constant.testEquipsSetting[0],
            skills: [
                {
                    key: '攻擊',
                    level: 7
                },
                {
                    key: '看破',
                    level: 4
                },
                {
                    key: '弱點特效',
                    level: 3
                },
                {
                    key: '減輕膽怯',
                    level: 2
                },
                {
                    key: '超會心',
                    level: 1
                },
                {
                    key: '無屬性強化',
                    level: 1
                }
            ]
        });
    }

    /**
     * Render Functions
     */
    renderSelectedSkillItems = () => {
        let skills = this.state.skills;

        return skills.map((data, index) => {
            let skill = DataSet.skillHelper.getInfo(data.key);

            return (
                <div key={skill.name} className="row mhwc-skill_item">
                    <div className="col-1">
                        <div className="col-12">
                            <a className="fa fa-chevron-up" onClick={() => {this.handleSkillMoveUp(index)}}></a>
                        </div>
                        <div className="col-12">
                            <a className="fa fa-chevron-down" onClick={() => {this.handleSkillMoveDown(index)}}></a>
                        </div>
                    </div>

                    <div className="col-6">
                        <span className="mhwc-skill_name">{skill.name}</span>
                    </div>

                    <div className="col-4">
                        <a className="fa fa-minus" onClick={() => {this.handleSkillLevelDown(index)}}></a>
                        &nbsp;
                        <span className="mhwc-skill_level">
                            {data.level} / {skill.list.length}
                        </span>
                        &nbsp;
                        <a className="fa fa-plus" onClick={() => {this.handleSkillLevelUp(index)}}></a>
                    </div>

                    <div className="col-1">
                        <a className="fa fa-times" onClick={() => {this.handleSkillRemove(index)}}></a>
                    </div>
                </div>
            );
        });
    };

    render () {
        return (
            <div id="main" className="container-fluid">
                <div className="row mhwc-header">
                    <div>
                        <h1>Monster Hunter: World Calculator</h1>
                    </div>
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
