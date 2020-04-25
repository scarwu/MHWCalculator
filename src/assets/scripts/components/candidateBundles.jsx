/**
 * Candidate Bundles
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React, { Fragment, useState, useEffect, useCallback, useMemo } from 'react';

// Load Core Libraries
import Helper from 'core/helper';
import Event from 'core/event';

// Load Custom Libraries
import _ from 'libraries/lang';
import WeaponDataset from 'libraries/dataset/weapon';
import ArmorDataset from 'libraries/dataset/armor';
import CharmDataset from 'libraries/dataset/charm';
import JewelDataset from 'libraries/dataset/jewel';
import SkillDataset from 'libraries/dataset/skill';
import SetDataset from 'libraries/dataset/set';
import CommonDataset from 'libraries/dataset/common';

// Load Components
import IconButton from 'components/common/iconButton';
import IconTab from 'components/common/iconTab';

// Load State Control
import CommonState from 'states/common';
import ModalState from 'states/modal';

// Load Config & Constant
import Config from 'config';
import Constant from 'constant';

// Variables
let workers = {};

/**
 * Handle Functions
 */
const handleBundlePickUp = (bundle, required) => {
    let currentEquips = Helper.deepCopy(CommonState.getter.getCurrentEquips());
    let slotMap = {
        1: [],
        2: [],
        3: [],
        4: []
    };

    Object.keys(bundle.equips).forEach((equipType) => {
        if (Helper.isEmpty(bundle.equips[equipType])) {
            return;
        }

        if (Helper.isEmpty(currentEquips[equipType])) {
            currentEquips[equipType] = {};
        }

        currentEquips[equipType].id = bundle.equips[equipType];
        currentEquips[equipType].slotIds = [];

        let equipInfo = null;

        if ('weapon' === equipType) {
            if (Helper.isNotEmpty(required.equips.weapon.customWeapon)) {
                CommonState.setter.replaceCustomWeapon(required.equips.weapon.customWeapon);
            }

            if (Helper.isNotEmpty(required.equips.weapon.enhances)) {
                currentEquips.weapon.enhances = required.equips.weapon.enhances; // Restore Enhance
            }

            equipInfo = CommonDataset.getAppliedWeaponInfo(currentEquips.weapon);
        } else if ('helm' === equipType
            || 'chest' === equipType
            || 'arm' === equipType
            || 'waist' === equipType
            || 'leg' === equipType
        ) {
            equipInfo = CommonDataset.getAppliedArmorInfo(currentEquips[equipType]);
        }

        if (Helper.isEmpty(equipInfo)) {
            return;
        }

        equipInfo.slots.forEach((data, index) => {
            slotMap[data.size].push({
                type: equipType,
                index: index
            });
        });
    });

    Object.keys(bundle.jewels).sort((jewelIdA, jewelIdB) => {
        let jewelInfoA = JewelDataset.getInfo(jewelIdA);
        let jewelInfoB = JewelDataset.getInfo(jewelIdB);

        if (Helper.isEmpty(jewelInfoA) || Helper.isEmpty(jewelInfoB)) {
            return 0;
        }

        return jewelInfoA.size - jewelInfoB.size;
    }).forEach((jewelId) => {
        let jewelInfo = JewelDataset.getInfo(jewelId);

        if (Helper.isEmpty(jewelInfo)) {
            return;
        }

        let currentSize = jewelInfo.size;

        let jewelCount = bundle.jewels[jewelId];
        let data = null;

        let jewelIndex = 0;

        while (jewelIndex < jewelCount) {
            if (0 === slotMap[currentSize].length) {
                currentSize++;

                continue;
            }

            data = slotMap[currentSize].shift();

            currentEquips[data.type].slotIds[data.index] = jewelId;

            jewelIndex++;
        }
    });

    CommonState.setter.replaceCurrentEquips(currentEquips);
};

const handleSwitchTempData = (index) => {
    CommonState.setter.switchTempData('candidateBundles', index);
};

/**
 * Sub Components
 */
