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
import $ from 'jquery';

// Load Core Libraries
import Status from 'core/status';

// Load Custom Libraries
import DataSet from 'library/dataset';

// Load Constant & Lang
import Constant from 'constant';
import Lang from 'lang';

// Load Components
import CharacterStatus from 'component/main/characterStatus';

var defaultEquips = {
    weapon: null,
    helm: null,
    chest: null,
    arm: null,
    waist: null,
    leg: null,
    charm: null
};

export default class Main extends Component {

    // Default Props
    static defaultProps = {

    };

    // Initial State
    state = {
        skillSegment: null,
        selectedSkills: [],
        candidateList: [],
        equips: defaultEquips
    };

    /**
     * Handle Functions
     */
    handleSkillInput = () => {
        let segment = this.refs.skillSegment.value;

        if (0 === segment.length) {
            segment = null;
        }

        this.setState({
            skillSegment: segment
        });
    };

    handleSkillSelect = (key) => {
        let selectedSkills = this.state.selectedSkills;

        selectedSkills.push({
            key: key,
            level: 1
        });

        this.setState({
            selectedSkills: selectedSkills
        });
    };

    handleSkillUnselect = (index) => {
        let selectedSkills = this.state.selectedSkills;

        delete selectedSkills[index];

        this.setState({
            selectedSkills: selectedSkills
        });
    };

    handleSkillLevelDown = (index) => {
        let selectedSkills = this.state.selectedSkills;
        let skill = DataSet.skill.getInfo(selectedSkills[index].key);

        if (1 === selectedSkills[index].level) {
            return false;
        }

        selectedSkills[index].level -= 1;

        this.setState({
            selectedSkills: selectedSkills
        });
    };

    handleSkillLevelUp = (index) => {
        let selectedSkills = this.state.selectedSkills;
        let skill = DataSet.skill.getInfo(selectedSkills[index].key);

        if (skill.list.length === selectedSkills[index].level) {
            return false;
        }

        selectedSkills[index].level += 1;

        this.setState({
            selectedSkills: selectedSkills
        });
    };

    handleSkillMoveUp = (index) => {
        let selectedSkills = this.state.selectedSkills;

        if (0 === index) {
            return false;
        }

        [selectedSkills[index], selectedSkills[index - 1]] = [selectedSkills[index - 1], selectedSkills[index]];

        this.setState({
            selectedSkills: selectedSkills
        });
    };

    handleSkillMoveDown = (index) => {
        let selectedSkills = this.state.selectedSkills;

        if (selectedSkills.length - 1 === index) {
            return false;
        }

        [selectedSkills[index], selectedSkills[index + 1]] = [selectedSkills[index + 1], selectedSkills[index]];

        this.setState({
            selectedSkills: selectedSkills
        });
    };

    handleEquipSearch = () => {
        console.log('EquipSearch');
    };

    handleEquipLockToggle = (equipType) => {
        let equips = this.state.equips;

        equips[equipType].isLock = !equips[equipType].isLock;

        this.setState({
            equips: equips
        });
    };

    handleEquipSwitch = (equipType) => {
        console.log('EquipSwitch', equipType);
    };

    handleEquipSlotSwitch = (equipType, index) => {
        console.log('EquipSlotSwitch', equipType, index);
    };

    handleWeaponEnhanceSwitch = (index) => {
        console.log('WeaponEnhanceSwitch', index);
    };

    /**
     * Lifecycle Functions
     */
    componentWillMount () {
        this.setState({
            equips: Constant.defaultSets['破壞大劍']
        });
    }

    /**
     * Render Functions
     */
    renderUnselectedSkillItems = () => {
        let segment = this.state.skillSegment;
        let selectedSkills = this.state.selectedSkills.map((data) => {
            return data.key;
        });

        return DataSet.skill.getKeys().sort().map((key) => {

            let skill = DataSet.skill.getInfo(key);

            // Skip Selected Skills
            if (-1 !== selectedSkills.indexOf(skill.name)) {
                return false;
            }

            // Search Keyword
            if (null !== segment
                && !skill.name.toLowerCase().match(segment.toLowerCase())) {

                return false;
            }

            return (
                <div key={skill.name} className="row mhwc-skill_item">
                    <div className="col-10 offset-1">
                        <span className="mhwc-skill_name">{skill.name}</span>
                    </div>

                    <div className="col-1">
                        <a className="fa fa-check" onClick={() => {this.handleSkillSelect(skill.name)}}></a>
                    </div>
                </div>
            );
        });
    };

