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
import BasicSelector from 'components/common/basicSelector';

// Load State Control
import CommonState from 'states/common';

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

    Object.keys(bundle.equipIdMapping).forEach((equipType) => {
        if (Helper.isEmpty(bundle.equipIdMapping[equipType])) {
            return;
        }

        if (Helper.isEmpty(currentEquips[equipType])) {
            currentEquips[equipType] = {};
        }

        currentEquips[equipType].id = bundle.equipIdMapping[equipType];
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

    let jewelPackageIndex = Helper.isNotEmpty(bundle.jewelPackageIndex)
        ? bundle.jewelPackageIndex : 0;

    if (Helper.isNotEmpty(bundle.jewelPackages[jewelPackageIndex])) {
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
    }

    CommonState.setter.replaceCurrentEquips(currentEquips);
};

export default function BundleList(props) {

    /**
     * Hooks
     */
    const [stateComputedResult, updateComputedResult] = useState(CommonState.getter.getComputedResult());
    const [stateRequiredEquips, updateRequiredEquips] = useState(CommonState.getter.getRequiredEquips());
    const [stateRequiredSets, updateRequiredSets] = useState(CommonState.getter.getRequiredSets());
    const [stateRequiredSkills, updateRequiredSkills] = useState(CommonState.getter.getRequiredSkills());

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribe = CommonState.store.subscribe(() => {
            updateComputedResult(CommonState.getter.getComputedResult());
            updateRequiredEquips(CommonState.getter.getRequiredEquips());
            updateRequiredSets(CommonState.getter.getRequiredSets());
            updateRequiredSkills(CommonState.getter.getRequiredSkills());
        });

        return () => {
            unsubscribe();
        };
    }, []);

    /**
     * Handle Functions
     */
    const handleJewelPackageChange = useCallback((bundleIndex, packageIndex) => {
        let computedResult = Helper.deepCopy(stateComputedResult);

        computedResult.list[bundleIndex].jewelPackageIndex = packageIndex;

        CommonState.setter.saveComputedResult(computedResult);
    }, [stateComputedResult]);

    return useMemo(() => {
        Helper.debug('Component: CandidateBundles -> BundleList');

        if (Helper.isEmpty(stateComputedResult)
            || Helper.isEmpty(stateComputedResult.required)
            || Helper.isEmpty(stateComputedResult.list)
        ) {
            return false;
        }

        if (0 === stateComputedResult.list.length) {
            return (
                <div className="mhwc-item mhwc-item-3-step">
                    <div className="col-12 mhwc-name">
                        <span>{_('noResult')}</span>
                    </div>
                </div>
            );
        }

        let bundleList = stateComputedResult.list;
        let bundleRequired = stateComputedResult.required;

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
        const currentRequiredSetIds = bundleRequired.sets.map((set) => {
            return set.id;
        });
        const currentRequiredSkillIds = bundleRequired.skills.map((skill) => {
            return skill.id;
        });

        return bundleList.map((bundle, bundleIndex) => {
            const jewelPackageCount = bundle.jewelPackages.length;
            const jewelPackageIndex = Helper.isNotEmpty(bundle.jewelPackageIndex)
                ? bundle.jewelPackageIndex : 0;

            // Remaining Slot Count Mapping
            let remainingSlotCountMapping = {
                1: 0,
                2: 0,
                3: 0,
                4: 0,
                all: 0
            };

            Object.keys(bundle.slotCountMapping).forEach((slotSize) => {
                remainingSlotCountMapping.all += bundle.slotCountMapping[slotSize];
                remainingSlotCountMapping[slotSize] += bundle.slotCountMapping[slotSize];
            });

            // Bundle Equips & Jewels
            const bundleEquips = Object.keys(bundle.equipIdMapping).filter((equipType) => {
                return Helper.isNotEmpty(bundle.equipIdMapping[equipType])
            }).map((equipType) => {
                if ('weapon' === equipType) {
                    return Object.assign({}, bundleRequired.equips[equipType], {
                        type: equipType
                    });
                }

                return {
                    id: bundle.equipIdMapping[equipType],
                    type: equipType
                };
            });

            let bundleJewels = [];

            if (Helper.isNotEmpty(bundle.jewelPackages[jewelPackageIndex])) {
                bundleJewels = Object.keys(bundle.jewelPackages[jewelPackageIndex]).map((jewelId) => {
                    let jewelInfo = JewelDataset.getInfo(jewelId);
                    let jewelCount = bundle.jewelPackages[jewelPackageIndex][jewelId];

                    for (let slotSize = jewelInfo.size; slotSize <= 4; slotSize++) {
                        if (0 === remainingSlotCountMapping[slotSize]) {
                            continue;
                        }

                        if (remainingSlotCountMapping[slotSize] < jewelCount) {
                            jewelCount -= remainingSlotCountMapping[slotSize];
                            remainingSlotCountMapping.all -= remainingSlotCountMapping[slotSize];
                            remainingSlotCountMapping[slotSize] = 0;

                            continue;
                        }

                        remainingSlotCountMapping.all -= jewelCount;
                        remainingSlotCountMapping[slotSize] -= jewelCount;

                        break;
                    }

                    return {
                        id: jewelId,
                        count: bundle.jewelPackages[jewelPackageIndex][jewelId]
                    };
                }).sort((jewelA, jewelB) => {
                    let jewelInfoA = JewelDataset.getInfo(jewelA.id);
                    let jewelInfoB = JewelDataset.getInfo(jewelB.id);

                    return jewelInfoA.size < jewelInfoB.size ? 1 : -1;
                });
            }

            // Additional Sets & Skills
            const additionalSets = Object.keys(bundle.setCountMapping).map((setId) => {
                let setInfo = SetDataset.getInfo(setId);

                if (Helper.isEmpty(setInfo)) {
                    return false;
                }

                let setStep = setInfo.skills.filter((skill) => {
                    return skill.require <= bundle.setCountMapping[setId];
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

            const additionalSkills = Object.keys(bundle.skillLevelMapping).map((skillId) => {
                return {
                    id: skillId,
                    level: bundle.skillLevelMapping[skillId]
                };
            }).filter((skill) => {
                return -1 === currentRequiredSkillIds.indexOf(skill.id);
            }).sort((skillA, skillB) => {
                return skillB.level - skillA.level;
            });

            return (
                <div key={bundle.hash} className="mhwc-item mhwc-item-3-step">
                    <div className="col-12 mhwc-name">
                        <span>{_('bundle')}: {bundleIndex + 1} / {bundleList.length}</span>
                        <div className="mhwc-icons_bundle">
                            <IconButton
                                iconName="check" altName={_('equip')}
                                onClick={() => {handleBundlePickUp(bundle, bundleRequired)}} />
                        </div>
                    </div>

                    {Helper.isNotEmpty(bundle.meta.sortBy) ? (
                        <div className="col-12 mhwc-content">
                            <div className="col-4 mhwc-name">
                                <span>{_(bundle.meta.sortBy.key + 'Sort')}</span>
                            </div>
                            <div className="col-8 mhwc-value">
                                <span>{bundle.meta.sortBy.value}</span>
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
                        <div key={bundleIndex + '_' + jewelPackageIndex} className="col-12 mhwc-content">
                            <div className="col-12 mhwc-name">
                                <span>{_('requiredJewels')}</span>
                            </div>
                            <div className="col-12 mhwc-content">
                                {1 < jewelPackageCount ? (
                                    <div className="col-12 mhwc-value">
                                        <div className="mhwc-icons_bundle">
                                            {bundle.jewelPackages.map((jewelMapping, packageIndex) => {
                                                return (
                                                    <IconButton
                                                        key={packageIndex} altName={_('select')}
                                                        iconName={(packageIndex === jewelPackageIndex) ? 'check' : ''}
                                                        onClick={() => {handleJewelPackageChange(bundleIndex, packageIndex)}} />
                                                );
                                            })}
                                        </div>
                                    </div>
                                ) : false}
                                {bundleJewels.map((jewel) => {
                                    let jewelInfo = JewelDataset.getInfo(jewel.id);

                                    return (Helper.isNotEmpty(jewelInfo)) ? (
                                        <div key={jewel.id} className="col-6 mhwc-value">
                                            <span>{`[${jewelInfo.size}] ${_(jewelInfo.name)} x ${jewel.count}`}</span>
                                        </div>
                                    ) : false;
                                })}
                            </div>
                        </div>
                    ) : false}

                    {(0 !== remainingSlotCountMapping.all) ? (
                        <div className="col-12 mhwc-content">
                            <div className="col-12 mhwc-name">
                                <span>{_('remainingSlot')}</span>
                            </div>
                            <div className="col-12 mhwc-content">
                                {Object.keys(remainingSlotCountMapping).map((slotSize) => {
                                    if ('all' === slotSize) {
                                        return;
                                    }

                                    let slotCount = remainingSlotCountMapping[slotSize];

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
    }, [stateComputedResult, stateRequiredEquips, stateRequiredSets, stateRequiredSkills]);
};
