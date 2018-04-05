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
import Event from 'core/event';

// Load Config & Constant
import Config from 'config';
import Constant from 'constant';

export default class Main extends Component {

    // Default Props
    static defaultProps = {
        equip: {
            chram: null,
            helm: null,
            chest: null,
            arm: null,
            waist: null
        },
        status: {
            headlth: 100,
            stamina: 100,
            attack: 0,
            criticalRate: 0,
            sharpness: {
                value: 0,
                steps: {
                    red: 0,
                    orange: 0,
                    yellow: 0,
                    green: 0,
                    blue: 0,
                    white: 0
                }
            },
            element: {
                type: null,
                value: 0,
                isHidden: null
            },
            elderseal: {
                affinity: null
            },
            resistance: {
                fire: 0,
                water: 0,
                thunder: 0,
                ice: 0,
                dragon: 0
            }
        }
    };

    // Initial State
    state = {
        skillSegment: null,
        selectedSkills: [],
        candidateList: [],
        equips: null,
        status: null
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
        let skill = Constant.skill[selectedSkills[index].key];

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
        let skill = Constant.skill[selectedSkills[index].key];

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

    };

    /**
     * Lifecycle Functions
     */
    componentWillMount () {

    }

    componentDidMount () {

    }

    componentWillReceiveProps (nextProps) {

    }

    /**
     * Render Functions
     */
    renderSelectedSkillItems = () => {
        let selectedSkills = this.state.selectedSkills;

        return selectedSkills.map((data, index) => {
            let skill = Constant.skill[data.key];

            return (
                <div key={skill.name}>
                    <div className="mhwc-skill_item">
                        <i className="fa fa-times" onClick={() => {this.handleSkillUnselect(index)}}></i>
                        &nbsp;
                        <span className="mhwc-skill_name">{skill.name}</span>
                        &nbsp;
                        <div>
                            <i className="fa fa-minus" onClick={() => {this.handleSkillLevelDown(index)}}></i>
                            &nbsp;
                            <span className="mhwc-skill_level">
                                {data.level} / {skill.list.length}
                            </span>
                            &nbsp;
                            <i className="fa fa-plus" onClick={() => {this.handleSkillLevelUp(index)}}></i>
                        </div>
                        <div>
                            <i className="fa fa-chevron-up" onClick={() => {this.handleSkillMoveUp(index)}}></i>
                            <i className="fa fa-chevron-down" onClick={() => {this.handleSkillMoveDown(index)}}></i>
                        </div>
                    </div>
                </div>
            );
        });
    };

    renderUnselectedSkillItems = () => {
        let segment = this.state.skillSegment;
        let selectedSkills = this.state.selectedSkills.map((data) => {
            return data.key;
        });

        return Object.keys(Constant.skill).sort().map((key) => {

            let skill = Constant.skill[key];

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
                <div key={skill.name}>
                    <div className="mhwc-skill_item">
                        <i className="fa fa-check" onClick={() => {this.handleSkillSelect(skill.name)}}></i>
                        &nbsp;
                        <span className="mhwc-skill_name">{skill.name}</span>
                    </div>
                </div>
            );
        });
    };

    renderEquipItems = () => {
        return [(
            <div key="equip" className="mhwc-equips">

            </div>
        ), (
            <div key="jewel" className="mhwc-jewels">

            </div>
        )];
    };

    renderStatus = () => {
        return (
            <div></div>
        );
    }

    render () {
        return (
            <div id="main" className="container-fluid">
                <div className="row mhwc-header">
                    <div>
                        <h1>Monster Hunter: World Calculator</h1>
                    </div>
                </div>

                <div className="row mhwc-container">
                    <div className="col-3 mhwc-skills">
                        <div className="mhwc-function_bar">
                            <input className="mhwc-skill_segment" type="text"
                                ref="skillSegment" onChange={this.handleSkillInput} />
                        </div>
                        <div className="mhwc-list">
                            {this.renderUnselectedSkillItems()}
                        </div>
                    </div>

                    <div className="col-3 mhwc-selected_skills">
                        <div className="mhwc-function_bar">
                            <input className="mhwc-equip_search" type="button"
                                value="Search" onChange={this.handleEquipSearch} />
                        </div>
                        <div className="mhwc-list">
                            {this.renderSelectedSkillItems()}
                        </div>
                    </div>

                    <div className="col-3 mhwc-content">
                        {this.renderEquipItems()}
                    </div>

                    <div className="col-3 mhwc-status">
                        {this.renderStatus()}
                    </div>
                </div>
            </div>
        );
    }
}
