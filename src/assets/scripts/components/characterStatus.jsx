/**
 * Character Status
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React, { Fragment, useState, useEffect, useCallback, useRef } from 'react';

// Load Core Libraries
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';
import SetDataset from 'libraries/dataset/set';
import SkillDataset from 'libraries/dataset/skill';
import WeaponDataset from 'libraries/dataset/weapon';
import CommonDataset from 'libraries/dataset/common';

// Load Components
import IconButton from 'components/common/iconButton';
import BasicInput from 'components/common/basicInput';
import SharpnessBar from 'components/common/sharpnessBar';

// Load State Control
import CommonState from 'states/common';

// Load Constant
import Constant from 'constant';

/**
 * Generate Functions
 */
const generateEquipInfos = (equips) => {
    let equipInfos = {};

    if (Helper.isNotEmpty(equips.weapon)
        && 'customWeapon' === equips.weapon.id
    ) {
        let isCompleted = true;
        let customWeapon = CommonState.getter.getCustomWeapon();

        if (Helper.isEmpty(customWeapon.type)
            || Helper.isEmpty(customWeapon.rare)
            || Helper.isEmpty(customWeapon.attack)
            || Helper.isEmpty(customWeapon.criticalRate)
            || Helper.isEmpty(customWeapon.defense)
        ) {
            isCompleted = false;
        }

        if (Helper.isNotEmpty(customWeapon.element.attack)
            && Helper.isEmpty(customWeapon.element.attack.minValue)
        ) {
            isCompleted = false;
        }

        if (Helper.isNotEmpty(customWeapon.element.status)
            && Helper.isEmpty(customWeapon.element.status.minValue)
        ) {
            isCompleted = false;
        }

        WeaponDataset.setInfo('customWeapon', (true === isCompleted)
            ? Helper.deepCopy(customWeapon) : undefined);
    }

    equipInfos.weapon = CommonDataset.getAppliedWeaponInfo(equips.weapon);

    ['helm', 'chest', 'arm', 'waist', 'leg'].forEach((equipType) => {
        equipInfos[equipType] = CommonDataset.getAppliedArmorInfo(equips[equipType]);
    });

    equipInfos.charm = CommonDataset.getAppliedCharmInfo(equips.charm);

    return equipInfos;
};

