/**
 * Algorithm Setting: Armor Factors
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React, { useState, useEffect, useMemo } from 'react';

// Load Core Libraries
import Status from 'core/status';
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';
import ArmorDataset from 'libraries/dataset/armor';

// Load Components
import IconButton from 'components/common/iconButton';

// Load State Control
import CommonState from 'states/common';

/**
 * Variables
 */
const armorRareList = [ 5, 6, 7, 8, 9, 10, 11, 12 ];

export default function ArmorFactors(props) {
    const {segment} = props;

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
        Helper.debug('Component: AlgorithmSetting -> ArmorFactors');

        let armorSeriesMapping = {};
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
            });
        });

        let armorFactor = stateAlgorithmParams.usingFactor.armor;

        return armorRareList.map((rare) => {
            if (false === armorFactor['rare' + rare]) {
                return false;
            }

            let seriesMapping = {};

            ArmorDataset.rareIs(rare).getItems().filter((armorInfo) => {
                let text = _(armorInfo.series);

                if (Helper.isNotEmpty(segment)
                    && -1 === text.toLowerCase().search(segment.toLowerCase())
                ) {
                    return false;
                }

                return true;
            }).forEach((armorInfo) => {
                seriesMapping[armorInfo.seriesId] = {
                    series: armorInfo.series
                };
            });

            let seriesIds = Object.keys(seriesMapping).sort((seriesIdA, seriesIdB) => {
                return _(seriesIdA) > _(seriesIdB) ? 1 : -1;
            });

            if (0 === seriesIds.length) {
                return false;
            }

            let blocks = []

            for (let blockIndex = 0; blockIndex < Math.ceil(seriesIds.length / 10); blockIndex++) {
                blocks.push(
                    <div key={rare + '_' + blockIndex} className="mhwc-item mhwc-item-2-step">
                        <div className="col-12 mhwc-name">
                            <span>{_('armorFactor')}: (R{rare})</span>
                        </div>
                        <div className="col-12 mhwc-content">
                            {seriesIds.slice(blockIndex * 10, (blockIndex + 1) * 10).map((seriesId) => {
                                let isInclude = Helper.isNotEmpty(armorFactor[seriesId])
                                    ? armorFactor[seriesId] : true;

                                return (
                                    <div key={seriesId} className="col-6 mhwc-value">
                                        <span>{_(seriesMapping[seriesId].series)}</span>
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
            }

            return blocks;
        });
    }, [segment, stateAlgorithmParams, stateRequiredEquips, stateRequiredSkills]);
};
