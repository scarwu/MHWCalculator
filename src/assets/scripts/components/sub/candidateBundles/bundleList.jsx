/**
 * Candidate Bundles: Bundle List
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React, { useState, useEffect, useCallback, useMemo } from 'react';

// Load Core Libraries
import Helper from 'core/helper';

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

// Load State Control
import CommonState from 'states/common';

/**
 * Handle Functions
 */
const handleBundlePickUp = (bundle, jewelPackageIndex, required) => {
    let currentEquips = Helper.deepCopy(CommonState.getter.getCurrentEquips());
    let slotMap = {
        1: [],
        2: [],
        3: [],
        4: []
    };

    Object.keys(bundle.equipMapping).forEach((equipType) => {
        if (Helper.isEmpty(bundle.equipMapping[equipType])) {
            return;
        }

        if (Helper.isEmpty(currentEquips[equipType])) {
            currentEquips[equipType] = {};
        }

        currentEquips[equipType].id = bundle.equipMapping[equipType];
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

    Object.keys(bundle.jewelPackages[jewelPackageIndex]).sort((jewelIdA, jewelIdB) => {
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

        let jewelCount = bundle.jewelPackages[jewelPackageIndex][jewelId];
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

export default function BundleList(props) {
    const {data} = props;

    /**
     * Hooks
     */
    const [stateRequiredEquips, updateRequiredEquips] = useState(CommonState.getter.getRequiredEquips());
    const [stateRequiredSets, updateRequiredSets] = useState(CommonState.getter.getRequiredSets());
    const [stateRequiredSkills, updateRequiredSkills] = useState(CommonState.getter.getRequiredSkills());
    const [stateJewelPackageMapping, updateJewelPackageMapping] = useState(data.list.map((bundle) => {
        return 0;
    }));

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

    const handleBundleJewelSelect = useCallback((bundleIndex, jewelIndex) => {
        console.log(bundleIndex, jewelIndex)

        const jewelBundlesIndex = stateJewelPackageMapping;

        jewelBundlesIndex[bundleIndex] = jewelIndex;

        updateJewelPackageMapping(jewelBundlesIndex);
    }, [stateJewelPackageMapping]);

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
            const bundleEquips = Object.keys(bundle.equipMapping).filter((equipType) => {
                return Helper.isNotEmpty(bundle.equipMapping[equipType])
            }).map((equipType) => {
                if ('weapon' === equipType) {
                    return Object.assign({}, data.required.equips[equipType], {
                        type: equipType
                    });
                }

                return {
                    id: bundle.equipMapping[equipType],
                    type: equipType
                };
            });
            const jewelPackageIndex = stateJewelPackageMapping[bundleIndex];
            const bundleJewels = Object.keys(bundle.jewelPackages[jewelPackageIndex]).map((jewelId) => {
                return {
                    id: jewelId,
                    count: bundle.jewelPackages[jewelPackageIndex][jewelId]
                };
            }).sort((setA, setB) => {
                return setB.step - setA.step;
            });

            // Additional Sets & Skills
            const additionalSets = Object.keys(bundle.setMapping).map((setId) => {
                let setInfo = SetDataset.getInfo(setId);

                if (Helper.isEmpty(setInfo)) {
                    return false;
                }

                let setStep = setInfo.skills.filter((skill) => {
                    return skill.require <= bundle.setMapping[setId];
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

            const additionalSkills = Object.keys(bundle.skillMapping).map((skillId) => {
                return {
                    id: skillId,
                    level: bundle.skillMapping[skillId]
                };
            }).filter((skill) => {
                return -1 === currentRequiredSkillIds.indexOf(skill.id);
            }).sort((skillA, skillB) => {
                return skillB.level - skillA.level;
            });

            return (
                <div key={bundle.hash + '_' + jewelPackageIndex} className="mhwc-item mhwc-item-3-step">
                    <div className="col-12 mhwc-name">
                        <span>{_('bundle')}: {bundleIndex + 1} / {data.list.length}</span>
                        <div className="mhwc-icons_bundle">
                            <IconButton
                                iconName="check" altName={_('equip')}
                                onClick={() => {handleBundlePickUp(bundle, jewelPackageIndex, data.required)}} />
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
                                <div className="mhwc-icons_bundle">
                                    {bundle.jewelPackages.map((jewel, jewelIndex) => {
                                        return (
                                            <IconButton
                                                key={jewelIndex} iconName="check" altName={_('equip')}
                                                onClick={() => {handleBundleJewelSelect(bundleIndex, jewelIndex)}} />
                                        );
                                    })}
                                </div>
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
    }, [data, stateRequiredEquips, stateRequiredSets, stateRequiredSkills, stateJewelPackageMapping]);
};
