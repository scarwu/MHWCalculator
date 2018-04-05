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

var defaultEquips = {
    weapon: null,
    helm: null,
    chest: null,
    arm: null,
    waist: null,
    leg: null,
    charm: null
};

var defaultStatus = {
    health: 100,
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
    defense: {
        min: 0,
        max: 0
    },
    resistance: {
        fire: 0,
        water: 0,
        thunder: 0,
        ice: 0,
        dragon: 0
    },
    skills: []
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

    generateStatus = () => {
        let equips = this.state.equips;

        let weapon = Constant.weapon[equips.weapon.key];
        let helm = Constant.armor[equips.helm.key];
        let chest = Constant.armor[equips.chest.key];
        let arm = Constant.armor[equips.arm.key];
        let waist = Constant.armor[equips.waist.key];
        let leg = Constant.armor[equips.leg.key];
        let charm = Constant.charm[equips.charm.key];

        let status = defaultStatus;

        status.attack = weapon.attack;
        status.criticalRate = weapon.criticalRate;
        status.sharpness = weapon.sharpness;
        status.element = weapon.element;
        status.elderseal = weapon.elderseal;

        // Defense
        status.defense.min = weapon.defense + helm.defense.min;
            + chest.defense.min + arm.defense.min;
            + waist.defense.min + leg.defense.min;

        status.defense.max = weapon.defense + helm.defense.max;
            + chest.defense.max + arm.defense.max;
            + waist.defense.max + leg.defense.max;

        // Resistance
        status.resistance.fire = helm.resistance.fire
            + chest.resistance.fire + arm.resistance.fire
            + waist.resistance.fire + leg.resistance.fire;

        status.resistance.water = helm.resistance.water
            + chest.resistance.water + arm.resistance.water
            + waist.resistance.water + leg.resistance.water;

        status.resistance.thunder = helm.resistance.thunder
            + chest.resistance.thunder + arm.resistance.thunder
            + waist.resistance.thunder + leg.resistance.thunder;

        status.resistance.ice = helm.resistance.ice
            + chest.resistance.ice + arm.resistance.ice
            + waist.resistance.ice + leg.resistance.ice;

        status.resistance.dragon = helm.resistance.dragon
            + chest.resistance.dragon + arm.resistance.dragon
            + waist.resistance.dragon + leg.resistance.dragon;

        // Skills
        var tempSkills = {};

        // Skills from Equips
        helm.skills.map((data) => {
            if (undefined === tempSkills[data.key]) {
                tempSkills[data.key] = 0;
            }

            tempSkills[data.key] += data.level;
        });

        chest.skills.map((data) => {
            if (undefined === tempSkills[data.key]) {
                tempSkills[data.key] = 0;
            }

            tempSkills[data.key] += data.level;
        });

        arm.skills.map((data) => {
            if (undefined === tempSkills[data.key]) {
                tempSkills[data.key] = 0;
            }

            tempSkills[data.key] += data.level;
        });

        waist.skills.map((data) => {
            if (undefined === tempSkills[data.key]) {
                tempSkills[data.key] = 0;
            }

            tempSkills[data.key] += data.level;
        });

        leg.skills.map((data) => {
            if (undefined === tempSkills[data.key]) {
                tempSkills[data.key] = 0;
            }

            tempSkills[data.key] += data.level;
        });

        // Skills from Charm
        charm.skills.map((data) => {
            if (undefined === tempSkills[data.key]) {
                tempSkills[data.key] = 0;
            }

            tempSkills[data.key] += data.level;
        })

        // Skills from Slots
        equips.weapon.slots.map((data) => {
            let jewel = Constant.jewel[data.key]

            if (undefined === tempSkills[jewel.skill.key]) {
                tempSkills[jewel.skill.key] = 0;
            }

            tempSkills[jewel.skill.key] += 1;
        });

        equips.helm.slots.map((data) => {
            let jewel = Constant.jewel[data.key]

            if (undefined === tempSkills[jewel.skill.key]) {
                tempSkills[jewel.skill.key] = 0;
            }

            tempSkills[jewel.skill.key] += 1;
        });

        equips.chest.slots.map((data) => {
            let jewel = Constant.jewel[data.key]

            if (undefined === tempSkills[jewel.skill.key]) {
                tempSkills[jewel.skill.key] = 0;
            }

            tempSkills[jewel.skill.key] += 1;
        });

        equips.arm.slots.map((data) => {
            let jewel = Constant.jewel[data.key]

            if (undefined === tempSkills[jewel.skill.key]) {
                tempSkills[jewel.skill.key] = 0;
            }

            tempSkills[jewel.skill.key] += 1;
        });

        equips.waist.slots.map((data) => {
            let jewel = Constant.jewel[data.key]

            if (undefined === tempSkills[jewel.skill.key]) {
                tempSkills[jewel.skill.key] = 0;
            }

            tempSkills[jewel.skill.key] += 1;
        });

        equips.leg.slots.map((data) => {
            let jewel = Constant.jewel[data.key]

            if (undefined === tempSkills[jewel.skill.key]) {
                tempSkills[jewel.skill.key] = 0;
            }

            tempSkills[jewel.skill.key] += 1;
        });

        for (let key in tempSkills) {
            let skill = Constant.skill[key];
            let level = tempSkills[key];

            status.skills.push({
                name: skill.name,
                level: level,
                description: skill.list[level - 1].description
            });
        }

        this.setState({
            status: status
        });
    }

    /**
     * Lifecycle Functions
     */
    componentWillMount () {
        this.setState({
            equips: {
                weapon: {
                    key: '日冕短劍',
                    slots: []
                },
                helm: {
                    key: '龍王的獨眼α',
                    slots: [
                        {
                            key: '耐衝珠'
                        }
                    ]
                },
                chest: {
                    key: '鋼龍身β',
                    slots: [
                        {
                            key: '飛燕珠'
                        }
                    ]
                },
                arm: {
                    key: '帝王β手',
                    slots: [
                        {
                            key: '超心珠'
                        }
                    ]
                },
                waist: {
                    key: '帝王β身',
                    slots: [
                        {
                            key: '渾身珠'
                        }
                    ]
                },
                leg: {
                    key: '慘爪龍護腿β',
                    slots: [
                        {
                            key: '渾身珠'
                        }
                    ]
                },
                charm: {
                    key: '匠之護石 III'
                }
            }
        }, () => {
            this.generateStatus();
        });
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
        let equips = this.state.equips;

        let weapon = Constant.weapon[equips.weapon.key];
        let helm = Constant.armor[equips.helm.key];
        let chest = Constant.armor[equips.chest.key];
        let arm = Constant.armor[equips.arm.key];
        let waist = Constant.armor[equips.waist.key];
        let leg = Constant.armor[equips.leg.key];
        let charm = Constant.charm[equips.charm.key];

        return (
            <div key="equip" className="mhwc-equips">
                <div className="mhwc-equip_item">
                    <span>{weapon.name}</span>
                    <span>{weapon.attack}</span>
                    <span>{weapon.criticalRate}</span>
                    <span>{weapon.defense}</span>
                    {equips.weapon.slots.map((data) => {
                        return (
                            <span key={data.key}>{Constant.jewel[data.key].name}</span>
                        );
                    })}
                </div>
                <div className="mhwc-equip_item">
                    <span>{helm.name}</span>
                    <span>{helm.defense.min} ~ {helm.defense.max}</span>
                    <span>{helm.resistance.fire}</span>
                    <span>{helm.resistance.water}</span>
                    <span>{helm.resistance.thunder}</span>
                    <span>{helm.resistance.ice}</span>
                    <span>{helm.resistance.dragon}</span>
                    {equips.helm.slots.map((data) => {
                        return (
                            <span key={data.key}>{Constant.jewel[data.key].name}</span>
                        );
                    })}
                </div>
                <div className="mhwc-equip_item">
                    <span>{arm.name}</span>
                    <span>{arm.defense.min} ~ {arm.defense.max}</span>
                    <span>{arm.resistance.fire}</span>
                    <span>{arm.resistance.water}</span>
                    <span>{arm.resistance.thunder}</span>
                    <span>{arm.resistance.ice}</span>
                    <span>{arm.resistance.dragon}</span>
                    {equips.arm.slots.map((data) => {
                        return (
                            <span key={data.key}>{Constant.jewel[data.key].name}</span>
                        );
                    })}
                </div>
                <div className="mhwc-equip_item">
                    <span>{waist.name}</span>
                    <span>{waist.defense.min} ~ {waist.defense.max}</span>
                    <span>{waist.resistance.fire}</span>
                    <span>{waist.resistance.water}</span>
                    <span>{waist.resistance.thunder}</span>
                    <span>{waist.resistance.ice}</span>
                    <span>{waist.resistance.dragon}</span>
                    {equips.waist.slots.map((data) => {
                        return (
                            <span key={data.key}>{Constant.jewel[data.key].name}</span>
                        );
                    })}
                </div>
                <div className="mhwc-equip_item">
                    <span>{leg.name}</span>
                    <span>{leg.defense.min} ~ {leg.defense.max}</span>
                    <span>{leg.resistance.fire}</span>
                    <span>{leg.resistance.water}</span>
                    <span>{leg.resistance.thunder}</span>
                    <span>{leg.resistance.ice}</span>
                    <span>{leg.resistance.dragon}</span>
                    {equips.leg.slots.map((data) => {
                        return (
                            <span key={data.key}>{Constant.jewel[data.key].name}</span>
                        );
                    })}
                </div>
                <div className="mhwc-equip_item">
                    <span>{charm.name}</span>
                </div>
            </div>
        );
    };

    renderStatus = () => {
        let status = this.state.status;

        return (null !== status) ? (
            <div>
                <div>
                    <span>Health</span>
                    <span>{status.health}</span>
                </div>
                <div>
                    <span>Stamina</span>
                    <span>{status.stamina}</span>
                </div>
                <div>
                    <span>Attack</span>
                    <span>{status.attack}</span>
                </div>
                <div>
                    <span>CriticalRate</span>
                    <span>{status.criticalRate}</span>
                </div>
                <div>
                    <span>Sharpness</span>
                    <span>{JSON.stringify(status.sharpness)}</span>
                </div>
                <div>
                    <span>Element</span>
                    <span>{JSON.stringify(status.element)}</span>
                </div>
                <div>
                    <span>Elderseal</span>
                    <span>{JSON.stringify(status.elderseal)}</span>
                </div>
                <div>
                    <span>Defense</span>
                    <span>{JSON.stringify(status.defense)}</span>
                </div>
                <div>
                    <span>Resistance</span>
                    <span>{JSON.stringify(status.resistance)}</span>
                </div>
                <div>
                    <span>Skills</span>
                    <span>{JSON.stringify(status.skills)}</span>
                </div>
            </div>
        ) : false;
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
                    <div className="col-3">
                        <div className="mhwc-selected_skills">
                            <div className="mhwc-function_bar">
                                <input className="mhwc-equip_search" type="button"
                                    value="Search" onChange={this.handleEquipSearch} />
                            </div>
                            <div className="mhwc-list">
                                {this.renderSelectedSkillItems()}
                            </div>
                        </div>

                        <div className="mhwc-skills">
                            <div className="mhwc-function_bar">
                                <input className="mhwc-skill_segment" type="text"
                                    ref="skillSegment" onChange={this.handleSkillInput} />
                            </div>
                            <div className="mhwc-list">
                                {this.renderUnselectedSkillItems()}
                            </div>
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
