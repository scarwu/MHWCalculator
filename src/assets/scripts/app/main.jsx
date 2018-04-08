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

// Load Constant
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
    attack: 15, // 力量護符+6 力量之爪+9
    critical: {
        rate: 0,
        multiple: 1.25
    },
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
    defense: 31, // 守護護符+10 守護之爪+20
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

    /**
     * Generate Functions
     */
    generateStatus = () => {

        let equips = this.state.equips;
        let status = defaultStatus;
        let elements = ['fire', 'water', 'thunder', 'ice', 'dragon'];
        let equipsHasSkill = ['helm', 'chest', 'arm', 'waist', 'leg', 'charm'];
        let equipsHasSlot = ['weapon', 'helm', 'chest', 'arm', 'waist', 'leg'];
        let tempSkills = {};

        equips.weapon.info = DataSet.weapon.getInfo(equips.weapon.key);
        equips.helm.info = DataSet.armor.getInfo(equips.helm.key);
        equips.chest.info = DataSet.armor.getInfo(equips.chest.key);
        equips.arm.info = DataSet.armor.getInfo(equips.arm.key);
        equips.waist.info = DataSet.armor.getInfo(equips.waist.key);
        equips.leg.info = DataSet.armor.getInfo(equips.leg.key);
        equips.charm.info = DataSet.charm.getInfo(equips.charm.key);

        status.critical.rate = equips.weapon.info.criticalRate;
        status.sharpness = equips.weapon.info.sharpness;
        status.element = equips.weapon.info.element;
        status.elderseal = equips.weapon.info.elderseal;

        // Defense
        status.defense += (equips.weapon.info.defense + equips.helm.info.defense
            + equips.chest.info.defense + equips.arm.info.defense
            + equips.waist.info.defense + equips.leg.info.defense);

        // Resistance
        elements.map((elementType) => {
            status.resistance[elementType] = equips.helm.info.resistance[elementType]
                + equips.chest.info.resistance[elementType] + equips.arm.info.resistance[elementType]
                + equips.waist.info.resistance[elementType] + equips.leg.info.resistance[elementType];
        });

        // Skills from Equips
        equipsHasSkill.map((equipType) => {
            equips[equipType].info.skills.map((data) => {
                if (undefined === tempSkills[data.key]) {
                    tempSkills[data.key] = 0;
                }

                tempSkills[data.key] += data.level;
            });
        });

        // Skills from Slots
        equipsHasSlot.map((equipType) => {
            equips[equipType].slots.map((data) => {
                let jewel = DataSet.jewel.getInfo(data.key)

                if (undefined === tempSkills[jewel.skill.key]) {
                    tempSkills[jewel.skill.key] = 0;
                }

                tempSkills[jewel.skill.key] += 1;
            });
        });

        let noneElementAttackMutiple = null;
        let enableElement = null;
        let attackMultiples = [];
        let defenseMultiples = [];

        for (let key in tempSkills) {
            let skill = DataSet.skill.getInfo(key);
            let level = tempSkills[key];

            status.skills.push({
                name: skill.name,
                level: level,
                description: skill.list[level - 1].description
            });

            if ('passive' === skill.type) {
                continue;
            }

            if (undefined === skill.list[level - 1].reaction) {
                continue;
            }

            for (let reactionType in skill.list[level - 1].reaction) {
                let data = skill.list[level - 1].reaction[reactionType];

                switch (reactionType) {
                case 'health':
                case 'stamina':
                case 'attack':
                case 'defense':
                    status[reactionType] += data.value;

                    break;
                case 'criticalRate':
                    status.critical.rate += data.value;

                    break;
                case 'criticalMultiple':
                    status.critical.multiple = data.value;

                    break;
                case 'sharpness':
                    status.sharpness.value += data.value;

                    break;
                case 'element':
                    if (status.element.type !== data.type) {
                        break;
                    }

                    status.element.value += data.value;
                    status.element.value *= data.multiple;

                    break;
                case 'resistance':
                    if ('all' === data.type) {
                        elements.map((elementType) => {
                            status.resistance[elementType] += data.value;
                        });
                    } else {
                        status.resistance[data.type] += data.value;
                    }

                    break;
                case 'noneElementAttackMutiple':
                    noneElementAttackMutiple = data;

                    break;
                case 'enableElement':
                    enableElement = data;

                    break;
                case 'attackMultiple':
                    attackMultiples.push(data.value);

                    break;
                case 'defenseMultiple':
                    if (null !== status.element
                        && false === status.element.isHidden) {

                        break;
                    }

                    defenseMultiples.push(data.value);

                    break;
                }
            }
        }

        // Last Status Completion
        let weaponAttack = equips.weapon.info.attack;
        let weaponType = equips.weapon.info.type;

        status.attack *= Constant.weaponMultiple[weaponType]; // 武器倍率

        if (null == enableElement && null !== noneElementAttackMutiple) {
            status.attack += weaponAttack * noneElementAttackMutiple.value;
        } else {
            status.attack += weaponAttack;
        }

        if (null !== enableElement) {
            status.element.value *= enableElement.multiple;
            status.element.value = parseInt(Math.round(status.element.value));
            status.element.isHidden = false;
        }

        attackMultiples.map((multiple) => {
            status.attack *= multiple;
        });

        defenseMultiples.map((multiple) => {
            status.defense *= multiple;
        });

        status.attack = parseInt(Math.round(status.attack));
        status.defense = parseInt(Math.round(status.defense));

        this.setState({
            status: status
        });
    };

    /**
     * Lifecycle Functions
     */
    componentWillMount () {
        this.setState({
            equips: Constant.defaultSets['破壞大劍']
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
            <div key="weapon" className="mhwc-item">
                <div className="mhwc-name">
                    <span>{weapon.name}</span>
                </div>
                <div className="mhwc-enhances">
                    {equips.weapon.enhances.map((data) => {
                        return (
                            <div key={data.key} className="mhwc-name">
                                <span>{data.key}</span>
                            </div>
                        );
                    })}
                </div>
                <div className="mhwc-slots">
                    {equips.weapon.slots.map((data, index) => {
                        return (
                            <div key={data.key + '_' + index} className="mhwc-jewel">
                                <div className="mhwc-name">
                                    <span>
                                        {DataSet.jewel.getInfo(data.key).name}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        ), (
            <div key="helm" className="mhwc-item">
                <div className="mhwc-name">
                    <span>{helm.name}</span>
                </div>
                <div className="mhwc-slots">
                    {equips.helm.slots.map((data, index) => {
                        return (
                            <div key={data.key + '_' + index} className="mhwc-jewel">
                                <div className="mhwc-name">
                                    <span>
                                        {DataSet.jewel.getInfo(data.key).name}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        ), , (
            <div key="chest" className="mhwc-item">
                <div className="mhwc-name">
                    <span>{chest.name}</span>
                </div>
                <div className="mhwc-slots">
                    {equips.chest.slots.map((data, index) => {
                        return (
                            <div key={data.key + '_' + index} className="mhwc-jewel">
                                <div className="mhwc-name">
                                    <span>
                                        {DataSet.jewel.getInfo(data.key).name}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        ), (
            <div key="arm" className="mhwc-item">
                <div className="mhwc-name">
                    <span>{arm.name}</span>
                </div>
                <div className="mhwc-slots">
                    {equips.arm.slots.map((data, index) => {
                        return (
                            <div key={data.key + '_' + index} className="mhwc-jewel">
                                <div className="mhwc-name">
                                    <span>
                                        {DataSet.jewel.getInfo(data.key).name}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        ), (
            <div key="waist" className="mhwc-item">
                <div className="mhwc-name">
                    <span>{waist.name}</span>
                </div>
                <div className="mhwc-slots">
                    {equips.waist.slots.map((data, index) => {
                        return (
                            <div key={data.key + '_' + index} className="mhwc-jewel">
                                <div className="mhwc-name">
                                    <span>
                                        {DataSet.jewel.getInfo(data.key).name}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        ), (
            <div key="leg" className="mhwc-item">
                <div className="mhwc-name">
                    <span>{leg.name}</span>
                </div>
                <div className="mhwc-slots">
                    {equips.leg.slots.map((data, index) => {
                        return (
                            <div key={data.key + '_' + index} className="mhwc-jewel">
                                <div className="mhwc-name">
                                    <span>
                                        {DataSet.jewel.getInfo(data.key).name}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        ), (
            <div key="charm" className="mhwc-item">
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
            <div key="health" className="mhwc-item">
                <div className="mhwc-name">
                    <span>Health</span>
                </div>
                <div className="mhwc-value">
                    <span>{status.health}</span>
                </div>
            </div>
        ), (
            <div key="stamina" className="mhwc-item">
                <div className="mhwc-name">
                    <span>Stamina</span>
                </div>
                <div className="mhwc-value">
                    <span>{status.stamina}</span>
                </div>
            </div>
        ), (
            <div key="attack" className="mhwc-item">
                <div className="mhwc-name">
                    <span>Attack</span>
                </div>
                <div className="mhwc-value">
                    <span>{status.attack}</span>
                </div>
            </div>
        ), (
            <div key="criticalRate" className="mhwc-item">
                <div className="mhwc-name">
                    <span>Critical Rate</span>
                </div>
                <div className="mhwc-value">
                    <span>{status.critical.rate}%</span>
                </div>
            </div>
        ), (
            <div key="criticalMultiple" className="mhwc-item">
                <div className="mhwc-name">
                    <span>Critical Multiple</span>
                </div>
                <div className="mhwc-value">
                    <span>{status.critical.multiple}x</span>
                </div>
            </div>
        ), (
            <div key="sharpness" className="mhwc-item">
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
            <div key="element" className="mhwc-item">
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
            <div key="elderseal" className="mhwc-item">
                <div className="mhwc-name">
                    <span>Elderseal</span>
                </div>
                <div className="mhwc-value">
                    <span>{status.elderseal.affinity}</span>
                </div>
            </div>
        ), (
            <div key="defense" className="mhwc-item">
                <div className="mhwc-name">
                    <span>Defense</span>
                </div>
                <div className="mhwc-value">
                    <span>{status.defense}</span>
                </div>
            </div>
        ), (
            <div key="resistance" className="mhwc-item">
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
            <div key="skills" className="mhwc-item">
                <div className="mhwc-name">
                    <span>Skills</span>
                </div>
                <div className="mhwc-value">
                    {status.skills.sort((a, b) => {
                        return b.level - a.level;
                    }).map((data) => {
                        return (
                            <div key={data.name}>
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
