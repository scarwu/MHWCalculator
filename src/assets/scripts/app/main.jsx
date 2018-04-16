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
import ItemSelector from 'component/main/itemSelector';
import EquipsDisplayer from 'component/main/equipsDisplayer';
import CharacterStatus from 'component/main/characterStatus';

export default class Main extends Component {

    // Default Props
    static defaultProps = {
        hash: null
    };

    // Initial State
    state = {
        skillSegment: null,
        selectedSkills: [],
        candidateList: [],
        equips: Misc.deepCopy(Constant.defaultEquips)
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
        let skill = DataSet.skillHelper.getInfo(selectedSkills[index].key);

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
        let skill = DataSet.skillHelper.getInfo(selectedSkills[index].key);

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

    handleSelectorOpen = (data) => {
        this.setState({
            isShowSelector: true,
            selector: data
        });
    };

    handleSelectorClose = () => {
        this.setState({
            isShowSelector: false
        });
    };

    handleSelectorPickup = (data) => {
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
            equips: Constant.testEquipsSetting[0]
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

        return DataSet.skillHelper.getKeys().sort().map((key) => {

            let skill = DataSet.skillHelper.getInfo(key);

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
                        <a className="fa fa-times" onClick={() => {this.handleSkillUnselect(index)}}></a>
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
                            <EquipsDisplayer equips={this.state.equips}
                                onOpenSelector={this.handleSelectorOpen}
                                onPickup={this.handleSelectorPickup} />
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

                {this.state.isShowSelector ? (
                    <ItemSelector data={this.state.selector}
                        onPickup={this.handleSelectorPickup}
                        onClose={this.handleSelectorClose} />
                ) : false}
            </div>
        );
    }
}