    renderSelectedSkillItems = () => {
        let selectedSkills = this.state.selectedSkills;

        return selectedSkills.map((data, index) => {
            let skill = DataSet.skill.getInfo(data.key);

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
                        <a className="fa fa-times" onClick={() => {this.handleSkillUnselect(index)}}></a>
                    </div>
                </div>
            );
        });
    };

    renderEquipItems = () => {
        let equips = this.state.equips;
        let ContentBlocks = [];

        // Weapon
        if (null !== equips.weapon) {
            let weaponInfo = DataSet.weapon.getInfo(equips.weapon.key);
            let weaponEnhances = null;

            if (8 === weaponInfo.rare) {
                weaponEnhances = [...Array(1).keys()];
            } else if (7 === weaponInfo.rare) {
                weaponEnhances = [...Array(2).keys()];
            } else if (6 === weaponInfo.rare) {
                weaponEnhances = [...Array(3).keys()];
            }

            ContentBlocks.push((
                <div key="weapon" className="row mhwc-equip">
                    <div className="col-12 mhwc-name">
                        {equips.weapon.isLock ? (
                            <a className="fa fa-lock" onClick={() => {this.handleEquipLockToggle('weapon')}}></a>
                        ) : (
                            <a className="fa fa-unlock-alt" onClick={() => {this.handleEquipLockToggle('weapon')}}></a>
                        )}
                        &nbsp;
                        <span>{weaponInfo.name}</span>

                        <a className="mhwc-exchnage fa fa-exchange" onClick={() => {this.handleEquipSwitch('weapon')}}></a>
                    </div>

                    <div className="col-12 mhwc-slots">
                        {weaponInfo.slots.sort((a, b) => {
                            return a.size < b.size;
                        }).map((data, index) => {
                            let jewel = null;

                            if (null !== equips.weapon.slotKeys
                                && null !== equips.weapon.slotKeys[index]) {

                                jewel = DataSet.jewel.getInfo(equips.weapon.slotKeys[index]);
                            }

                            return (
                                <div key={data.key + '_' + index} className="row mhwc-jewel">
                                    <div className="col-4 mhwc-name">
                                        <span>插槽 {index + 1} - [{data.size}]</span>
                                    </div>
                                    <div className="col-8 mhwc-value">
                                        {null !== jewel ? (
                                            <span>[{jewel.size}] {jewel.name}</span>
                                        ) : (
                                            <span>&nbsp;-&nbsp;</span>
                                        )}

                                        <a className="mhwc-exchnage fa fa-exchange" onClick={() => {this.handleEquipSlotSwitch('weapon', index)}}></a>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {null !== weaponEnhances ? (
                        <div className="col-12 mhwc-enhances">
                            {weaponEnhances.map((data, index) => {
                                let enhance = null;

                                if (null !== equips.weapon.enhanceKeys
                                    && null !== equips.weapon.enhanceKeys[index]) {

                                    enhance = DataSet.enhance.getInfo(equips.weapon.enhanceKeys[index])
                                }

                                return (
                                    <div key={data.key + '_' + index} className="row mhwc-enhance">
                                        <div className="col-4 mhwc-name">
                                            <span>強化 {index + 1}</span>
                                        </div>
                                        <div className="col-8 mhwc-value">
                                            {null !== enhance ? (
                                                <span>{enhance.name}</span>
                                            ) : (
                                                <span>&nbsp;-&nbsp;</span>
                                            )}

                                            <a className="mhwc-exchnage fa fa-exchange" onClick={() => {this.handleWeaponEnhanceSwitch(index)}}></a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : false}
                </div>
            ));
        } else {
            ContentBlocks.push((
                <div key="weapon" className="row mhwc-equip">
                    <div className="col-12 mhwc-name">
                        <span>&nbsp;-&nbsp;</span>

                        <a className="mhwc-exchnage fa fa-exchange" onClick={() => {this.handleEquipSwitch('weapon')}}></a>
                    </div>
                </div>
            ));
        }

        // Armors
        ['helm', 'chest', 'arm', 'waist', 'leg'].map((equipType) => {
            if (null !== equips[equipType]) {
                let equipInfo = DataSet.armor.getInfo(equips[equipType].key);

                ContentBlocks.push((
                    <div key={'equip_' + equipType} className="row mhwc-equip">
                        <div className="col-12 mhwc-name">
                            {equips[equipType].isLock ? (
                                <a className="fa fa-lock" onClick={() => {this.handleEquipLockToggle(equipType)}}></a>
                            ) : (
                                <a className="fa fa-unlock-alt" onClick={() => {this.handleEquipLockToggle(equipType)}}></a>
                            )}
                            &nbsp;
                            <span>{equipInfo.name}</span>

                            <a className="mhwc-exchnage fa fa-exchange" onClick={() => {this.handleEquipSwitch(equipType)}}></a>
                        </div>

                        <div className="col-12 mhwc-slots">
                            {equipInfo.slots.sort((a, b) => {
                                return a.size < b.size;
                            }).map((data, index) => {
                                let jewel = null;

                                if (null !== equips.weapon.slotKeys
                                    && null !== equips.weapon.slotKeys[index]) {

                                    jewel = DataSet.jewel.getInfo(equips.weapon.slotKeys[index])
                                }

                                return (
                                    <div key={data.key + '_' + index} className="row mhwc-jewel">
                                        <div className="col-4 mhwc-name">
                                            <span>插槽 {index + 1} - [{data.size}]</span>
                                        </div>
                                        <div className="col-8 mhwc-value">
                                            {null !== jewel ? (
                                                <span>[{jewel.size}] {jewel.name}</span>
                                            ) : (
                                                <span>&nbsp;-&nbsp;</span>
                                            )}

                                            <a className="mhwc-exchnage fa fa-exchange" onClick={() => {this.handleEquipSlotSwitch(equipType, index)}}></a>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) );
            } else {
                ContentBlocks.push((
                    <div key={'equip_' + equipType} className="row mhwc-equip">
                        <div className="col-12 mhwc-name">
                            <span>&nbsp;-&nbsp;</span>

                            <a className="mhwc-exchnage fa fa-exchange" onClick={() => {this.handleEquipSwitch(equipType)}}></a>
                        </div>
                    </div>
                ));
            }
        });

        // Charm
        if (null !== equips.charm) {
            let charmInfo = DataSet.charm.getInfo(equips.charm.key);

            ContentBlocks.push((
                <div key="charm" className="row mhwc-equip">
                    <div className="col-12 mhwc-name">
                        {equips.charm.isLock ? (
                            <a className="fa fa-lock" onClick={() => {this.handleEquipLockToggle('charm')}}></a>
                        ) : (
                            <a className="fa fa-unlock-alt" onClick={() => {this.handleEquipLockToggle('charm')}}></a>
                        )}
                        &nbsp;
                        <span>{charmInfo.name}</span>

                        <a className="mhwc-exchnage fa fa-exchange" onClick={() => {this.handleEquipSwitch('charm')}}></a>
                    </div>
                </div>
            ));
        } else {
            ContentBlocks.push((
                <div key="charm" className="row mhwc-equip">
                    <div className="col-12 mhwc-name">
                        <span>&nbsp;-&nbsp;</span>

                        <a className="mhwc-exchnage fa fa-exchange" onClick={() => {this.handleEquipSwitch('charm')}}></a>
                    </div>
                </div>
            ));
        }

        return ContentBlocks;
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
                    <div className="col mhwc-unselected_skills">
                        <div className="mhwc-section_name">
                            <span>備選技能</span>
                        </div>

                        <div className="mhwc-function_bar">
                            <input className="mhwc-skill_segment" type="text"
                                ref="skillSegment" onChange={this.handleSkillInput} />
                        </div>

                        <div className="mhwc-list">
                            {this.renderUnselectedSkillItems()}
                        </div>
                    </div>

                    <div className="col mhwc-selected_skills">
                        <div className="mhwc-section_name">
                            <span>已選技能</span>
                        </div>

                        <div className="mhwc-function_bar">
                            <input className="mhwc-equip_search" type="button"
                                value="Search" onChange={this.handleEquipSearch} />
                        </div>

                        <div className="mhwc-list">
                            {this.renderSelectedSkillItems()}
                        </div>
                    </div>

                    <div className="col mhwc-canditate_equips">
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
                            {this.renderEquipItems()}
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
            </div>
        );
    }
}
