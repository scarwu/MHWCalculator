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

                                    enhance = equips.weapon.enhanceKeys[index]
                                }

                                return (
                                    <div key={data.key + '_' + index} className="row mhwc-enhance">
                                        <div className="col-4 mhwc-name">
                                            <span>強化 {index + 1}</span>
                                        </div>
                                        <div className="col-8 mhwc-value">
                                            {null !== enhance ? (
                                                <span>{enhance}</span>
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

    renderStatus = () => {
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
        ), (
            <div key="attack" className="row mhwc-item mhwc-attack">
                <div className="col-4 mhwc-name">
                    <span>攻擊力</span>
                </div>
                <div className="col-8 mhwc-value">
                    <span>{status.attack}</span>
                </div>
            </div>
        ), (
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
        ), (
            <div key="element" className="row mhwc-item mhwc-element">
                <div className="col-12 mhwc-name">
                    <span>屬性</span>
                </div>
                <div className="col-12 mhwc-value">
                    <div className="row">
                        <div className="col-4 mhwc-name">
                            <span>{Lang[status.element.type]}</span>
                        </div>
                        <div className="col-8 mhwc-value">
                            {status.element.isHidden ? (
                                <span>({status.element.value})</span>
                            ) : (
                                <span>{status.element.value}</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        ), (
            <div key="elderseal" className="row mhwc-item mhwc-elderseal">
                <div className="col-4 mhwc-name">
                    <span>龍封力</span>
                </div>
                <div className="col-8 mhwc-value">
                    <span>{Lang[status.elderseal.affinity]}</span>
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
                            {this.renderStatus()}
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