const generatePassiveSkills = (equipInfos) => {
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

const generateStatus = (equipInfos, passiveSkills) => {
    let status = Helper.deepCopy(Constant.default.status);

    equipInfos = Helper.deepCopy(equipInfos);

    let weaponType = null;

    if (Helper.isNotEmpty(equipInfos.weapon)) {
        status.critical.rate = equipInfos.weapon.criticalRate;
        status.sharpness = equipInfos.weapon.sharpness;
        status.element = equipInfos.weapon.element;
        status.elderseal = equipInfos.weapon.elderseal;

        weaponType = equipInfos.weapon.type;
    }

    // Resistance
    ['helm', 'chest', 'arm', 'waist', 'leg'].forEach((equipType) => {
        if (Helper.isEmpty(equipInfos[equipType])) {
            return;
        }

        Constant.resistances.forEach((elementType) => {
            status.resistance[elementType] += equipInfos[equipType].resistance[elementType];
        });
    });

    // Defense & Set
    let setMapping = {};

    ['weapon', 'helm', 'chest', 'arm', 'waist', 'leg'].forEach((equipType) => {
        if (Helper.isEmpty(equipInfos[equipType])) {
            return;
        }

        if (Helper.isNotEmpty(equipInfos[equipType].set)) {
            let setId = equipInfos[equipType].set.id;

            if (Helper.isEmpty(setMapping[setId])) {
                setMapping[setId] = 0;
            }

            setMapping[setId]++;
        }

        status.defense += equipInfos[equipType].defense;
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

            if (Helper.isEmpty(skillInfo)) {
                return;
            }

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

    let noneElementAttackMultiple = null;
    let resistanceMultiple = null;
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
            case 'elementAttackCriticalMultiple':
                if (null !== weaponType
                    && (status.elementCriticalMultiple.attack
                        < Constant.elementCriticalMultiple.attack[weaponType][data.value])
                ) {
                    status.elementCriticalMultiple.attack
                        = Constant.elementCriticalMultiple.attack[weaponType][data.value];
                }

                break;
            case 'elementStatusCriticalMultiple':
                if (null !== weaponType
                    && (status.elementCriticalMultiple.status
                        < Constant.elementCriticalMultiple.status[weaponType][data.value])
                ) {
                    status.elementCriticalMultiple.status
                        = Constant.elementCriticalMultiple.status[weaponType][data.value];
                }

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
            case 'resistanceMultiple':
                resistanceMultiple = data

                break;
            case 'noneElementAttackMultiple':
                noneElementAttackMultiple = data;

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
            && Helper.isNotEmpty(noneElementAttackMultiple)
        ) {
            status.attack += weaponAttack * noneElementAttackMultiple.value;
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

            if (Helper.isNotEmpty(status.element.attack.maxValue)
                && status.element.attack.value > status.element.attack.maxValue
            ) {
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

            if (Helper.isNotEmpty(status.element.status.maxValue)
                && status.element.status.value > status.element.status.maxValue
            ) {
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

    // Resistance Multiple
    if (Helper.isNotEmpty(resistanceMultiple)) {
        if ('all' === resistanceMultiple.type) {
            ['fire', 'water', 'thunder', 'ice', 'dragon'].forEach((type) => {
                status.resistance[type] *= resistanceMultiple.value;
                status.resistance[type] = parseInt(Math.round(status.resistance[type]))
            })
        } else {
            status.resistance[resistanceMultiple.type] *= resistanceMultiple.value;
            status.resistance[resistanceMultiple.type] = parseInt(Math.round(status.resistance[resistanceMultiple.type]))
        }
    }

    return status;
};

const generateBenefitAnalysis = (equipInfos, status, tuning) => {
    let benefitAnalysis = Helper.deepCopy(Constant.default.benefitAnalysis);
    let result = getBasicBenefitAnalysis(equipInfos, Helper.deepCopy(status), {});

    benefitAnalysis.physicalAttack = result.physicalAttack;
    benefitAnalysis.physicalCriticalAttack = result.physicalCriticalAttack;
    benefitAnalysis.physicalExpectedValue = result.physicalExpectedValue;
    benefitAnalysis.elementAttack = result.elementAttack;
    benefitAnalysis.elementCriticalAttack = result.elementCriticalAttack;
    benefitAnalysis.elementExpectedValue = result.elementExpectedValue;
    benefitAnalysis.expectedValue = result.expectedValue;

    // Physical Attack Tuning
    result = getBasicBenefitAnalysis(equipInfos, Helper.deepCopy(status), {
        physicalAttack: tuning.physicalAttack
    });

    benefitAnalysis.perPhysicalAttackExpectedValue = result.physicalExpectedValue - benefitAnalysis.physicalExpectedValue;
    benefitAnalysis.perPhysicalAttackExpectedValue = Math.round(benefitAnalysis.perPhysicalAttackExpectedValue * 100) / 100;

    // Critical Rate Tuning
    result = getBasicBenefitAnalysis(equipInfos, Helper.deepCopy(status), {
        physicalCriticalRate: tuning.physicalCriticalRate
    });

    benefitAnalysis.perPhysicalCriticalRateExpectedValue = result.physicalExpectedValue - benefitAnalysis.physicalExpectedValue;
    benefitAnalysis.perPhysicalCriticalRateExpectedValue = Math.round(benefitAnalysis.perPhysicalCriticalRateExpectedValue * 100) / 100;

    // Critical Multiple Tuning
    result = getBasicBenefitAnalysis(equipInfos, Helper.deepCopy(status), {
        physicalCriticalMultiple: tuning.physicalCriticalMultiple
    });

    benefitAnalysis.perPhysicalCriticalMultipleExpectedValue = result.physicalExpectedValue - benefitAnalysis.physicalExpectedValue;
    benefitAnalysis.perPhysicalCriticalMultipleExpectedValue = Math.round(benefitAnalysis.perPhysicalCriticalMultipleExpectedValue * 100) / 100;

    // Element Attack Tuning
    result = getBasicBenefitAnalysis(equipInfos, Helper.deepCopy(status), {
        elementAttack: tuning.elementAttack
    });

    benefitAnalysis.perElementAttackExpectedValue = result.elementExpectedValue - benefitAnalysis.elementExpectedValue;
    benefitAnalysis.perElementAttackExpectedValue = Math.round(benefitAnalysis.perElementAttackExpectedValue * 100) / 100;

    return benefitAnalysis;
};

const getBasicBenefitAnalysis = (equipInfos, status, tuning) => {
    let physicalAttack = 0;
    let physicalCriticalAttack = 0;
    let physicalExpectedValue = 0;
    let elementAttack = 0;
    let elementCriticalAttack = 0;
    let elementExpectedValue = 0;
    let expectedValue = 0;

    if (Helper.isNotEmpty(equipInfos.weapon)) {
        let weaponMultiple = Constant.weaponMultiple[equipInfos.weapon.type];
        let sharpnessMultiple = getSharpnessMultiple(status.sharpness);

        physicalAttack = (status.attack / weaponMultiple);

        if (Helper.isNotEmpty(tuning.physicalAttack)) {
            physicalAttack += tuning.physicalAttack;
        }

        if (Helper.isNotEmpty(tuning.physicalCriticalRate)) {
            status.critical.rate += tuning.physicalCriticalRate;
        }

        if (Helper.isNotEmpty(tuning.physicalCriticalMultiple)) {
            status.critical.multiple.positive += tuning.physicalCriticalMultiple;
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

        physicalAttack *= sharpnessMultiple.physical;
        physicalCriticalAttack = physicalAttack * criticalMultiple;
        physicalExpectedValue = (physicalAttack * (100 - criticalRate) / 100)
            + (physicalCriticalAttack * criticalRate / 100);

        elementAttack *= sharpnessMultiple.element;
        elementCriticalAttack = elementAttack * status.elementCriticalMultiple.attack;
        elementExpectedValue = (elementAttack * (100 - criticalRate) / 100)
            + (elementCriticalAttack * criticalRate / 100);

        expectedValue = physicalExpectedValue + elementExpectedValue;

        physicalAttack =            Math.round(physicalAttack * 100) / 100;
        physicalCriticalAttack =    Math.round(physicalCriticalAttack * 100) / 100;
        physicalExpectedValue =     Math.round(physicalExpectedValue * 100) / 100;
        elementAttack =             Math.round(elementAttack * 100) / 100;
        elementCriticalAttack =     Math.round(elementCriticalAttack * 100) / 100;
        elementExpectedValue =      Math.round(elementExpectedValue * 100) / 100;
        expectedValue =             Math.round(expectedValue * 100) / 100;
    }

    return {
        physicalAttack: physicalAttack,
        physicalCriticalAttack: physicalCriticalAttack,
        physicalExpectedValue: physicalExpectedValue,
        elementAttack: elementAttack,
        elementCriticalAttack: elementCriticalAttack,
        elementExpectedValue: elementExpectedValue,
        expectedValue: expectedValue
    }
};

const getSharpnessMultiple = (data) => {
    if (Helper.isEmpty(data)) {
        return {
            physical: 1,
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
        physical: Constant.sharpnessMultiple.physical[currentStep],
        element: Constant.sharpnessMultiple.element[currentStep]
    };
};

export default function CharacterStatus(props) {

    /**
     * Hooks
     */
    const [stateCustomWeapon, updateCustomWeapon] = useState(CommonState.getter.getCustomWeapon());
    const [stateCurrentEquips, updateCurrentEquips] = useState(CommonState.getter.getCurrentEquips());
    const [stateEquipInfos, updateEquipInfos] = useState({});
    const [stateStatus, updateStatus] = useState(Helper.deepCopy(Constant.default.status));
    const [stateBenefitAnalysis, updateBenefitAnalysis] = useState(Helper.deepCopy(Constant.default.benefitAnalysis));
    const [statePassiveSkills, updatePassiveSkills] = useState({});
    const [stateTuning, updateTuning] = useState({
        physicalAttack: 5,
        physicalCriticalRate: 10,
        physicalCriticalMultiple: 0.1,
        elementAttack: 100
    });
    const refTuningPhysicalAttack = useRef();
    const refTuningPhysicalCriticalRate = useRef();
    const refTuningPhysicalCriticalMultiple = useRef();
    const refTuningElementAttack = useRef();

    useEffect(() => {
        const equipInfos = generateEquipInfos(stateCurrentEquips);
        const passiveSkills = generatePassiveSkills(equipInfos);
        const status = generateStatus(equipInfos, passiveSkills);
        const benefitAnalysis = generateBenefitAnalysis(equipInfos, status, stateTuning);

        updateEquipInfos(equipInfos);
        updatePassiveSkills(passiveSkills);
        updateStatus(status);
        updateBenefitAnalysis(benefitAnalysis);
    }, [stateCustomWeapon, stateCurrentEquips]);

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribe = CommonState.store.subscribe(() => {
            updateCustomWeapon(CommonState.getter.getCustomWeapon());
            updateCurrentEquips(CommonState.getter.getCurrentEquips());
        });

        return () => {
            unsubscribe();
        };
    }, []);

    /**
     * Handle Functions
     */
    const handlePassiveSkillToggle = useCallback((skillId) => {
        const equipInfos = stateEquipInfos;
        const passiveSkills = statePassiveSkills;
        const tuning = stateTuning;

        passiveSkills[skillId].isActive = !passiveSkills[skillId].isActive;

        const status = generateStatus(equipInfos, passiveSkills);

        updatePassiveSkills(passiveSkills);
        updateStatus(status);
        updateBenefitAnalysis(generateBenefitAnalysis(equipInfos, status, tuning));
    }, [stateEquipInfos, statePassiveSkills, stateTuning]);

    const handleTuningChange = useCallback(() => {
        let tuningPhysicalAttack = parseInt(refTuningPhysicalAttack.current.value, 10);
        let tuningPhysicalCriticalRate = parseFloat(refTuningPhysicalCriticalRate.current.value, 10);
        let tuningPhysicalCriticalMultiple = parseFloat(refTuningPhysicalCriticalMultiple.current.value);
        let tuningElementAttack = parseInt(refTuningElementAttack.current.value, 10);

        tuningPhysicalAttack = !isNaN(tuningPhysicalAttack) ? tuningPhysicalAttack : 0;
        tuningPhysicalCriticalRate = !isNaN(tuningPhysicalCriticalRate) ? tuningPhysicalCriticalRate : 0;
        tuningPhysicalCriticalMultiple = !isNaN(tuningPhysicalCriticalMultiple) ? tuningPhysicalCriticalMultiple : 0;
        tuningElementAttack = !isNaN(tuningElementAttack) ? tuningElementAttack : 0;

        const equipInfos = stateEquipInfos;
        const status = stateStatus;
        const tuning = {
            physicalAttack: tuningPhysicalAttack,
            physicalCriticalRate: tuningPhysicalCriticalRate,
            physicalCriticalMultiple: tuningPhysicalCriticalMultiple,
            elementAttack: tuningElementAttack
        };

        updateTuning(tuning);
        updateBenefitAnalysis(generateBenefitAnalysis(equipInfos, status, tuning));
    }, [stateEquipInfos, stateStatus]);

    /**
     * Render Functions
     */
    let equipInfos = stateEquipInfos;
    let passiveSkills = statePassiveSkills;
    let status = stateStatus;
    let benefitAnalysis = stateBenefitAnalysis;

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
                <div className="mhwc-item mhwc-item-3-step">
                    <div className="col-12 mhwc-name">
                        <span>{_('benefitAnalysis')}</span>
                    </div>
                    <div className="col-12 mhwc-content">
                        <div className="col-3 mhwc-name">
                            <span>{_('physicalAttack')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{benefitAnalysis.physicalAttack}</span>
                        </div>
                        <div className="col-3 mhwc-name">
                            <span>{_('elementAttack')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{benefitAnalysis.elementAttack}</span>
                        </div>

                        <div className="col-3 mhwc-name">
                            <span>{_('physicalCriticalAttack')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{benefitAnalysis.physicalCriticalAttack}</span>
                        </div>
                        <div className="col-3 mhwc-name">
                            <span>{_('elementCriticalAttack')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{benefitAnalysis.elementCriticalAttack}</span>
                        </div>

                        <div className="col-3 mhwc-name">
                            <span>{_('physicalEV')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{benefitAnalysis.physicalExpectedValue}</span>
                        </div>
                        <div className="col-3 mhwc-name">
                            <span>{_('elementEV')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{benefitAnalysis.elementExpectedValue}</span>
                        </div>

                        <div className="col-3 mhwc-name">
                            <span>{_('totalEV')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{benefitAnalysis.expectedValue}</span>
                        </div>
                    </div>
                    <div className="col-12 mhwc-content">
                        <div className="col-6 mhwc-name mhwc-input-ev">
                            <span>{_('perPhysicalAttackEV')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <BasicInput defaultValue={stateTuning.physicalAttack}
                                bypassRef={refTuningPhysicalAttack} onChange={handleTuningChange} />
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{benefitAnalysis.perPhysicalAttackExpectedValue}</span>
                        </div>
                        <div className="col-6 mhwc-name mhwc-input-ev">
                            <span>{_('perCriticalRateEV')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <BasicInput defaultValue={stateTuning.physicalCriticalRate}
                                bypassRef={refTuningPhysicalCriticalRate} onChange={handleTuningChange} />
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{benefitAnalysis.perPhysicalCriticalRateExpectedValue}</span>
                        </div>
                        <div className="col-6 mhwc-name mhwc-input-ev">
                            <span>{_('perCriticalMultipleEV')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <BasicInput defaultValue={stateTuning.physicalCriticalMultiple}
                                bypassRef={refTuningPhysicalCriticalMultiple} onChange={handleTuningChange} />
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{benefitAnalysis.perPhysicalCriticalMultipleExpectedValue}</span>
                        </div>
                        <div className="col-6 mhwc-name mhwc-input-ev">
                            <span>{_('perElementAttackEV')}</span>
                        </div>
                        <div className="col-3 mhwc-value">
                            <BasicInput defaultValue={stateTuning.elementAttack}
                                bypassRef={refTuningElementAttack} onChange={handleTuningChange} />
                        </div>
                        <div className="col-3 mhwc-value">
                            <span>{benefitAnalysis.perElementAttackExpectedValue}</span>
                        </div>
                    </div>
                </div>

                <div className="mhwc-item mhwc-item-3-step">
                    <div className="col-12 mhwc-name">
                        <span>{_('property')}</span>
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

                    <div className="col-12 mhwc-content">
                        {Helper.isNotEmpty(status.sharpness) ? (
                            <Fragment>
                                <div className="col-3 mhwc-name">
                                    <span>{_('sharpness')}</span>
                                </div>
                                <div className="col-9 mhwc-value mhwc-sharpness">
                                    <SharpnessBar
                                        key={Helper.jsonHash(originalSharpness) + ':1'}
                                        data={originalSharpness} />
                                    <SharpnessBar
                                        key={Helper.jsonHash(status.sharpness) + ':2'}
                                        data={status.sharpness} />
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
                    <div className="mhwc-item mhwc-item-3-step">
                        <div className="col-12 mhwc-name">
                            <span>{_('set')}</span>
                        </div>
                        {status.sets.map((data, index) => {
                            let setInfo = SetDataset.getInfo(data.id);
                            let skillInfo = SkillDataset.getInfo(data.skill.id);

                            return (Helper.isNotEmpty(setInfo)
                                && Helper.isNotEmpty(skillInfo))
                            ? (
                                <div key={`${index}:${data.id}`} className="col-12 mhwc-content">
                                    <div className="col-12 mhwc-name">
                                        <span>{_(setInfo.name)} ({data.require})</span>
                                    </div>
                                    <div className="col-12 mhwc-value">
                                        <span>{_(skillInfo.name)} Lv.{data.skill.level}</span>
                                    </div>
                                </div>
                            ) : false;
                        })}
                    </div>
                ) : false}

                {(0 !== status.skills.length) ? (
                    <div className="mhwc-item mhwc-item-3-step">
                        <div className="col-12 mhwc-name">
                            <span>{_('skill')}</span>
                        </div>
                        {status.skills.sort((skillA, skillB) => {
                            return skillB.level - skillA.level;
                        }).map((data) => {
                            let skillInfo = SkillDataset.getInfo(data.id);

                            return (Helper.isNotEmpty(skillInfo)) ? (
                                <div key={data.id} className="col-12 mhwc-content">
                                    <div className="col-12 mhwc-name">
                                        <span>{_(skillInfo.name)} Lv.{data.level}</span>

                                        <div className="mhwc-icons_bundle">
                                            {Helper.isNotEmpty(passiveSkills[data.id]) ? (
                                                <IconButton
                                                    iconName={passiveSkills[data.id].isActive ? 'eye' : 'eye-slash'}
                                                    altName={passiveSkills[data.id].isActive ? _('deactive') : _('active')}
                                                    onClick={() => {handlePassiveSkillToggle(data.id)}} />
                                            ) : false}
                                        </div>
                                    </div>
                                    <div className="col-12 mhwc-value mhwc-description">
                                        <span>{_(data.description)}</span>
                                    </div>
                                </div>
                            ) : false;
                        })}
                    </div>
                ) : false}
            </div>
        </div>
    );
}