const QuickSetting = (props) => {
    const {data} = props;

    /**
     * Hooks
     */
    const [stateAlgorithmParams, updateAlgorithmParams] = useState(CommonState.getter.getAlgorithmParams());
    const [stateRequiredEquips, updateRequiredEquips] = useState(CommonState.getter.getRequiredEquips());
    const [stateRequiredSkills, updateRequiredSkills] = useState(CommonState.getter.getRequiredSkills());

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribe = CommonState.store.subscribe(() => {
            updateAlgorithmParams(CommonState.getter.getAlgorithmParams());
            updateRequiredEquips(CommonState.getter.getRequiredEquips());
            updateRequiredSkills(CommonState.getter.getRequiredSkills());
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return useMemo(() => {
        Helper.debug('Component: CandidateBundles -> QuickSetting');

        const equipTypes = Object.keys(stateRequiredEquips).filter((equipType) => {
            if ('weapon' === equipType) {
                return false;
            }

            return Helper.isEmpty(stateRequiredEquips[equipType]);
        });
        const skillIds = stateRequiredSkills.map((skill) => {
            return skill.id;
        });

        let armorSeriesIds = {};
        let charmSeriesIds = {};
        let jewelIds = {};

        skillIds.forEach((skillId) => {
            equipTypes.forEach((equipType) => {
                let equipInfos = null;

                if ('helm' === equipType
                    || 'chest' === equipType
                    || 'arm' === equipType
                    || 'waist' === equipType
                    || 'leg' === equipType
                ) {
                    ArmorDataset.typeIs(equipType).hasSkill(skillId).getItems().forEach((equipInfo) => {
                        if (false === stateAlgorithmParams.usingFactor.armor['rare' + equipInfo.rare]) {
                            return;
                        }

                        if (Helper.isNotEmpty(stateAlgorithmParams.usingFactor.armor[equipInfo.seriesId])
                            && false === stateAlgorithmParams.usingFactor.armor[equipInfo.seriesId]
                        ) {
                            return;
                        }

                        armorSeriesIds[equipInfo.seriesId] = true;
                    });
                }

                if ('charm' === equipType) {
                    CharmDataset.hasSkill(skillId).getItems().forEach((equipInfo) => {
                        charmSeriesIds[equipInfo.seriesId] = true;
                    });
                }
            });

            JewelDataset.hasSkill(skillId).getItems().forEach((jewelInfo) => {
                let isConsistent = true;

                jewelInfo.skills.forEach((skill) => {
                    if (false === isConsistent) {
                        return;
                    }

                    // If Skill not match condition then skip
                    if (-1 === skillIds.indexOf(skill.id)) {
                        isConsistent = false;

                        return;
                    }
                });

                if (false === isConsistent) {
                    return;
                }

                jewelIds[jewelInfo.id] = true;
            });
        });

        armorSeriesIds = Object.keys(armorSeriesIds);
        charmSeriesIds = Object.keys(charmSeriesIds);
        jewelIds = Object.keys(jewelIds);

        return (
            <div className="mhwc-item mhwc-item-3-step">
                <div className="col-12 mhwc-name">
                    <span>{_('conditions')}</span>
                </div>

                {0 !== armorSeriesIds.length ? (
                    <div className="col-12 mhwc-content">
                        <div className="col-12 mhwc-name">
                            <span>{_('armor')}</span>
                        </div>

                        <div className="col-12 mhwc-content">
                            {armorSeriesIds.map((seriesId) => {
                                return (
                                    <div key={seriesId} className="col-6 mhwc-value">
                                        <span>{_(seriesId)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : false}

                {0 !== charmSeriesIds.length ? (
                    <div className="col-12 mhwc-content">
                        <div className="col-12 mhwc-name">
                            <span>{_('charm')}</span>
                        </div>

                        <div className="col-12 mhwc-content">
                            {charmSeriesIds.map((seriesId) => {
                                return (
                                    <div key={seriesId} className="col-6 mhwc-value">
                                        <span>{_(seriesId)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : false}

                {0 !== jewelIds.length ? (
                    <div className="col-12 mhwc-content">
                        <div className="col-12 mhwc-name">
                            <span>{_('jewel')}</span>
                        </div>

                        <div className="col-12 mhwc-content">
                            {jewelIds.map((jewelId) => {
                                return (
                                    <div key={jewelId} className="col-6 mhwc-value">
                                        <span>{_(jewelId)}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : false}
            </div>
        );
    }, [data, stateAlgorithmParams, stateRequiredEquips, stateRequiredSkills]);
};

const RequiredConditionBlock = (props) => {
    const {data} = props;

    /**
     * Hooks
     */
    const [stateRequiredEquips, updateRequiredEquips] = useState(CommonState.getter.getRequiredEquips());
    const [stateRequiredSets, updateRequiredSets] = useState(CommonState.getter.getRequiredSets());
    const [stateRequiredSkills, updateRequiredSkills] = useState(CommonState.getter.getRequiredSkills());

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribe = CommonState.store.subscribe(() => {
            updateRequiredEquips(CommonState.getter.getRequiredEquips());
            updateRequiredSets(CommonState.getter.getRequiredSets());
            updateRequiredSkills(CommonState.getter.getRequiredSkills());
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return useMemo(() => {
        Helper.debug('Component: CandidateBundles -> RequiredConditionBlock');

        if (Helper.isEmpty(data)) {
            return false;
        }

        // Required Ids
        const requiredEquipIds = Object.keys(stateRequiredEquips).map((equipType) => {
            if (Helper.isEmpty(stateRequiredEquips[equipType])) {
                return false;
            }

            return stateRequiredEquips[equipType].id;
        });
        const requiredSetIds = stateRequiredSets.map((set) => {
            return set.id;
        });
        const requiredSkillIds = stateRequiredSkills.map((skill) => {
            return skill.id;
        });

        // Current Required
        const currentRequiredEquips = Object.keys(data.equips).filter((equipType) => {
            return Helper.isNotEmpty(data.equips[equipType])
        }).map((equipType) => {
            return Object.assign({}, data.equips[equipType], {
                type: equipType
            });
        });
        const currentRequiredSets = data.sets.sort((setA, setB) => {
            return setB.step - setA.step;
        });
        const currentRequiredSkills = data.skills.sort((skillA, skillB) => {
            return skillB.level - skillA.level;
        });

        return (
            <div className="mhwc-item mhwc-item-3-step">
                <div className="col-12 mhwc-name">
                    <span>{_('conditions')}</span>
                </div>

                {0 !== currentRequiredEquips.length ? (
                    <div className="col-12 mhwc-content">
                        <div className="col-12 mhwc-name">
                            <span>{_('equip')}</span>
                        </div>

                        <div className="col-12 mhwc-content">
                            {currentRequiredEquips.map((equip) => {
                                let isNotRequire = true;

                                if (Helper.isNotEmpty(stateRequiredEquips[equip.type])) {
                                    if ('weapon' === equip.type) {
                                        if ('customWeapon' === equip.id) {
                                            isNotRequire = Helper.jsonHash({
                                                customWeapon: equip.customWeapon,
                                                enhances: equip.enhances
                                            }) !== Helper.jsonHash({
                                                customWeapon: stateRequiredEquips[equip.type].customWeapon,
                                                enhances: stateRequiredEquips[equip.type].enhances
                                            });
                                        } else {
                                            isNotRequire = Helper.jsonHash({
                                                id: equip.id,
                                                enhances: equip.enhances
                                            }) !== Helper.jsonHash({
                                                id: stateRequiredEquips[equip.type].id,
                                                enhances: stateRequiredEquips[equip.type].enhances
                                            });
                                        }
                                    } else {
                                        isNotRequire = equip.id !== stateRequiredEquips[equip.type].id;
                                    }
                                }

                                let equipInfo = null;

                                if ('weapon' === equip.type) {
                                    if ('customWeapon' === equip.id) {
                                        equipInfo = equip.customWeapon;

                                        return Helper.isNotEmpty(equipInfo) ? (
                                            <div key={equip.type} className="col-6 mhwc-value">
                                                <span>{_(equipInfo.name)}: {_(equipInfo.type)}</span>

                                                <div className="mhwc-icons_bundle">
                                                    {isNotRequire ? (
                                                        <IconButton
                                                            iconName="arrow-left" altName={_('include')}
                                                            onClick={() => {CommonState.setter.setRequiredEquips(equip.type, equipInfo)}} />
                                                    ) : false}
                                                </div>
                                            </div>
                                        ) : false;
                                    }

                                    equipInfo = WeaponDataset.getInfo(equip.id);
                                } else if ('helm' === equip.type
                                    || 'chest' === equip.type
                                    || 'arm' === equip.type
                                    || 'waist' === equip.type
                                    || 'leg' === equip.type
                                ) {
                                    equipInfo = ArmorDataset.getInfo(equip.id);
                                } else if ('charm' === equip.type) {
                                    equipInfo = CharmDataset.getInfo(equip.id);
                                }

                                return Helper.isNotEmpty(equipInfo) ? (
                                    <div key={equip.type} className="col-6 mhwc-value">
                                        <span>{_(equipInfo.name)}</span>

                                        <div className="mhwc-icons_bundle">
                                            {isNotRequire ? (
                                                <IconButton
                                                    iconName="arrow-left" altName={_('include')}
                                                    onClick={() => {CommonState.setter.setRequiredEquips(equip.type, equipInfo)}} />
                                            ) : false}
                                        </div>
                                    </div>
                                ) : false;
                            })}
                        </div>
                    </div>
                ) : false}

                {0 !== currentRequiredSets.length ? (
                    <div className="col-12 mhwc-content">
                        <div className="col-12 mhwc-name">
                            <span>{_('set')}</span>
                        </div>

                        <div className="col-12 mhwc-content">
                            {currentRequiredSets.map((set) => {
                                let setInfo = SetDataset.getInfo(set.id);

                                return (
                                    <div key={set.id} className="col-6 mhwc-value">
                                        <span>
                                            {`${_(setInfo.name)}`}{setInfo.skills.slice(0, set.step).map((skill) => {
                                                return ` (${skill.require})`;
                                            })}
                                        </span>
                                        {(-1 === requiredSetIds.indexOf(setInfo.id)) ? (
                                            <div className="mhwc-icons_bundle">
                                                <IconButton
                                                    iconName="arrow-left" altName={_('include')}
                                                    onClick={() => {CommonState.setter.addRequiredSet(setInfo.id)}} />
                                            </div>
                                        ) : false}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : false}

                {0 !== currentRequiredSkills.length ? (
                    <div className="col-12 mhwc-content">
                        <div className="col-12 mhwc-name">
                            <span>{_('skill')}</span>
                        </div>

                        <div className="col-12 mhwc-content">
                            {currentRequiredSkills.map((skill) => {
                                let skillInfo = SkillDataset.getInfo(skill.id);

                                return (Helper.isNotEmpty(skillInfo)) ? (
                                    <div key={skill.id} className="col-6 mhwc-value">
                                        <span>{`${_(skillInfo.name)} Lv.${skill.level}`}</span>
                                        {(-1 === requiredSkillIds.indexOf(skillInfo.id)) ? (
                                            <div className="mhwc-icons_bundle">
                                                <IconButton
                                                    iconName="arrow-left" altName={_('include')}
                                                    onClick={() => {CommonState.setter.addRequiredSkill(skillInfo.id)}} />
                                            </div>
                                        ) : false}
                                    </div>
                                ) : false;
                            })}
                        </div>
                    </div>
                ) : false}
            </div>
        );
    }, [data, stateRequiredEquips, stateRequiredSets, stateRequiredSkills]);
};

const BundleList = (props) => {
    const {data} = props;

    /**
     * Hooks
     */
    const [stateRequiredEquips, updateRequiredEquips] = useState(CommonState.getter.getRequiredEquips());
    const [stateRequiredSets, updateRequiredSets] = useState(CommonState.getter.getRequiredSets());
    const [stateRequiredSkills, updateRequiredSkills] = useState(CommonState.getter.getRequiredSkills());

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribe = CommonState.store.subscribe(() => {
            updateRequiredEquips(CommonState.getter.getRequiredEquips());
            updateRequiredSets(CommonState.getter.getRequiredSets());
            updateRequiredSkills(CommonState.getter.getRequiredSkills());
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return useMemo(() => {
        Helper.debug('Component: CandidateBundles -> BundleList');

        if (Helper.isEmpty(data)
            || Helper.isEmpty(data.required)
            || Helper.isEmpty(data.list)
        ) {
            return false;
        }

        if (0 === data.list.length) {
            return (
                <div className="mhwc-item mhwc-item-3-step">
                    <div className="col-12 mhwc-name">
                        <span>{_('noResult')}</span>
                    </div>
                </div>
            );
        }

        // Required Ids
        const requiredEquipIds = Object.keys(stateRequiredEquips).map((equipType) => {
            if (Helper.isEmpty(stateRequiredEquips[equipType])) {
                return false;
            }

            return stateRequiredEquips[equipType].id;
        });
        const requiredSetIds = stateRequiredSets.map((set) => {
            return set.id;
        });
        const requiredSkillIds = stateRequiredSkills.map((skill) => {
            return skill.id;
        });

        // Current Required Ids
        const currentRequiredSetIds = data.required.sets.map((set) => {
            return set.id;
        });
        const currentRequiredSkillIds = data.required.skills.map((skill) => {
            return skill.id;
        });

        return data.list.map((bundle, bundleIndex) => {

            // Bundle Equips & Jewels
            const bundleEquips = Object.keys(bundle.equips).filter((equipType) => {
                return Helper.isNotEmpty(bundle.equips[equipType])
            }).map((equipType) => {
                if ('weapon' === equipType) {
                    return Object.assign({}, data.required.equips[equipType], {
                        type: equipType
                    });
                }

                return {
                    id: bundle.equips[equipType],
                    type: equipType
                };
            });
            const bundleJewels = Object.keys(bundle.jewels).map((jewelId) => {
                return {
                    id: jewelId,
                    count: bundle.jewels[jewelId]
                };
            }).sort((setA, setB) => {
                return setB.step - setA.step;
            });

            // Additional Sets & Skills
            const additionalSets = Object.keys(bundle.sets).map((setId) => {
                let setInfo = SetDataset.getInfo(setId);

                if (Helper.isEmpty(setInfo)) {
                    return false;
                }

                let setStep = setInfo.skills.filter((skill) => {
                    return skill.require <= bundle.sets[setId];
                }).length;

                return {
                    id: setId,
                    step: setStep
                };
            }).filter((set) => {
                if (false === set) {
                    return false;
                }

                if (-1 !== currentRequiredSetIds.indexOf(set.id)) {
                    return false;
                }

                if (0 === set.step) {
                    return false;
                }

                return true;
            }).sort((setA, setB) => {
                return setB.step - setA.step;
            });

            const additionalSkills = Object.keys(bundle.skills).map((skillId) => {
                return {
                    id: skillId,
                    level: bundle.skills[skillId]
                };
            }).filter((skill) => {
                return -1 === currentRequiredSkillIds.indexOf(skill.id);
            }).sort((skillA, skillB) => {
                return skillB.level - skillA.level;
            });

            return (
                <div key={bundle.hash} className="mhwc-item mhwc-item-3-step">
                    <div className="col-12 mhwc-name">
                        <span>{_('bundle')}: {bundleIndex + 1} / {data.list.length}</span>
                        <div className="mhwc-icons_bundle">
                            <IconButton
                                iconName="check" altName={_('equip')}
                                onClick={() => {handleBundlePickUp(bundle, data.required)}} />
                        </div>
                    </div>

                    {Helper.isNotEmpty(bundle.sortedBy) ? (
                        <div className="col-12 mhwc-content">
                            <div className="col-4 mhwc-name">
                                <span>{_(bundle.sortedBy.key + 'Sort')}</span>
                            </div>
                            <div className="col-8 mhwc-value">
                                <span>{bundle.sortedBy.value}</span>
                            </div>
                        </div>
                    ) : false}

                    <div className="col-12 mhwc-content">
                        <div className="col-12 mhwc-name">
                            <span>{_('requiredEquips')}</span>
                        </div>
                        <div className="col-12 mhwc-content">
                            {bundleEquips.map((equip) => {
                                let isNotRequire = true;

                                if (Helper.isNotEmpty(stateRequiredEquips[equip.type])) {
                                    if ('weapon' === equip.type) {
                                        if ('customWeapon' === equip.id) {
                                            isNotRequire = Helper.jsonHash({
                                                customWeapon: equip.customWeapon,
                                                enhances: equip.enhances
                                            }) !== Helper.jsonHash({
                                                customWeapon: stateRequiredEquips[equip.type].customWeapon,
                                                enhances: stateRequiredEquips[equip.type].enhances
                                            });
                                        } else {
                                            isNotRequire = Helper.jsonHash({
                                                id: equip.id,
                                                enhances: equip.enhances
                                            }) !== Helper.jsonHash({
                                                id: stateRequiredEquips[equip.type].id,
                                                enhances: stateRequiredEquips[equip.type].enhances
                                            });
                                        }
                                    } else {
                                        isNotRequire = equip.id !== stateRequiredEquips[equip.type].id;
                                    }
                                }

                                let equipInfo = null;

                                if ('weapon' === equip.type) {
                                    if ('customWeapon' === equip.id) {
                                        equipInfo = equip.customWeapon;

                                        return Helper.isNotEmpty(equipInfo) ? (
                                            <div key={equip.type} className="col-6 mhwc-value">
                                                <span>{_(equipInfo.name)}: {_(equipInfo.type)}</span>

                                                <div className="mhwc-icons_bundle">
                                                    {isNotRequire ? (
                                                        <IconButton
                                                            iconName="arrow-left" altName={_('include')}
                                                            onClick={() => {CommonState.setter.setRequiredEquips(equip.type, equipInfo)}} />
                                                    ) : false}
                                                </div>
                                            </div>
                                        ) : false;
                                    }

                                    equipInfo = WeaponDataset.getInfo(equip.id);
                                } else if ('helm' === equip.type
                                    || 'chest' === equip.type
                                    || 'arm' === equip.type
                                    || 'waist' === equip.type
                                    || 'leg' === equip.type
                                ) {
                                    equipInfo = ArmorDataset.getInfo(equip.id);
                                } else if ('charm' === equip.type) {
                                    equipInfo = CharmDataset.getInfo(equip.id);
                                }

                                return Helper.isNotEmpty(equipInfo) ? (
                                    <div key={equip.type} className="col-6 mhwc-value">
                                        <span>{_(equipInfo.name)}</span>

                                        <div className="mhwc-icons_bundle">
                                            {isNotRequire ? (
                                                <IconButton
                                                    iconName="arrow-left" altName={_('include')}
                                                    onClick={() => {CommonState.setter.setRequiredEquips(equip.type, equipInfo)}} />
                                            ) : false}
                                        </div>
                                    </div>
                                ) : false;
                            })}
                        </div>
                    </div>

                    {(0 !== bundleJewels.length) ? (
                        <div className="col-12 mhwc-content">
                            <div className="col-12 mhwc-name">
                                <span>{_('requiredJewels')}</span>
                            </div>
                            <div className="col-12 mhwc-content">
                                {bundleJewels.map((jewel) => {
                                    let jewelInfo = JewelDataset.getInfo(jewel.id);

                                    return (Helper.isNotEmpty(jewelInfo)) ? (
                                        <div key={jewel.id} className="col-4 mhwc-value">
                                            <span>{`[${jewelInfo.size}] ${_(jewelInfo.name)} x ${jewel.count}`}</span>
                                        </div>
                                    ) : false;
                                })}
                            </div>
                        </div>
                    ) : false}

                    {(0 !== bundle.meta.remainingSlotCount.all) ? (
                        <div className="col-12 mhwc-content">
                            <div className="col-12 mhwc-name">
                                <span>{_('remainingSlot')}</span>
                            </div>
                            <div className="col-12 mhwc-content">
                                {Object.keys(bundle.meta.remainingSlotCount).map((slotSize) => {
                                    if ('all' === slotSize) {
                                        return;
                                    }

                                    let slotCount = bundle.meta.remainingSlotCount[slotSize];

                                    return (slotCount > 0) ? (
                                        <div key={slotSize} className="col-4 mhwc-value">
                                            <span>{`[${slotSize}] x ${slotCount}`}</span>
                                        </div>
                                    ) : false;
                                })}
                            </div>
                        </div>
                    ) : false}

                    {(0 !== additionalSets.length) ? (
                        <div className="col-12 mhwc-content">
                            <div className="col-12 mhwc-name">
                                <span>{_('additionalSets')}</span>
                            </div>
                            <div className="col-12 mhwc-content">
                                {additionalSets.map((set) => {
                                    let setInfo = SetDataset.getInfo(set.id);

                                    return (
                                        <div key={set.id} className="col-6 mhwc-value">
                                            <span>
                                                {`${_(setInfo.name)}`}{setInfo.skills.slice(0, set.step).map((skill) => {
                                                    return ` (${skill.require})`;
                                                })}
                                            </span>
                                            {(-1 === requiredSetIds.indexOf(setInfo.id)) ? (
                                                <div className="mhwc-icons_bundle">
                                                    <IconButton
                                                        iconName="arrow-left" altName={_('include')}
                                                        onClick={() => {CommonState.setter.addRequiredSet(setInfo.id)}} />
                                                </div>
                                            ) : false}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ) : false}

                    {(0 !== additionalSkills.length) ? (
                        <div className="col-12 mhwc-content">
                            <div className="col-12 mhwc-name">
                                <span>{_('additionalSkills')}</span>
                            </div>
                            <div className="col-12 mhwc-content">
                                {additionalSkills.map((skill) => {
                                    let skillInfo = SkillDataset.getInfo(skill.id);

                                    return (Helper.isNotEmpty(skillInfo)) ? (
                                        <div key={skill.id} className="col-6 mhwc-value">
                                            <span>{`${_(skillInfo.name)} Lv.${skill.level}`}</span>
                                            {(-1 === requiredSkillIds.indexOf(skillInfo.id)) ? (
                                                <div className="mhwc-icons_bundle">
                                                    <IconButton
                                                        iconName="arrow-left" altName={_('include')}
                                                        onClick={() => {CommonState.setter.addRequiredSkill(skillInfo.id)}} />
                                                </div>
                                            ) : false}
                                        </div>
                                    ) : false;
                                })}
                            </div>
                        </div>
                    ) : false}
                </div>
            );
        });
    }, [data, stateRequiredEquips, stateRequiredSets, stateRequiredSkills]);
};

const convertTimeFormat = (seconds) => {
    let text = '';

    if (seconds > 3600) {
        let hours = parseInt(seconds / 3600);

        seconds -= hours * 3600;
        text += hours + ' ' + _('hour') + ' ';
    }

    if (seconds > 60) {
        let minutes = parseInt(seconds / 60);

        seconds -= minutes * 60;
        text += minutes + ' ' + _('minute') + ' ';
    }

    text += seconds + ' ' + _('second');

    return text;
};

export default function CandidateBundles(props) {

    /**
     * Hooks
     */
    const [stateTempData, updateTempData] = useState(CommonState.getter.getTempData());
    const [stateComputedResult, updateComputedResult] = useState(CommonState.getter.getComputedResult());
    const [stateTasks, updateTasks] = useState({});

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribe = CommonState.store.subscribe(() => {
            updateTempData(CommonState.getter.getTempData());
            updateComputedResult(CommonState.getter.getComputedResult());
        });

        return () => {
            unsubscribe();
        };
    }, []);

    // Worker Callback
    useEffect(() => {
        Event.on('workerCallback', 'tasks', (data) => {
            let tabIndex = data.tabIndex;
            let action = data.action;
            let payload = data.payload;

            switch (action) {
            case 'progress':
                if (Helper.isNotEmpty(payload.bundleCount)) {
                    stateTasks[tabIndex].bundleCount = payload.bundleCount;
                }

                if (Helper.isNotEmpty(payload.searchPercent)) {
                    stateTasks[tabIndex].searchPercent = payload.searchPercent;
                }

                if (Helper.isNotEmpty(payload.timeRemaining)) {
                    stateTasks[tabIndex].timeRemaining = payload.timeRemaining;
                }

                updateTasks(Helper.deepCopy(stateTasks));

                break;
            case 'result':
                handleSwitchTempData(tabIndex);

                CommonState.setter.saveComputedResult(payload.computedResult);

                workers[tabIndex].terminate();
                workers[tabIndex] = undefined;

                stateTasks[tabIndex] = undefined;

                updateTasks(Helper.deepCopy(stateTasks));

                break;
            default:
                break;
            }
        });

        return () => {
            Event.off('workerCallback', 'tasks');
        };
    }, [stateTasks])

    // Search Remaining Timer
    useEffect(() => {
        let tabIndex = stateTempData.candidateBundles.index;

        if (Helper.isEmpty(stateTasks[tabIndex])) {
            return;
        }

        let timerId = setInterval(() => {
            if (0 === stateTasks[tabIndex].timeRemaining) {
                return;
            }

            stateTasks[tabIndex].timeRemaining--;

            updateTasks(Helper.deepCopy(stateTasks));
        }, 1000);

        return () => {
            clearInterval(timerId);
        };
    }, [stateTasks, stateTempData])

    /**
     * Handle Functions
     */
    const handleCandidateBundlesSearch = useCallback(() => {
        let tabIndex = stateTempData.candidateBundles.index;

        if (Helper.isNotEmpty(stateTasks[tabIndex])) {
            return;
        }

        // Get All Data From Store
        let customWeapon = CommonState.getter.getCustomWeapon();
        let requiredEquips = CommonState.getter.getRequiredEquips();
        let requiredSets = CommonState.getter.getRequiredSets();
        let requiredSkills = CommonState.getter.getRequiredSkills();
        let algorithmParams = CommonState.getter.getAlgorithmParams();

        if (0 === requiredSets.length
            && 0 === requiredSkills.length
        ) {
            return;
        }

        stateTasks[tabIndex] = {
            bundleCount: 0,
            searchPercent: 0,
            timeRemaining: 0,
            required: {
                equips: requiredEquips,
                sets: requiredSets,
                skills: requiredSkills
            }
        };

        updateTasks(Helper.deepCopy(stateTasks));

        if (Helper.isEmpty(workers[tabIndex])) {
            workers[tabIndex] = new Worker('assets/scripts/worker.min.js?' + Config.buildTime + '&' + tabIndex);
            workers[tabIndex].onmessage = (event) => {
                Event.trigger('workerCallback', {
                    tabIndex: tabIndex,
                    action: event.data.action,
                    payload: event.data.payload
                });
            };
        }

        workers[tabIndex].postMessage({
            customWeapon: customWeapon,
            requiredSets: requiredSets,
            requiredSkills: requiredSkills,
            requiredEquips: requiredEquips,
            algorithmParams: algorithmParams
        });
    }, [stateTasks, stateTempData]);

    const handleCandidateBundlesCancel = useCallback(() => {
        let tabIndex = stateTempData.candidateBundles.index;

        workers[tabIndex].terminate();
        workers[tabIndex] = undefined;

        stateTasks[tabIndex] = undefined;

        updateTasks(Helper.deepCopy(stateTasks));
    }, [stateTasks, stateTempData]);

    let tabIndex = stateTempData.candidateBundles.index;

    return (
        <div className="col mhwc-bundles">
            <div className="mhwc-panel">
                <span className="mhwc-title">{_('candidateBundle')}</span>

                <div className="mhwc-icons_bundle-left">
                    <IconTab
                        iconName={Helper.isNotEmpty(stateTasks[0]) ? 'cog fa-spin' : 'circle-o'}
                        altName={_('tab') + ' 1'}
                        isActive={0 === tabIndex}
                        onClick={() => {handleSwitchTempData(0)}} />
                    <IconTab
                        iconName={Helper.isNotEmpty(stateTasks[1]) ? 'cog fa-spin' : 'circle-o'}
                        altName={_('tab') + ' 2'}
                        isActive={1 === tabIndex}
                        onClick={() => {handleSwitchTempData(1)}} />
                    <IconTab
                        iconName={Helper.isNotEmpty(stateTasks[2]) ? 'cog fa-spin' : 'circle-o'}
                        altName={_('tab') + ' 3'}
                        isActive={2 === tabIndex}
                        onClick={() => {handleSwitchTempData(2)}} />
                    <IconTab
                        iconName={Helper.isNotEmpty(stateTasks[3]) ? 'cog fa-spin' : 'circle-o'}
                        altName={_('tab') + ' 4'}
                        isActive={3 === tabIndex}
                        onClick={() => {handleSwitchTempData(3)}} />
                </div>

                <div className="mhwc-icons_bundle-right">
                    <IconButton
                        iconName="refresh" altName={_('reset')}
                        onClick={CommonState.setter.cleanComputedResult} />
                    <IconButton
                        iconName="cog" altName={_('setting')}
                        onClick={ModalState.setter.showAlgorithmSetting} />
                    <IconButton
                        iconName="search" altName={_('search')}
                        onClick={handleCandidateBundlesSearch} />
                </div>
            </div>

            <div key="list" className="mhwc-list">
                {Helper.isNotEmpty(stateTasks[tabIndex]) ? (
                    <Fragment>
                        <div className="mhwc-item mhwc-item-3-step">
                            <div className="col-12 mhwc-name">
                                <span>{_('searching')} ...</span>
                                <div className="mhwc-icons_bundle">
                                    <IconButton
                                        iconName="times" altName={_('cancel')}
                                        onClick={handleCandidateBundlesCancel} />
                                </div>
                            </div>
                            <div className="col-12 mhwc-content">
                                <div className="col-3 mhwc-name">
                                    <span>{_('bundleCount')}</span>
                                </div>
                                <div className="col-3 mhwc-value">
                                    <span>{stateTasks[tabIndex].bundleCount}</span>
                                </div>
                                <div className="col-3 mhwc-name">
                                    <span>{_('searchPercent')}</span>
                                </div>
                                <div className="col-3 mhwc-value">
                                    <span>{stateTasks[tabIndex].searchPercent} %</span>
                                </div>
                                <div className="col-3 mhwc-name">
                                    <span>{_('timeRemaining')}</span>
                                </div>
                                <div className="col-9 mhwc-value">
                                    <span>{convertTimeFormat(stateTasks[tabIndex].timeRemaining)}</span>
                                </div>
                            </div>
                        </div>
                        <RequiredConditionBlock data={stateTasks[tabIndex].required} />
                    </Fragment>
                ) : (
                    Helper.isEmpty(stateComputedResult) ? (
                        <QuickSetting />
                    ) : (
                        <Fragment>
                            <RequiredConditionBlock data={stateComputedResult.required} />
                            <BundleList data={stateComputedResult} />
                        </Fragment>
                    )
                )}
            </div>
        </div>
    );
}
