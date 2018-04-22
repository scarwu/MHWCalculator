'use strict';
/**
 * Character Status
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React, { Component } from 'react';

// Load Core Libraries
import Event from 'core/event';

// Load Custom Libraries
import Misc from 'library/misc';
import DataSet from 'library/dataset';

// Load Constant & Lang
import Constant from 'constant';
import Lang from 'lang';

export default class CharacterStatus extends Component {

    // Default Props
    static defaultProps = {
        equips: Misc.deepCopy(Constant.defaultEquips)
    };

    // Initial State
    state = {
        equips: Misc.deepCopy(Constant.defaultEquips),
        status: Misc.deepCopy(Constant.defaultStatus),
        extraInfo: Misc.deepCopy(Constant.defaultExtraInfo),
        passiveSkills: {},
        tuning: {
            rawAttack: 5,
            rawCriticalRate: 10,
            rawCriticalMultiple: 0.1,
            elementAttack: 100
        }
    };

    /**
     * Handle Functions
     */
    handlePassiveSkillToggle = (skillKey) => {
        let passiveSkills = this.state.passiveSkills;

        passiveSkills[skillKey].isActive = !passiveSkills[skillKey].isActive;

        this.setState({
            passiveSkills: passiveSkills,
        }, () => {
            this.generateStatus();
        });
    };

    handleTuningChange = () => {
        let tuningRawAttack = this.refs.tuningRawAttack.value;
        let tuningElementAttack = this.refs.tuningElementAttack.value;
        let tuningRawCriticalRate = this.refs.tuningRawCriticalRate.value;
        let tuningRawCriticalMultiple = this.refs.tuningRawCriticalMultiple.value;

        tuningRawAttack = parseInt(tuningRawAttack, 10);
        tuningRawCriticalRate = parseInt(tuningRawCriticalRate, 10);
        tuningRawCriticalMultiple = parseFloat(tuningRawCriticalMultiple);
        tuningElementAttack = parseInt(tuningElementAttack, 10);

        tuningRawAttack = !isNaN(tuningRawAttack)
            ? tuningRawAttack : 0;
        tuningRawCriticalRate = !isNaN(tuningRawCriticalRate)
            ? tuningRawCriticalRate : 0;
        tuningRawCriticalMultiple = !isNaN(tuningRawCriticalMultiple)
            ? tuningRawCriticalMultiple : 0;
        tuningElementAttack = !isNaN(tuningElementAttack)
            ? tuningElementAttack : 0;

        this.setState({
            tuning: {
                rawAttack: tuningRawAttack,
                rawCriticalRate: tuningRawCriticalRate,
                rawCriticalMultiple: tuningRawCriticalMultiple,
                elementAttack: tuningElementAttack
            }
        }, () => {
            this.generateExtraInfo();
        });
    };

    /**
     * Generate Functions
     */
    generateStatus = () => {
        let equips = this.state.equips;
        let passiveSkills = this.state.passiveSkills;
        let status = Misc.deepCopy(Constant.defaultStatus);

        let info = {};

        info.weapon = (null !== equips.weapon.key)
            ? DataSet.weaponHelper.getApplyedInfo(equips.weapon) : null;

        ['helm', 'chest', 'arm', 'waist', 'leg'].map((equipType) => {
            info[equipType] = (null !== equips[equipType].key)
                ? DataSet.armorHelper.getApplyedInfo(equips[equipType]) : null;
        });

        info.charm = (null !== equips.charm.key)
            ? DataSet.charmHelper.getApplyedInfo(equips.charm) : null;

        if (null !== info.weapon) {
            status.critical.rate = info.weapon.criticalRate;
            status.sharpness = info.weapon.sharpness;
            status.element = info.weapon.element;
            status.elderseal = info.weapon.elderseal;
        }

        // Defense
        ['weapon', 'helm', 'chest', 'arm', 'waist', 'leg'].map((equipType) => {
            if (null === info[equipType]) {
                return false;
            }

            status.defense += info[equipType].defense;
        });

        // Resistance
        ['helm', 'chest', 'arm', 'waist', 'leg'].map((equipType) => {
            if (null === info[equipType]) {
                return false;
            }

            Constant.elements.map((elementType) => {
                status.resistance[elementType] += info[equipType].resistance[elementType];
            });
        });

        // Skills
        let allSkills = {};

        ['weapon', 'helm', 'chest', 'arm', 'waist', 'leg', 'charm'].map((equipType) => {
            if (null === info[equipType]) {
                return false;
            }

            info[equipType].skills.map((skill) => {
                if (undefined === allSkills[skill.key]) {
                    allSkills[skill.key] = 0;
                }

                allSkills[skill.key] += skill.level;
            });
        });

        let noneElementAttackMutiple = null;
        let enableElement = null;
        let attackMultiples = [];
        let defenseMultiples = [];

        for (let skillKey in allSkills) {
            let skill = DataSet.skillHelper.getInfo(skillKey);
            let level = allSkills[skillKey];

            // Fix Skill Level Overflow
            if (level > skill.list.length) {
                level = skill.list.length;
            }

            status.skills.push({
                name: skill.name,
                level: level,
                description: skill.list[level - 1].description
            });

            if ('passive' === skill.type) {
                if (undefined === passiveSkills[skill.name]) {
                    passiveSkills[skill.name] = {
                        isActive: false
                    };
                }

                if (false === passiveSkills[skill.name].isActive) {
                    continue;
                }
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
                    status.critical.multiple.positive = data.value;

                    break;
                case 'sharpness':
                    if (null == status.sharpness) {
                        break;
                    }

                    status.sharpness.value += data.value;

                    break;
                case 'elementAttack':
                    if (null === status.element.attack
                        || status.element.attack.type !== data.type) {

                        break;
                    }

                    status.element.attack.value += data.value;
                    status.element.attack.value *= data.multiple;

                    if (status.element.attack.value > status.element.attack.maxValue) {
                        status.element.attack.value = status.element.attack.maxValue;
                    }

                    break;
                case 'elementStatus':
                    if (null === status.element.status
                        || status.element.status.type !== data.type) {

                        break;
                    }

                    status.element.status.value += data.value;
                    status.element.status.value *= data.multiple;

                    if (status.element.status.value > status.element.status.maxValue) {
                        status.element.status.value = status.element.status.maxValue;
                    }

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
        if (null !== info.weapon) {
            let weaponAttack = info.weapon.attack;
            let weaponType = info.weapon.type;

            status.attack *= Constant.weaponMultiple[weaponType]; // 武器倍率

            if (null == enableElement && null !== noneElementAttackMutiple) {
                status.attack += weaponAttack * noneElementAttackMutiple.value;
            } else {
                status.attack += weaponAttack;
            }
        } else {
            status.attack = 0;
        }

        if (null !== enableElement) {
            if (null !== status.element.status) {
                status.element.attack.value *= enableElement.multiple;
                status.element.attack.value = parseInt(Math.round(status.element.attack.value));
                status.element.attack.isHidden = false;
            }

            if (null !== status.element.status) {
                status.element.status.value *= enableElement.multiple;
                status.element.status.value = parseInt(Math.round(status.element.status.value));
                status.element.status.isHidden = false;
            }
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
            status: status,
            passiveSkills: passiveSkills
        }, () => {
            this.generateExtraInfo();
        });
    };

    generateExtraInfo = () => {
        let equips = this.state.equips;
        let status = Misc.deepCopy(this.state.status);
        let extraInfo = Misc.deepCopy(Constant.defaultExtraInfo);

        let result = this.getBasicExtraInfo(equips, status, {});

        extraInfo.rawAttack = result.rawAttack;
        extraInfo.rawCriticalAttack = result.rawCriticalAttack;
        extraInfo.rawExpectedValue = result.rawExpectedValue;
        extraInfo.elementAttack = result.elementAttack;
        extraInfo.elementEexpectedValue = result.elementEexpectedValue;
        extraInfo.expectedValue = result.expectedValue;

        let tuning = this.state.tuning;

        // Raw Attack Tuning
        status = Misc.deepCopy(this.state.status);
        result = this.getBasicExtraInfo(equips, status, {
            rawAttack: tuning.rawAttack
        });

        extraInfo.perNRawAttackExpectedValue = result.rawExpectedValue - extraInfo.rawExpectedValue;

        // Critical Rate Tuning
        status = Misc.deepCopy(this.state.status);
        result = this.getBasicExtraInfo(equips, status, {
            rawCriticalRate: tuning.rawCriticalRate
        });

        extraInfo.perNRawCriticalRateExpectedValue = result.rawExpectedValue - extraInfo.rawExpectedValue;

        // Critical Multiple Tuning
        status = Misc.deepCopy(this.state.status);
        result = this.getBasicExtraInfo(equips, status, {
            rawCriticalMultiple: tuning.rawCriticalMultiple
        });

        extraInfo.perNRawCriticalMultipleExpectedValue = result.rawExpectedValue - extraInfo.rawExpectedValue;

        // Element Attack Tuning
        status = Misc.deepCopy(this.state.status);
        result = this.getBasicExtraInfo(equips, status, {
            elementAttack: tuning.elementAttack
        });

        extraInfo.perNElementAttackExpectedValue = result.elementExpectedValue - extraInfo.elementExpectedValue;

        this.setState({
            extraInfo: extraInfo
        });
    };

    getBasicExtraInfo = (equips, status, tuning) => {
        let rawAttack = 0;
        let rawCriticalAttack = 0;
        let rawExpectedValue = 0;
        let elementAttack = 0;
        let elementExpectedValue = 0;
        let expectedValue = 0;

        if (null !== equips.weapon.key) {
            let weaponInfo = DataSet.weaponHelper.getApplyedInfo(equips.weapon);
            let weaponMultiple = Constant.weaponMultiple[weaponInfo.type];
            let sharpnessMultiple = this.getSharpnessMultiple(status.sharpness);

            rawAttack = (status.attack / weaponMultiple);

            if (undefined !== tuning.rawAttack) {
                rawAttack += tuning.rawAttack;
            }

            if (undefined !== tuning.rawCriticalRate) {
                status.critical.rate += tuning.rawCriticalRate;
            }

            if (undefined !== tuning.rawCriticalMultiple) {
                status.critical.multiple.positive += tuning.rawCriticalMultiple;
            }

            let criticalMultiple = (0 <= status.critical.rate)
                ? status.critical.multiple.positive
                : status.critical.multiple.nagetive;

            if (null !== status.element.attack
                && !status.element.attack.isHidden) {

                elementAttack = status.element.attack.value;

                if (undefined !== tuning.elementAttack) {
                    elementAttack += tuning.elementAttack;
                }

                elementAttack = elementAttack / 10;
            }

            rawAttack *= sharpnessMultiple.raw;
            rawCriticalAttack = rawAttack * criticalMultiple;
            rawExpectedValue = (rawAttack * (100 - Math.abs(status.critical.rate)) / 100)
                + (rawCriticalAttack * Math.abs(status.critical.rate) / 100);

            elementAttack *= sharpnessMultiple.element;
            elementExpectedValue = elementAttack;

            expectedValue = rawExpectedValue + elementExpectedValue;

            rawAttack = parseInt(Math.round(rawAttack));
            rawCriticalAttack = parseInt(Math.round(rawCriticalAttack));
            rawExpectedValue = parseInt(Math.round(rawExpectedValue));
            elementAttack = parseInt(Math.round(elementAttack));
            elementExpectedValue = parseInt(Math.round(elementExpectedValue));
            expectedValue = parseInt(Math.round(expectedValue));
        }

        return {
            rawAttack: rawAttack,
            rawCriticalAttack: rawCriticalAttack,
            rawExpectedValue: rawExpectedValue,
            elementAttack: elementAttack,
            elementExpectedValue: elementExpectedValue,
            expectedValue: expectedValue
        }
    };

    getSharpnessMultiple = (data) => {
        if (null === data) {
            return {
                raw: 1,
                element: 1
            };
        }

        let currentStep = null;
        let currentValue = 0;

        for (let stepKey in data.steps) {
            currentStep = stepKey;
            currentValue += data.steps[stepKey];

            if (currentValue >= data.value) {
                break;
            }
        }

        return {
            raw: Constant.sharpnessMultiple.raw[currentStep],
            element: Constant.sharpnessMultiple.element[currentStep]
        };
    };

    /**
     * Lifecycle Functions
     */
    componentWillMount () {
        this.setState({
            equips: this.props.equips,
            passiveSkills: {}
        }, () => {
            this.generateStatus();
        });
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            equips: nextProps.equips,
            passiveSkills: {}
        }, () => {
            this.generateStatus();
        });
    }

    /**
     * Render Functions
     */
    renderSharpnessBar = (data) => {
        return (
            <div className="mhwc-bar">
                <div className="mhwc-steps">
                    {['red', 'orange', 'yellow', 'green', 'blue', 'white'].map((step) => {
                        return (
                            <div key={'sharpness_' + step} className="mhwc-step" style={{
                                width: (data.steps[step] / 4) + '%'
                            }}></div>
                        );
                    })}
                </div>

                <div className="mhwc-mask" style={{
                    width: ((400 - data.value) / 4) + '%'
                }}></div>
            </div>
        );
    };

    render () {
        let status = this.state.status;
        let extraInfo = this.state.extraInfo;
        let passiveSkills = this.state.passiveSkills;

        if (null === status) {
            return false;
        }

        return [(
            <div key="health" className="row mhwc-item mhwc-health">
                <div className="col-4 mhwc-name">
                    <span>體力</span>
                </div>
                <div className="col-8 mhwc-value">
                    <span>{status.health}</span>
                </div>
            </div>
        ), (
            <div key="stamina" className="row mhwc-item mhwc-stamina">
                <div className="col-4 mhwc-name">
                    <span>耐力</span>
                </div>
                <div className="col-8 mhwc-value">
                    <span>{status.stamina}</span>
                </div>
            </div>
        ), (null !== status.sharpness) ? (
            <div key="sharpness" className="row mhwc-item mhwc-sharpness">
                <div className="col-4 mhwc-name">
                    <span>斬位</span>
                </div>
                <div className="col-8 mhwc-value">
                    {this.renderSharpnessBar(status.sharpness)}
                </div>
            </div>
        ) : false, (
            <div key="attack" className="row mhwc-item mhwc-attack">
                <div className="col-4 mhwc-name">
                    <span>攻擊力</span>
                </div>
                <div className="col-8 mhwc-value">
                    <span>{status.attack}</span>
                </div>
            </div>
        ), (null !== status.element.attack) ? (
            <div key="elementAttack" className="row mhwc-item mhwc-element_attack">
                <div className="col-4 mhwc-name">
                    <span>{Lang[status.element.attack.type]}屬性</span>
                </div>
                <div className="col-8 mhwc-value">
                    {status.element.attack.isHidden ? (
                        <span>({status.element.attack.value})</span>
                    ) : (
                        <span>{status.element.attack.value}</span>
                    )}
                </div>
            </div>
        ) : false, (null !== status.element.status) ? (
            <div key="elementStatus" className="row mhwc-item mhwc-element_status">
                <div className="col-4 mhwc-name">
                    <span>{Lang[status.element.status.type]}屬性</span>
                </div>
                <div className="col-8 mhwc-value">
                    {status.element.status.isHidden ? (
                        <span>({status.element.status.value})</span>
                    ) : (
                        <span>{status.element.status.value}</span>
                    )}
                </div>
            </div>
        ) : false, (null !== status.elderseal) ? (
            <div key="elderseal" className="row mhwc-item mhwc-elderseal">
                <div className="col-4 mhwc-name">
                    <span>龍封力</span>
                </div>
                <div className="col-8 mhwc-value">
                    <span>{Lang[status.elderseal.affinity]}</span>
                </div>
            </div>
        ) : false, (
            <div key="criticalRate" className="row mhwc-item mhwc-critical_rate">
                <div className="col-4 mhwc-name">
                    <span>會心率</span>
                </div>
                <div className="col-8 mhwc-value">
                    <span>{status.critical.rate}%</span>
                </div>
            </div>
        ), (
            <div key="criticalMultiple" className="row mhwc-item mhwc-critical_multiple">
                <div className="col-4 mhwc-name">
                    <span>會心倍數</span>
                </div>
                <div className="col-8 mhwc-value">
                    {(0 <= status.critical.rate) ? (
                        <span>{status.critical.multiple.positive}x</span>
                    ) : (
                        <span>{status.critical.multiple.nagetive}x</span>
                    )}
                </div>
            </div>
        ), (
            <div key="defense" className="row mhwc-item mhwc-defense">
                <div className="col-4 mhwc-name">
                    <span>防禦力</span>
                </div>
                <div className="col-8 mhwc-value">
                    <span>{status.defense}</span>
                </div>
            </div>
        ), (
            <div key="resistance" className="row mhwc-item mhwc-resistance">
                <div className="col-12 mhwc-name">
                    <span>抗性</span>
                </div>
                <div className="col-12 mhwc-value">
                    {Constant.elements.map((elementType) => {
                        return (
                            <div key={'resistance_' + elementType} className={`row mhwc-${elementType}`}>
                                <div className="col-4 mhwc-name">
                                    <span>{Lang[elementType]}</span>
                                </div>
                                <div className="col-8 mhwc-value">
                                    <span>{status.resistance[elementType]}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        ), (
            <div key="skills" className="row mhwc-item mhwc-skills">
                <div className="col-12 mhwc-name">
                    <span>技能</span>
                </div>
                <div className="col-12 mhwc-value">
                    {status.skills.sort((a, b) => {
                        return b.level - a.level;
                    }).map((data) => {
                        return (
                            <div key={data.name} className="row mhwc-skill">
                                <div className="col-12 mhwc-name">
                                    <span>{data.name} Lv.{data.level}</span>

                                    {undefined !== passiveSkills[data.name] ? (
                                        <a className="mhwc-icon" onClick={() => {this.handlePassiveSkillToggle(data.name)}}>
                                            {passiveSkills[data.name].isActive ? (
                                                <i className="fa fa-eye"></i>
                                            ) : (
                                                <i className="fa fa-eye-slash"></i>
                                            )}
                                        </a>
                                    ) : false}
                                </div>
                                <div className="col-12 mhwc-value">
                                    <span>{data.description}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        ), (
            <div key="extraInfo" className="row mhwc-item mhwc-extra_info">
                <div className="col-12 mhwc-name">
                    <span>額外資訊</span>
                </div>
                <div className="col-12 mhwc-value">
                    <div className="row">
                        <div className="col-4 mhwc-name">
                            <span>基礎傷害</span>
                        </div>
                        <div className="col-8 mhwc-value">
                            <span>{extraInfo.rawAttack}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4 mhwc-name">
                            <span>基礎會心傷害</span>
                        </div>
                        <div className="col-8 mhwc-value">
                            <span>{extraInfo.rawCriticalAttack}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4 mhwc-name">
                            <span>基礎期望值</span>
                        </div>
                        <div className="col-8 mhwc-value">
                            <span>{extraInfo.rawExpectedValue}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4 mhwc-name">
                            <span>屬性傷害</span>
                        </div>
                        <div className="col-8 mhwc-value">
                            <span>{extraInfo.elementAttack}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4 mhwc-name">
                            <span>屬性期望值</span>
                        </div>
                        <div className="col-8 mhwc-value">
                            <span>{extraInfo.elementExpectedValue}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4 mhwc-name">
                            <span>總期望值</span>
                        </div>
                        <div className="col-8 mhwc-value">
                            <span>{extraInfo.expectedValue}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-8 mhwc-name">
                            <span>每</span>
                            <input className="mhwc-tuning" type="text" defaultValue={this.state.tuning.rawAttack}
                                ref="tuningRawAttack" onChange={this.handleTuningChange} />
                            <span>點基礎攻擊力期望值</span>
                        </div>
                        <div className="col-4 mhwc-value">
                            <span>{extraInfo.perNRawAttackExpectedValue}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-8 mhwc-name">
                            <span>每</span>
                            <input className="mhwc-tuning" type="text" defaultValue={this.state.tuning.rawCriticalRate}
                                ref="tuningRawCriticalRate" onChange={this.handleTuningChange} />
                            <span>點會心率期望值</span>
                        </div>
                        <div className="col-4 mhwc-value">
                            <span>{extraInfo.perNRawCriticalRateExpectedValue}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-8 mhwc-name">
                            <span>每</span>
                            <input className="mhwc-tuning" type="text" defaultValue={this.state.tuning.rawCriticalMultiple}
                                ref="tuningRawCriticalMultiple" onChange={this.handleTuningChange} />
                            <span>點會心倍數期望值</span>
                        </div>
                        <div className="col-4 mhwc-value">
                            <span>{extraInfo.perNRawCriticalMultipleExpectedValue}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-8 mhwc-name">
                            <span>每</span>
                            <input className="mhwc-tuning" type="text" defaultValue={this.state.tuning.elementAttack}
                                ref="tuningElementAttack" onChange={this.handleTuningChange} />
                            <span>點屬性攻擊力期望值</span>
                        </div>
                        <div className="col-4 mhwc-value">
                            <span>{extraInfo.perNElementAttackExpectedValue}</span>
                        </div>
                    </div>
                </div>
            </div>
        )];
    }
}
