/**
 * Candidate Bundles: Quick Setting
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React, { useState, useEffect, useMemo } from 'react';

// Load Core Libraries
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';
import ArmorDataset from 'libraries/dataset/armor';
import CharmDataset from 'libraries/dataset/charm';
import JewelDataset from 'libraries/dataset/jewel';
import SkillDataset from 'libraries/dataset/skill';

// Load Components
import IconButton from 'components/common/iconButton';
import BasicSelector from 'components/common/basicSelector';

// Load State Control
import CommonState from 'states/common';

const levelMapping = [ 'I', 'II', 'III', 'IV', 'V' ];

export default function QuickSetting(props) {
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
        Helper.debug('Component: CandidateBundles -> QuickFactorSetting');

        let armorSeriesMapping = {};
        let charmSeriesMapping = {};
        let jewelMapping = {};
        let skillLevelMapping = {};

        const equipTypes = Object.keys(stateRequiredEquips).filter((equipType) => {
            if ('weapon' === equipType) {
                return false;
            }

            return Helper.isEmpty(stateRequiredEquips[equipType]);
        });
        const skillIds = stateRequiredSkills.map((skill) => {
            skillLevelMapping[skill.id] = skill.level;

            return skill.id;
        });

        skillIds.forEach((skillId) => {
            equipTypes.forEach((equipType) => {
                if ('helm' === equipType
                    || 'chest' === equipType
                    || 'arm' === equipType
                    || 'waist' === equipType
                    || 'leg' === equipType
                ) {
                    ArmorDataset.typeIs(equipType).hasSkill(skillId).getItems().forEach((armorInfo) => {
                        if (false === stateAlgorithmParams.usingFactor.armor['rare' + armorInfo.rare]) {
                            return;
                        }

                        let isSkip = false;

                        armorInfo.skills.forEach((skill) => {
                            if (true === isSkip) {
                                return;
                            }

                            if (0 === skillLevelMapping[skill.id]) {
                                isSkip = true;

                                return;
                            }
                        });

                        if (true === isSkip) {
                            return;
                        }

                        if (Helper.isEmpty(armorSeriesMapping[armorInfo.rare])) {
                            armorSeriesMapping[armorInfo.rare] = {};
                        }

                        armorSeriesMapping[armorInfo.rare][armorInfo.seriesId] = {
                            name: armorInfo.series
                        };
                    });
                }

                if ('charm' === equipType) {
                    CharmDataset.hasSkill(skillId).getItems().forEach((charmInfo) => {
                        let isSkip = false;

                        charmInfo.skills.forEach((skill) => {
                            if (true === isSkip) {
                                return;
                            }

                            if (0 === skillLevelMapping[skill.id]) {
                                isSkip = true;

                                return;
                            }
                        });

                        if (true === isSkip) {
                            return;
                        }

                        if (Helper.isEmpty(charmSeriesMapping[charmInfo.seriesId])) {
                            charmSeriesMapping[charmInfo.seriesId] = {
                                series: charmInfo.series,
                                min: 1,
                                max: 1
                            };
                        }

                        if (charmSeriesMapping[charmInfo.seriesId].max < charmInfo.level) {
                            charmSeriesMapping[charmInfo.seriesId].max = charmInfo.level;
                        }
                    });
                }
            });

            JewelDataset.hasSkill(skillId).getItems().forEach((jewelInfo) => {
                let isSkip = false;

                jewelInfo.skills.forEach((skill) => {
                    if (true === isSkip) {
                        return;
                    }

                    // If Skill not match condition then skip
                    if (-1 === skillIds.indexOf(skill.id)) {
                        isSkip = true;

                        return;
                    }

                    if (0 === skillLevelMapping[skill.id]) {
                        isSkip = true;

                        return;
                    }
                });

                if (true === isSkip) {
                    return;
                }

                if (Helper.isEmpty(jewelMapping[jewelInfo.size])) {
                    jewelMapping[jewelInfo.size] = {};
                }

                if (Helper.isEmpty(jewelMapping[jewelInfo.size][jewelInfo.id])) {
                    jewelMapping[jewelInfo.size][jewelInfo.id] = {
                        name: jewelInfo.name,
                        min: 1,
                        max: 1
                    };
                }

                jewelInfo.skills.forEach((skill) => {
                    let skillInfo = SkillDataset.getInfo(skill.id);

                    if (jewelMapping[jewelInfo.size][jewelInfo.id].max < skillInfo.list.length) {
                        jewelMapping[jewelInfo.size][jewelInfo.id].max = skillInfo.list.length;
                    }
                });
            });
        });

        let armorFactor = stateAlgorithmParams.usingFactor.armor;
        let charmFactor = stateAlgorithmParams.usingFactor.charm;
        let jewelFactor = stateAlgorithmParams.usingFactor.jewel;

        return (
            <div className="mhwc-item mhwc-item-3-step">
                <div className="col-12 mhwc-name">
                    <span>{_('quickSetting')}</span>
                </div>

                {0 !== Object.keys(armorSeriesMapping).length ? Object.keys(armorSeriesMapping).sort((rareA, rareB) => {
                    return rareA > rareB ? 1 : -1;
                }).map((rare) => {
                    return (
                        <div key={rare} className="col-12 mhwc-content">
                            <div className="col-12 mhwc-name">
                                <span>{_('armorFactor')}: R{rare}</span>
                            </div>

                            <div className="col-12 mhwc-content">
                                {Object.keys(armorSeriesMapping[rare]).sort((seriesIdA, seriesIdB) => {
                                    return _(seriesIdA) > _(seriesIdB) ? 1 : -1;
                                }).map((seriesId) => {
                                    let isInclude = Helper.isNotEmpty(armorFactor[seriesId])
                                        ? armorFactor[seriesId] : true;

                                    return (
                                        <div key={seriesId} className="col-6 mhwc-value">
                                            <span>{_(armorSeriesMapping[rare][seriesId].name)}</span>
                                            <div className="mhwc-icons_bundle">
                                                {isInclude ? (
                                                    <IconButton
                                                        iconName="star"
                                                        altName={_('exclude')}
                                                        onClick={() => {CommonState.setter.setAlgorithmParamsUsingFactor('armor', seriesId, false)}} />
                                                ) : (
                                                    <IconButton
                                                        iconName="star-o"
                                                        altName={_('include')}
                                                        onClick={() => {CommonState.setter.setAlgorithmParamsUsingFactor('armor', seriesId, true)}} />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                }) : false}

                {0 !== Object.keys(charmSeriesMapping).length ? (
                    <div className="col-12 mhwc-content">
                        <div className="col-12 mhwc-name">
                            <span>{_('charmFactor')}</span>
                        </div>

                        <div className="col-12 mhwc-content">
                            {Object.keys(charmSeriesMapping).sort((seriesIdA, seriesIdB) => {
                                return _(seriesIdA) > _(seriesIdB) ? 1 : -1;
                            }).map((seriesId) => {
                                let selectLevel = Helper.isNotEmpty(charmFactor[seriesId])
                                    ? charmFactor[seriesId] : -1;
                                let levelList = [
                                    { key: -1, value: _('all') },
                                    { key: 0, value: _('exclude') }
                                ];

                                [...Array(charmSeriesMapping[seriesId].max - charmSeriesMapping[seriesId].min + 1).keys()].forEach((data, index) => {
                                    levelList.push({ key: index + 1, value: levelMapping[index] })
                                });

                                return (
                                    <div key={seriesId} className="col-6 mhwc-value">
                                        <span>{_(charmSeriesMapping[seriesId].series)}</span>
                                        <div className="mhwc-icons_bundle">
                                            <BasicSelector
                                                iconName="sort-numeric-asc"
                                                defaultValue={selectLevel}
                                                options={levelList} onChange={(event) => {
                                                    CommonState.setter.setAlgorithmParamsUsingFactor('charm', seriesId, parseInt(event.target.value));
                                                }} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : false}

                {0 !== Object.keys(jewelMapping).length ? Object.keys(jewelMapping).sort((sizeA, sizeB) => {
                    return sizeA > sizeB ? 1 : -1;
                }).map((size) => {
                    return (
                        <div key={size} className="col-12 mhwc-content">
                            <div className="col-12 mhwc-name">
                                <span>{_('jewelFactor')}: [{size}]</span>
                            </div>

                            <div className="col-12 mhwc-content">
                                {Object.keys(jewelMapping[size]).sort((jewelIdA, jewelIdB) => {
                                    return _(jewelIdA) > _(jewelIdB) ? 1 : -1;
                                }).map((jewelId) => {
                                    let selectLevel = Helper.isNotEmpty(jewelFactor[jewelId])
                                        ? jewelFactor[jewelId] : -1;
                                    let diffLevel = jewelMapping[size][jewelId].max - jewelMapping[size][jewelId].min + 1;
                                    let levelList = [
                                        { key: -1, value: _('unlimited') },
                                        { key: 0, value: _('exclude') }
                                    ];

                                    [...Array(diffLevel).keys()].forEach((data, index) => {
                                        levelList.push({ key: index + 1, value: index + 1 })
                                    });

                                    return (
                                        <div key={jewelId} className="col-6 mhwc-value">
                                            <span>{_(jewelMapping[size][jewelId].name)}</span>

                                            <div className="mhwc-icons_bundle">
                                                <BasicSelector
                                                    iconName="sort-numeric-asc"
                                                    defaultValue={selectLevel}
                                                    options={levelList} onChange={(event) => {
                                                        CommonState.setter.setAlgorithmParamsUsingFactor('jewel', jewelId, parseInt(event.target.value));
                                                    }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                }) : false}
            </div>
        );
    }, [data, stateAlgorithmParams, stateRequiredEquips, stateRequiredSkills]);
};
