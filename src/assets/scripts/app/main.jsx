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

    };

    // Initial State
    state = {
        skillSegment: null,
        selectedSkills: []
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
                    <span>{skill.name}</span>
                    <span>Lv.{data.level}</span>
                    <i className="fa fa-minus" onClick={() => {this.handleSkillUnselect(index)}}></i>
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
                    <span>{skill.name}</span>
                    <i className="fa fa-plus" onClick={() => {this.handleSkillSelect(skill.name)}}></i>
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
            <div id="main">
                <div className="mhwc-header">
                    <div>
                        <h1>Monster Hunter: World Calculator</h1>
                    </div>
                </div>
                <div className="mhwc-container">
                    <div className="mhwc-skills">
                        <div>
                            <input type="text" ref="skillSegment" onChange={this.handleSkillInput} />
                        </div>
                        <div>
                            {this.renderSelectedSkillItems()}
                        </div>
                        <div>
                            {this.renderUnselectedSkillItems()}
                        </div>
                    </div>
                    <div className="mhwc-content">
                        {this.renderEquipItems()}
                    </div>
                    <div className="mhwc-status">
                        {this.renderStatus()}
                    </div>
                </div>
            </div>
        );
    }
}
