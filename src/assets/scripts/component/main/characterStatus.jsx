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
import Status from 'core/status';

// Load Custom Libraries
import DataSet from 'library/dataset';

// Load Constant & Lang
import Constant from 'constant';
import Lang from 'lang';

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
    skills: [],
    extraInfo: {
        basicAttack: 0,
        basicCriticalAttack: 0,
        expectedValue: 0
    }
};

export default class CharacterStatus extends Component {

    // Default Props
    static defaultProps = {
        equips: defaultEquips
    };

    // Initial State
    state = {
        equips: null,
        status: null
    };

    /**
     * Generate Functions
     */
    generateStatus = () => {

        let equips = this.state.equips;
        let status = defaultStatus;
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
        ['weapon', 'helm', 'chest', 'arm', 'waist', 'leg'].map((equipType) => {
            status.defense += equips[equipType].info.defense;
        });

        // Resistance
        ['helm', 'chest', 'arm', 'waist', 'leg'].map((equipType) => {
            Constant.elements.map((elementType) => {
                status.resistance[elementType] += equips[equipType].info.resistance[elementType];
            });
        });

        // Skills from Equips
        ['helm', 'chest', 'arm', 'waist', 'leg', 'charm'].map((equipType) => {
            equips[equipType].info.skills.map((data) => {
                if (undefined === tempSkills[data.key]) {
                    tempSkills[data.key] = 0;
                }

                tempSkills[data.key] += data.level;
            });
        });

        // Skills from Slots
        ['weapon', 'helm', 'chest', 'arm', 'waist', 'leg'].map((equipType) => {
            Object.values(equips[equipType].slotKeys).map((slotKey) => {
                if (null === slotKey) {
                    return false;
                }

                let jewel = DataSet.jewel.getInfo(slotKey);

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

        if (status.critical.rate < 0) {
            status.critical.multiple = 0.75;
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

        // Expected Value
        let basicAttack = status.attack / Constant.weaponMultiple[weaponType];
        let basicCriticalAttack = basicAttack * status.critical.multiple;
        let expectedValue = (basicAttack * (100 - Math.abs(status.critical.rate)) / 100)
            + (basicCriticalAttack * Math.abs(status.critical.rate) / 100);

        status.extraInfo.basicAttack = parseInt(Math.round(basicAttack));
        status.extraInfo.basicCriticalAttack = parseInt(Math.round(basicCriticalAttack));
        status.extraInfo.expectedValue = parseInt(Math.round(expectedValue));

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
            equips: this.props.equips
        }, () => {
            this.generateStatus();
        });
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            equips: this.props.equips
        }, () => {
            this.generateStatus();
        });
    }

    render () {
        let status = this.state.status;

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
                    <div className="col-12 mhwc-steps">
                        {['red', 'orange', 'yellow', 'green', 'blue', 'white'].map((step) => {
                            return (
                                <div key={'sharpness_' + step} className="mhwc-step" style={{
                                    width: (status.sharpness.steps[step] / 4) + '%'
                                }}></div>
                            );
                        })}

                        <div className="mhwc-mask" style={{
                            width: ((400 - status.sharpness.value) / 4) + '%'
                        }}></div>
                    </div>
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
        ), (
            <div key="element" className="row mhwc-item mhwc-element">
                <div className="col-4 mhwc-name">
                    <span>{Lang[status.element.type]}屬性</span>
                </div>
                <div className="col-8 mhwc-value">
                    {status.element.isHidden ? (
                        <span>({status.element.value})</span>
                    ) : (
                        <span>{status.element.value}</span>
                    )}
                </div>
            </div>
        ), (null !== status.elderseal) ? (
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
                    <span>{status.critical.multiple}x</span>
                </div>
            </div>
        ), (
            <div key="defense" className="row mhwc-item mhwc-defense">
                <div className="col-4 mhwc-name">
                    <span>防禦</span>
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
                            <span>{status.extraInfo.basicAttack}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4 mhwc-name">
                            <span>基礎會心傷害</span>
                        </div>
                        <div className="col-8 mhwc-value">
                            <span>{status.extraInfo.basicCriticalAttack}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-4 mhwc-name">
                            <span>期望值</span>
                        </div>
                        <div className="col-8 mhwc-value">
                            <span>{status.extraInfo.expectedValue}</span>
                        </div>
                    </div>
                </div>
            </div>
        )];
    }
}
