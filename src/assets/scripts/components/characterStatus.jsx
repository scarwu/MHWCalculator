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
import React, { Fragment, useState, useEffect, useRef } from 'react';

// Load Core Libraries
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';
import SetDataset from 'libraries/dataset/set';
import SkillDataset from 'libraries/dataset/skill';
import CommonDataset from 'libraries/dataset/common';

// Load Components
import FunctionalButton from 'components/common/functionalButton';
import SharpnessBar from 'components/common/sharpnessBar';

// Load Constant
import Constant from 'constant';

// Load State Control
import CommonStates from 'states/common';

/**
 * Generate Functions
 */
let generateEquipInfos = (equips) => {
    let equipInfos = {};

    equipInfos.weapon = CommonDataset.getAppliedWeaponInfo(equips.weapon);

    ['helm', 'chest', 'arm', 'waist', 'leg'].forEach((equipType) => {
        equipInfos[equipType] = CommonDataset.getAppliedArmorInfo(equips[equipType]);
    });

    equipInfos.charm = CommonDataset.getAppliedCharmInfo(equips.charm);

    return equipInfos;
};

let generatePassiveSkills = (equipInfos) => {
    let passiveSkills = {};

    ['weapon', 'helm', 'chest', 'arm', 'waist', 'leg', 'charm'].forEach((equipType) => {
        if (Helper.isEmpty(equipInfos[equipType])) {
            return;
        }

        equipInfos[equipType].skills.forEach((skill) => {
            let skillInfo = SkillDataset.getInfo(skill.id);

            if (Helper.isEmpty(skillInfo)) {
                return;
            }

            if ('passive' === skillInfo.type) {
                if (Helper.isEmpty(passiveSkills[skillInfo.id])) {
                    passiveSkills[skillInfo.id] = {
                        isActive: false
                    };
                }
            }
        });
    });

    return passiveSkills;
};

