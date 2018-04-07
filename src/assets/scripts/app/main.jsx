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

    };

    generateStatus = () => {
        let equips = this.state.equips;

        let weapon = DataSet.weapon.getInfo(equips.weapon.key);
        let helm = DataSet.armor.getInfo(equips.helm.key);
        let chest = DataSet.armor.getInfo(equips.chest.key);
        let arm = DataSet.armor.getInfo(equips.arm.key);
        let waist = DataSet.armor.getInfo(equips.waist.key);
        let leg = DataSet.armor.getInfo(equips.leg.key);
        let charm = DataSet.charm.getInfo(equips.charm.key);

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
            let jewel = DataSet.jewel.getInfo(data.key)

            if (undefined === tempSkills[jewel.skill.key]) {
                tempSkills[jewel.skill.key] = 0;
            }

            tempSkills[jewel.skill.key] += 1;
        });

        equips.helm.slots.map((data) => {
            let jewel = DataSet.jewel.getInfo(data.key)

            if (undefined === tempSkills[jewel.skill.key]) {
                tempSkills[jewel.skill.key] = 0;
            }

            tempSkills[jewel.skill.key] += 1;
        });

        equips.chest.slots.map((data) => {
            let jewel = DataSet.jewel.getInfo(data.key)

            if (undefined === tempSkills[jewel.skill.key]) {
                tempSkills[jewel.skill.key] = 0;
            }

            tempSkills[jewel.skill.key] += 1;
        });

        equips.arm.slots.map((data) => {
            let jewel = DataSet.jewel.getInfo(data.key)

            if (undefined === tempSkills[jewel.skill.key]) {
                tempSkills[jewel.skill.key] = 0;
            }

            tempSkills[jewel.skill.key] += 1;
        });

        equips.waist.slots.map((data) => {
            let jewel = DataSet.jewel.getInfo(data.key)

            if (undefined === tempSkills[jewel.skill.key]) {
                tempSkills[jewel.skill.key] = 0;
            }

            tempSkills[jewel.skill.key] += 1;
        });

        equips.leg.slots.map((data) => {
            let jewel = DataSet.jewel.getInfo(data.key)

            if (undefined === tempSkills[jewel.skill.key]) {
                tempSkills[jewel.skill.key] = 0;
            }

            tempSkills[jewel.skill.key] += 1;
        });

        for (let key in tempSkills) {
            let skill = DataSet.skill.getInfo(key);
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
    };

    /**
     * Lifecycle Functions
     */
    componentWillMount () {
        this.setState({
            equips: {
                weapon: {
                    key: '罪【真】',
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
                    key: '杜賓鎧甲β',
                    slots: [
                        {
                            key: '痛擊珠'
                        }
                    ]
                },
                arm: {
                    key: '異種大型鋼爪α',
                    slots: [
                        {
                            key: '達人珠'
                        }
                    ]
                },
                waist: {
                    key: '慘爪龍腰甲β',
                    slots: [
                        {
                            key: '無擊珠'
                        }
                    ]
                },
                leg: {
                    key: '杜賓護腿β',
                    slots: [
                        {
                            key: '達人珠'
                        }
                    ]
                },
                charm: {
                    key: '攻擊護石 III'
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
            let skill = DataSet.skill.getInfo(data.key);

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

        let weapon = DataSet.weapon.getInfo(equips.weapon.key);
        let helm = DataSet.armor.getInfo(equips.helm.key);
        let chest = DataSet.armor.getInfo(equips.chest.key);
        let arm = DataSet.armor.getInfo(equips.arm.key);
        let waist = DataSet.armor.getInfo(equips.waist.key);
        let leg = DataSet.armor.getInfo(equips.leg.key);
        let charm = DataSet.charm.getInfo(equips.charm.key);

        return [(
            <div className="mhwc-item">
                <div className="mhwc-name">
                    <span>{weapon.name}</span>
                </div>
                <div className="mhwc-slots">
                    {equips.weapon.slots.map((data) => {
                        return (
                            <div className="mhwc-jewel">
                                <div className="mhwc-name">
                                    <span key={data.key}>
                                        {DataSet.jewel.getInfo(data.key).name}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        ), (
            <div className="mhwc-item">
                <div className="mhwc-name">
                    <span>{helm.name}</span>
                </div>
                <div className="mhwc-slots">
                    {equips.helm.slots.map((data) => {
                        return (
                            <div className="mhwc-jewel">
                                <div className="mhwc-name">
                                    <span key={data.key}>
                                        {DataSet.jewel.getInfo(data.key).name}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        ), (
            <div className="mhwc-item">
                <div className="mhwc-name">
                    <span>{arm.name}</span>
                </div>
                <div className="mhwc-slots">
                    {equips.arm.slots.map((data) => {
                        return (
                            <div className="mhwc-jewel">
                                <div className="mhwc-name">
                                    <span key={data.key}>
                                        {DataSet.jewel.getInfo(data.key).name}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        ), (
            <div className="mhwc-item">
                <div className="mhwc-name">
                    <span>{waist.name}</span>
                </div>
                <div className="mhwc-slots">
                    {equips.waist.slots.map((data) => {
                        return (
                            <div className="mhwc-jewel">
                                <div className="mhwc-name">
                                    <span key={data.key}>
                                        {DataSet.jewel.getInfo(data.key).name}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        ), (
            <div className="mhwc-item">
                <div className="mhwc-name">
                    <span>{leg.name}</span>
                </div>
                <div className="mhwc-slots">
                    {equips.leg.slots.map((data) => {
                        return (
                            <div className="mhwc-jewel">
                                <div className="mhwc-name">
                                    <span key={data.key}>
                                        {DataSet.jewel.getInfo(data.key).name}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        ), (
            <div className="mhwc-item">
                <div className="mhwc-name">
                    <span>{charm.name}</span>
                </div>
            </div>
        )];
    };

    renderStatus = () => {
        let status = this.state.status;

        if (null === status) {
            return false;
        }

        let sharpnessStyle = {
            red: {
                width: (status.sharpness.steps.red / 4) + '%'
            },
            orange: {
                width: (status.sharpness.steps.orange / 4) + '%'
            },
            yellow: {
                width: (status.sharpness.steps.yellow / 4) + '%'
            },
            green: {
                width: (status.sharpness.steps.green / 4) + '%'
            },
            blue: {
                width: (status.sharpness.steps.blue / 4) + '%'
            },
            white: {
                width: (status.sharpness.steps.white / 4) + '%'
            },
            mask: {
                width: ((400 - status.sharpness.value) / 4) + '%'
            }
        };

        return [(
            <div className="mhwc-item">
                <div className="mhwc-name">
                    <span>Health</span>
                </div>
                <div className="mhwc-value">
                    <span>{status.health}</span>
                </div>
            </div>
        ), (
            <div className="mhwc-item">
                <div className="mhwc-name">
                    <span>Stamina</span>
                </div>
                <div className="mhwc-value">
                    <span>{status.stamina}</span>
                </div>
            </div>
        ), (
            <div className="mhwc-item">
                <div className="mhwc-name">
                    <span>Attack</span>
                </div>
                <div className="mhwc-value">
                    <span>{status.attack}</span>
                </div>
            </div>
        ), (
            <div className="mhwc-item">
                <div className="mhwc-name">
                    <span>CriticalRate</span>
                </div>
                <div className="mhwc-value">
                    <span>{status.criticalRate}%</span>
                </div>
            </div>
        ), (
            <div className="mhwc-item">
                <div className="mhwc-name">
                    <span>Sharpness</span>
                </div>
                <div className="mhwc-value">
                    <div className="mhwc-sharpness">
                        <div className="mhwc-step" style={sharpnessStyle.red}></div>
                        <div className="mhwc-step" style={sharpnessStyle.orange}></div>
                        <div className="mhwc-step" style={sharpnessStyle.yellow}></div>
                        <div className="mhwc-step" style={sharpnessStyle.green}></div>
                        <div className="mhwc-step" style={sharpnessStyle.blue}></div>
                        <div className="mhwc-step" style={sharpnessStyle.white}></div>
                        <div className="mhwc-mask" style={sharpnessStyle.mask}></div>
                    </div>
                </div>
            </div>
        ), (
            <div className="mhwc-item">
                <div className="mhwc-name">
                    <span>Element</span>
                </div>
                <div className="mhwc-value">
                    {status.element.isHidden ? (
                        <span>({status.element.type}: {status.element.value})</span>
                    ) : (
                        <span>{status.element.type}: {status.element.value}</span>
                    )}
                </div>
            </div>
        ), (
            <div className="mhwc-item">
                <div className="mhwc-name">
                    <span>Elderseal</span>
                </div>
                <div className="mhwc-value">
                    <span>{status.elderseal.affinity}</span>
                </div>
            </div>
        ), (
            <div className="mhwc-item">
                <div className="mhwc-name">
                    <span>Defense</span>
                </div>
                <div className="mhwc-value">
                    <span>{status.defense.min} ~ {status.defense.max}</span>
                </div>
            </div>
        ), (
            <div className="mhwc-item">
                <div className="mhwc-name">
                    <span>Resistance</span>
                </div>
                <div className="mhwc-value">
                    <div>
                        <span>Fire</span>
                        <span>{status.resistance.fire}</span>
                    </div>
                    <div>
                        <span>Water</span>
                        <span>{status.resistance.water}</span>
                    </div>
                    <div>
                        <span>Thunder</span>
                        <span>{status.resistance.thunder}</span>
                    </div>
                    <div>
                        <span>Ice</span>
                        <span>{status.resistance.ice}</span>
                    </div>
                    <div>
                        <span>Dragon</span>
                        <span>{status.resistance.dragon}</span>
                    </div>
                </div>
            </div>
        ), (
            <div className="mhwc-item">
                <div className="mhwc-name">
                    <span>Skills</span>
                </div>
                <div className="mhwc-value">
                    {status.skills.sort((a, b) => {
                        return b.level - a.level;
                    }).map((data) => {
                        return (
                            <div>
                                <div>
                                    <span>{data.name} Lv.{data.level}</span>
                                </div>
                                <div>
                                    <span>{data.description}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        )];
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

                    <div className="col-3">
                        <div className="mhwc-equips">
                            {this.renderEquipItems()}
                        </div>

                        <div className="mhwc-canditate_equips">

                        </div>
                    </div>

                    <div className="col-3 mhwc-status">
                        {this.renderStatus()}
                    </div>
                </div>
            </div>
        );
    }
}