let generateStatus = (equipInfos, passiveSkills) => {
    let status = Helper.deepCopy(Constant.defaultStatus);

    if (Helper.isNotEmpty(equipInfos.weapon)) {
        status.critical.rate = equipInfos.weapon.criticalRate;
        status.sharpness = equipInfos.weapon.sharpness;
        status.element = equipInfos.weapon.element;
        status.elderseal = equipInfos.weapon.elderseal;
    }

    // Defense
    ['weapon', 'helm', 'chest', 'arm', 'waist', 'leg'].forEach((equipType) => {
        if (Helper.isEmpty(equipInfos[equipType])) {
            return;
        }

        status.defense += equipInfos[equipType].defense;
    });

    // Resistance & Set
    let setMapping = {};

    ['helm', 'chest', 'arm', 'waist', 'leg'].forEach((equipType) => {
        if (Helper.isEmpty(equipInfos[equipType])) {
            return;
        }

        Constant.resistances.forEach((elementType) => {
            status.resistance[elementType] += equipInfos[equipType].resistance[elementType];
        });

        if (Helper.isNotEmpty(equipInfos[equipType].set)) {
            let setId = equipInfos[equipType].set.id;

            if (Helper.isEmpty(setMapping[setId])) {
                setMapping[setId] = 0;
            }

            setMapping[setId]++;
        }
    });

    // Skills
    let allSkills = {};

    ['weapon', 'helm', 'chest', 'arm', 'waist', 'leg', 'charm'].forEach((equipType) => {
        if (Helper.isEmpty(equipInfos[equipType])) {
            return;
        }

        equipInfos[equipType].skills.forEach((skill) => {
            if (Helper.isEmpty(allSkills[skill.id])) {
                allSkills[skill.id] = 0;
            }

            allSkills[skill.id] += skill.level;
        });
    });

    Object.keys(setMapping).forEach((setId) => {
        let setCount = setMapping[setId];
        let setInfo = SetDataset.getInfo(setId);

        if (Helper.isEmpty(setInfo)) {
            return;
        }

        setInfo.skills.forEach((skill) => {
            if (skill.require > setCount) {
                return;
            }

            let skillInfo = SkillDataset.getInfo(skill.id);

            status.sets.push({
                id: setId,
                require: skill.require,
                skill: {
                    id: skillInfo.id,
                    level: 1
                }
            });

            if (Helper.isEmpty(allSkills[skill.id])) {
                allSkills[skill.id] = 0;
            }

            allSkills[skill.id] += 1;
        });
    });

    let noneElementAttackMutiple = null;
    let enableElement = null;
    let elementAttack = null;
    let elementStatus = null;
    let attackMultipleList = [];
    let defenseMultipleList = [];

    for (let skillId in allSkills) {
        let skillInfo = SkillDataset.getInfo(skillId);

        if (Helper.isEmpty(skillInfo)) {
            continue;
        }

        let skillLevel = allSkills[skillId];

        // Fix Skill Level Overflow
        if (skillLevel > skillInfo.list.length) {
            skillLevel = skillInfo.list.length;
        }

        status.skills.push({
            id: skillId,
            level: skillLevel,
            description: skillInfo.list[skillLevel - 1].description
        });

        if ('passive' === skillInfo.type) {
            if (Helper.isEmpty(passiveSkills[skillId])) {
                passiveSkills[skillId] = {
                    isActive: false
                };
            }

            if (false === passiveSkills[skillId].isActive) {
                continue;
            }
        }

        if (Helper.isEmpty(skillInfo.list[skillLevel - 1].reaction)) {
            continue;
        }

        for (let reactionType in skillInfo.list[skillLevel - 1].reaction) {
            let data = skillInfo.list[skillLevel - 1].reaction[reactionType];

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
                if (Helper.isEmpty(status.sharpness)) {
                    break;
                }

                status.sharpness.value += data.value;

                break;
            case 'elementAttack':
                if (Helper.isEmpty(status.element)
                    || Helper.isEmpty(status.element.attack)
                    || status.element.attack.type !== data.type
                ) {
                    break;
                }

                elementAttack = data;

                break;
            case 'elementStatus':
                if (Helper.isEmpty(status.element)
                    || Helper.isEmpty(status.element.status)
                    || status.element.status.type !== data.type
                ) {
                    break;
                }

                elementStatus = data;

                break;
            case 'resistance':
                if ('all' === data.type) {
                    Constant.resistances.forEach((elementType) => {
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
                attackMultipleList.push(data.value);

                break;
            case 'defenseMultiple':
                if (Helper.isNotEmpty(status.element)
                    && false === status.element.isHidden
                ) {
                    break;
                }

                defenseMultipleList.push(data.value);

                break;
            }
        }
    }

    // Last Status Completion
    if (Helper.isNotEmpty(equipInfos.weapon)) {
        let weaponAttack = equipInfos.weapon.attack;
        let weaponType = equipInfos.weapon.type;

        status.attack *= Constant.weaponMultiple[weaponType]; // 武器倍率

        if (Helper.isEmpty(enableElement)
            && Helper.isNotEmpty(noneElementAttackMutiple)
        ) {
            status.attack += weaponAttack * noneElementAttackMutiple.value;
        } else {
            status.attack += weaponAttack;
        }
    } else {
        status.attack = 0;
    }

    // Attack Element
    if (Helper.isNotEmpty(status.element)
        && Helper.isNotEmpty(status.element.attack)
    ) {
        if (Helper.isNotEmpty(enableElement)) {
            status.element.attack.value *= enableElement.multiple;
            status.element.attack.isHidden = false;
        }

        if (Helper.isNotEmpty(elementAttack)) {
            status.element.attack.value += elementAttack.value;
            status.element.attack.value *= elementAttack.multiple;

            if (status.element.attack.value > status.element.attack.maxValue) {
                status.element.attack.value = status.element.attack.maxValue;
            }
        }

        status.element.attack.value = parseInt(Math.round(status.element.attack.value));
    }

    // Status Element
    if (Helper.isNotEmpty(status.element)
        && Helper.isNotEmpty(status.element.status)
    ) {
        if (Helper.isNotEmpty(enableElement)) {
            status.element.status.value *= enableElement.multiple;
            status.element.status.isHidden = false;
        }

        if (Helper.isNotEmpty(elementStatus)) {
            status.element.status.value += elementStatus.value;
            status.element.status.value *= elementStatus.multiple;

            if (status.element.status.value > status.element.status.maxValue) {
                status.element.status.value = status.element.status.maxValue;
            }
        }

        status.element.status.value = parseInt(Math.round(status.element.status.value));
    }

    attackMultipleList.forEach((multiple) => {
        status.attack *= multiple;
    });

    defenseMultipleList.forEach((multiple) => {
        status.defense *= multiple;
    });

    status.attack = parseInt(Math.round(status.attack));
    status.defense = parseInt(Math.round(status.defense));

    return status;
};

let generateExtraInfo = (equipInfos, status, tuning) => {
    let extraInfo = Helper.deepCopy(Constant.defaultExtraInfo);
    let result = getBasicExtraInfo(equipInfos, Helper.deepCopy(status), {});

    extraInfo.rawAttack = result.rawAttack;
    extraInfo.rawCriticalAttack = result.rawCriticalAttack;
    extraInfo.rawExpectedValue = result.rawExpectedValue;
    extraInfo.elementAttack = result.elementAttack;
    extraInfo.elementExpectedValue = result.elementExpectedValue;
    extraInfo.expectedValue = result.expectedValue;

    // Raw Attack Tuning
    result = getBasicExtraInfo(equipInfos, Helper.deepCopy(status), {
        rawAttack: tuning.rawAttack
    });

    extraInfo.perNRawAttackExpectedValue = result.rawExpectedValue - extraInfo.rawExpectedValue;
    extraInfo.perNRawAttackExpectedValue = Math.round(extraInfo.perNRawAttackExpectedValue * 100) / 100;

    // Critical Rate Tuning
    result = getBasicExtraInfo(equipInfos, Helper.deepCopy(status), {
        rawCriticalRate: tuning.rawCriticalRate
    });

    extraInfo.perNRawCriticalRateExpectedValue = result.rawExpectedValue - extraInfo.rawExpectedValue;
    extraInfo.perNRawCriticalRateExpectedValue = Math.round(extraInfo.perNRawCriticalRateExpectedValue * 100) / 100;

    // Critical Multiple Tuning
    result = getBasicExtraInfo(equipInfos, Helper.deepCopy(status), {
        rawCriticalMultiple: tuning.rawCriticalMultiple
    });

    extraInfo.perNRawCriticalMultipleExpectedValue = result.rawExpectedValue - extraInfo.rawExpectedValue;
    extraInfo.perNRawCriticalMultipleExpectedValue = Math.round(extraInfo.perNRawCriticalMultipleExpectedValue * 100) / 100;

    // Element Attack Tuning
    result = getBasicExtraInfo(equipInfos, Helper.deepCopy(status), {
        elementAttack: tuning.elementAttack
    });

    extraInfo.perNElementAttackExpectedValue = result.elementExpectedValue - extraInfo.elementExpectedValue;
    extraInfo.perNElementAttackExpectedValue = Math.round(extraInfo.perNElementAttackExpectedValue * 100) / 100;

    return extraInfo;
};

let getBasicExtraInfo = (equipInfos, status, tuning) => {
    let rawAttack = 0;
    let rawCriticalAttack = 0;
    let rawExpectedValue = 0;
    let elementAttack = 0;
    let elementExpectedValue = 0;
    let expectedValue = 0;

    if (Helper.isNotEmpty(equipInfos.weapon)) {
        let weaponMultiple = Constant.weaponMultiple[equipInfos.weapon.type];
        let sharpnessMultiple = getSharpnessMultiple(status.sharpness);

        rawAttack = (status.attack / weaponMultiple);

        if (Helper.isNotEmpty(tuning.rawAttack)) {
            rawAttack += tuning.rawAttack;
        }

        if (Helper.isNotEmpty(tuning.rawCriticalRate)) {
            status.critical.rate += tuning.rawCriticalRate;
        }

        if (Helper.isNotEmpty(tuning.rawCriticalMultiple)) {
            status.critical.multiple.positive += tuning.rawCriticalMultiple;
        }

        let criticalRate = (100 >= status.critical.rate)
            ? Math.abs(status.critical.rate) : 100;
        let criticalMultiple = (0 <= status.critical.rate)
            ? status.critical.multiple.positive
            : status.critical.multiple.nagetive;

        if (Helper.isNotEmpty(status.element)
            && Helper.isNotEmpty(status.element.attack)
            && !status.element.attack.isHidden
        ) {
            elementAttack = status.element.attack.value;

            if (Helper.isNotEmpty(tuning.elementAttack)) {
                elementAttack += tuning.elementAttack;
            }

            elementAttack = elementAttack / 10;
        }

        rawAttack *= sharpnessMultiple.raw;
        rawCriticalAttack = rawAttack * criticalMultiple;
        rawExpectedValue = (rawAttack * (100 - criticalRate) / 100)
            + (rawCriticalAttack * criticalRate / 100);

        elementAttack *= sharpnessMultiple.element;
        elementExpectedValue = elementAttack;

        expectedValue = rawExpectedValue + elementExpectedValue;

        rawAttack = Math.round(rawAttack * 100) / 100;
        rawCriticalAttack = Math.round(rawCriticalAttack * 100) / 100;
        rawExpectedValue = Math.round(rawExpectedValue * 100) / 100;
        elementAttack = Math.round(elementAttack * 100) / 100;
        elementExpectedValue = Math.round(elementExpectedValue * 100) / 100;
        expectedValue = Math.round(expectedValue * 100) / 100;
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

let getSharpnessMultiple = (data) => {
    if (Helper.isEmpty(data)) {
        return {
            raw: 1,
            element: 1
        };
    }

    let currentStep = null;
    let currentValue = 0;

    for (let stepName in data.steps) {
        currentStep = stepName;
        currentValue += data.steps[stepName];

        if (currentValue >= data.value) {
            break;
        }
    }

    return {
        raw: Constant.sharpnessMultiple.raw[currentStep],
        element: Constant.sharpnessMultiple.element[currentStep]
    };
};

export default function CharacterStatus(props) {

    /**
     * Hooks
     */
    const [stateCurrentEquips, updateCurrentEquips] = useState(CommonStates.getters.getCurrentEquips());
    const [stateEquipInfos, updateEquipInfos] = useState({});
    const [stateStatus, updateStatus] = useState(Helper.deepCopy(Constant.defaultStatus));
    const [stateExtraInfo, updateExtraInfo] = useState(Helper.deepCopy(Constant.defaultExtraInfo));
    const [statePassiveSkills, updatePassiveSkills] = useState({});
    const [stateTuning, updateTuning] = useState({
        rawAttack: 5,
        rawCriticalRate: 10,
        rawCriticalMultiple: 0.1,
        elementAttack: 100
    });
    const refTuningRawAttack = useRef();
    const refTuningRawCriticalRate = useRef();
    const refTuningRawCriticalMultiple = useRef();
    const refTuningElementAttack = useRef();

    useEffect(() => {
        const equipInfos = generateEquipInfos(stateCurrentEquips);
        const passiveSkills = generatePassiveSkills(equipInfos);
        const status = generateStatus(equipInfos, passiveSkills);
        const extraInfo = generateExtraInfo(equipInfos, status, stateTuning);

        updateEquipInfos(equipInfos);
        updatePassiveSkills(passiveSkills);
        updateStatus(status);
        updateExtraInfo(extraInfo);
    }, [stateCurrentEquips]);

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribe = CommonStates.store.subscribe(() => {
            updateCurrentEquips(CommonStates.getters.getCurrentEquips());
        });

        return () => {
            unsubscribe();
        };
    }, []);

    /**
     * Handle Functions
     */
    let handlePassiveSkillToggle = (skillId) => {
        const equipInfos = stateEquipInfos;
        const passiveSkills = statePassiveSkills;
        const tuning = stateTuning;

        passiveSkills[skillId].isActive = !passiveSkills[skillId].isActive;

        const status = generateStatus(equipInfos, passiveSkills);

        updatePassiveSkills(passiveSkills);
        updateStatus(status);
        updateExtraInfo(generateExtraInfo(equipInfos, status, tuning));
    };

    let handleTuningChange = () => {
        let tuningRawAttack = parseInt(refTuningRawAttack.current.value, 10);
        let tuningRawCriticalRate = parseFloat(refTuningRawCriticalRate.current.value, 10);
        let tuningRawCriticalMultiple = parseFloat(refTuningRawCriticalMultiple.current.value);
        let tuningElementAttack = parseInt(refTuningElementAttack.current.value, 10);

        tuningRawAttack = !isNaN(tuningRawAttack) ? tuningRawAttack : 0;
        tuningRawCriticalRate = !isNaN(tuningRawCriticalRate) ? tuningRawCriticalRate : 0;
        tuningRawCriticalMultiple = !isNaN(tuningRawCriticalMultiple) ? tuningRawCriticalMultiple : 0;
        tuningElementAttack = !isNaN(tuningElementAttack) ? tuningElementAttack : 0;

        const equipInfos = stateEquipInfos;
        const status = stateStatus;
        const tuning = {
            rawAttack: tuningRawAttack,
            rawCriticalRate: tuningRawCriticalRate,
            rawCriticalMultiple: tuningRawCriticalMultiple,
            elementAttack: tuningElementAttack
        };

        updateTuning(tuning);
        updateExtraInfo(generateExtraInfo(equipInfos, status, tuning));
    };

    /**
     * Render Functions
     */
    let equipInfos = stateEquipInfos;
    let passiveSkills = statePassiveSkills;
    let status = stateStatus;
    let extraInfo = stateExtraInfo;

    let originalSharpness = null;

    if (Helper.isNotEmpty(equipInfos.weapon)
        && Helper.isNotEmpty(equipInfos.weapon.sharpness)
    ) {
        originalSharpness = Helper.deepCopy(equipInfos.weapon.sharpness);
    }

    return (
        <div className="col mhwc-status">
            <div className="mhwc-panel">
                <span className="mhwc-title">{_('status')}</span>
            </div>

            <div className="mhwc-list">
                <div className="mhwc-item mhwc-normal">
                    <div className="col-12 mhwc-name">
                        <span>{_('general')}</span>
                    </div>
                    <div className="col-12 mhwc-content">
                        <div className="col-3 mhwc-name">
                            <span>{_('health')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{status.health}</span>
                        </div>

                        <div className="col-3 mhwc-name">
                            <span>{_('stamina')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{status.stamina}</span>
                        </div>
                    </div>
                </div>

                <div className="mhwc-item mhwc-attack">
                    <div className="col-12 mhwc-name">
                        <span>{_('attackProperty')}</span>
                    </div>
                    <div className="col-12 mhwc-content">
                        {Helper.isNotEmpty(status.sharpness) ? (
                            <Fragment>
                                <div className="col-3 mhwc-name">
                                    <span>{_('sharpness')}</span>
                                </div>
                                <div className="col-9 mhwc-value mhwc-sharpness">
                                    <SharpnessBar data={originalSharpness} />
                                    <SharpnessBar data={status.sharpness} />
                                </div>
                            </Fragment>
                        ) : false}

                        <div className="col-3 mhwc-name">
                            <span>{_('attack')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{status.attack}</span>
                        </div>

                        <div className="col-3 mhwc-name">
                            <span>{_('criticalRate')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{status.critical.rate}%</span>
                        </div>

                        <div className="col-3 mhwc-name">
                            <span>{_('criticalMultiple')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            {(0 <= status.critical.rate) ? (
                                <span>{status.critical.multiple.positive}x</span>
                            ) : (
                                <span>{status.critical.multiple.nagetive}x</span>
                            )}
                        </div>

                        {(Helper.isNotEmpty(status.element)
                            && Helper.isNotEmpty(status.element.attack)
                        ) ? (
                            <Fragment>
                                <div className="col-3 mhwc-name">
                                    <span>{_('element')}: {_(status.element.attack.type)}</span>
                                </div>
                                <div className="col-3 mhwc-value">
                                    {status.element.attack.isHidden ? (
                                        <span>({status.element.attack.value})</span>
                                    ) : (
                                        <span>{status.element.attack.value}</span>
                                    )}
                                </div>
                            </Fragment>
                        ) : false}

                        {(Helper.isNotEmpty(status.element)
                            && Helper.isNotEmpty(status.element.status)
                        ) ? (
                            <Fragment>
                                <div className="col-3 mhwc-name">
                                    <span>{_('element')}: {_(status.element.status.type)}</span>
                                </div>
                                <div className="col-3 mhwc-value">
                                    {status.element.status.isHidden ? (
                                        <span>({status.element.status.value})</span>
                                    ) : (
                                        <span>{status.element.status.value}</span>
                                    )}
                                </div>
                            </Fragment>
                        ) : false}

                        {(Helper.isNotEmpty(status.elderseal)) ? (
                            <Fragment>
                                <div className="col-3 mhwc-name">
                                    <span>{_('elderseal')}</span>
                                </div>
                                <div className="col-3 mhwc-value">
                                    <span>{_(status.elderseal.affinity)}</span>
                                </div>
                            </Fragment>
                        ) : false}
                    </div>
                </div>

                <div className="mhwc-item mhwc-defense">
                    <div className="col-12 mhwc-name">
                        <span>{_('defenseProperty')}</span>
                    </div>
                    <div className="col-12 mhwc-content">
                        <div className="col-3 mhwc-name">
                            <span>{_('defense')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{status.defense}</span>
                        </div>

                        {Constant.resistances.map((elementType) => {
                            return (
                                <Fragment key={elementType}>
                                    <div className="col-3 mhwc-name">
                                        <span>{_('resistance')}: {_(elementType)}</span>
                                    </div>
                                    <div className="col-3 mhwc-value">
                                        <span>{status.resistance[elementType]}</span>
                                    </div>
                                </Fragment>
                            );
                        })}
                    </div>
                </div>

                {(0 !== status.sets.length) ? (
                    <div className="mhwc-item mhwc-sets">
                        <div className="col-12 mhwc-name">
                            <span>{_('set')}</span>
                        </div>
                        <div className="col-12 mhwc-content">
                            {status.sets.map((data, index) => {
                                let setInfo = SetDataset.getInfo(data.id);
                                let skillInfo = SkillDataset.getInfo(data.skill.id);

                                return (Helper.isNotEmpty(setInfo)
                                    && Helper.isNotEmpty(skillInfo))
                                ? (
                                    <Fragment key={`${index}:${data.id}`} className="mhwc-set">
                                        <div className="col-12 mhwc-name">
                                            <span>{_(setInfo.name)} ({data.require})</span>
                                        </div>
                                        <div className="col-12 mhwc-value">
                                            <span>{_(skillInfo.name)} Lv.{data.skill.level}</span>
                                        </div>
                                    </Fragment>
                                ) : false;
                            })}
                        </div>
                    </div>
                ) : false}

                {(0 !== status.skills.length) ? (
                    <div className="mhwc-item mhwc-skills">
                        <div className="col-12 mhwc-name">
                            <span>{_('skill')}</span>
                        </div>
                        <div className="col-12 mhwc-content">
                            {status.skills.sort((skillA, skillB) => {
                                return skillB.level - skillA.level;
                            }).map((data) => {
                                let skillInfo = SkillDataset.getInfo(data.id);

                                return (Helper.isNotEmpty(skillInfo)) ? (
                                    <Fragment key={data.id}>
                                        <div className="col-12 mhwc-name">
                                            <span>{_(skillInfo.name)} Lv.{data.level}</span>
                                        </div>
                                        <div className="col-12 mhwc-value mhwc-description">
                                            <span>{_(data.description)}</span>

                                            <div className="mhwc-icons_bundle">
                                                {Helper.isNotEmpty(passiveSkills[data.id]) ? (
                                                    <FunctionalButton
                                                        iconName={passiveSkills[data.id].isActive ? 'eye' : 'eye-slash'}
                                                        altName={passiveSkills[data.id].isActive ? _('deactive') : _('active')}
                                                        onClick={() => {handlePassiveSkillToggle(data.id)}} />
                                                ) : false}
                                            </div>
                                        </div>
                                    </Fragment>
                                ) : false;
                            })}
                        </div>
                    </div>
                ) : false}

                <div className="mhwc-item mhwc-extra_info">
                    <div className="col-12 mhwc-name">
                        <span>{_('extraInfo')}</span>
                    </div>
                    <div className="col-12 mhwc-content">
                        <div className="col-9 mhwc-name">
                            <span>{_('rawAttack')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{extraInfo.rawAttack}</span>
                        </div>
                        <div className="col-9 mhwc-name">
                            <span>{_('rawCriticalAttack')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{extraInfo.rawCriticalAttack}</span>
                        </div>
                        <div className="col-9 mhwc-name">
                            <span>{_('rawEV')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{extraInfo.rawExpectedValue}</span>
                        </div>
                        <div className="col-9 mhwc-name">
                            <span>{_('elementAttack')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{extraInfo.elementAttack}</span>
                        </div>
                        <div className="col-9 mhwc-name">
                            <span>{_('elementEV')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{extraInfo.elementExpectedValue}</span>
                        </div>
                        <div className="col-9 mhwc-name">
                            <span>{_('totalEV')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{extraInfo.expectedValue}</span>
                        </div>
                        <div className="col-9 mhwc-name">
                            <span>{_('every')}</span>
                            <input className="mhwc-tuning" type="text" defaultValue={stateTuning.rawAttack}
                                ref={refTuningRawAttack} onChange={handleTuningChange} />
                            <span>{_('rawAttackEV')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{extraInfo.perNRawAttackExpectedValue}</span>
                        </div>
                        <div className="col-9 mhwc-name">
                            <span>{_('every')}</span>
                            <input className="mhwc-tuning" type="text" defaultValue={stateTuning.rawCriticalRate}
                                ref={refTuningRawCriticalRate} onChange={handleTuningChange} />
                            <span>{_('criticalRateEV')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{extraInfo.perNRawCriticalRateExpectedValue}</span>
                        </div>
                        <div className="col-9 mhwc-name">
                            <span>{_('every')}</span>
                            <input className="mhwc-tuning" type="text" defaultValue={stateTuning.rawCriticalMultiple}
                                ref={refTuningRawCriticalMultiple} onChange={handleTuningChange} />
                            <span>{_('criticalMultipleEV')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{extraInfo.perNRawCriticalMultipleExpectedValue}</span>
                        </div>
                        <div className="col-9 mhwc-name">
                            <span>{_('every')}</span>
                            <input className="mhwc-tuning" type="text" defaultValue={stateTuning.elementAttack}
                                ref={refTuningElementAttack} onChange={handleTuningChange} />
                            <span>{_('elementAttackEV')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{extraInfo.perNElementAttackExpectedValue}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
