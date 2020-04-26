/**
 * Algorithm Setting: Charm Factors
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
import CharmDataset from 'libraries/dataset/charm';

// Load Components
import BasicSelector from 'components/common/basicSelector';

// Load State Control
import CommonState from 'states/common';

/**
 * Variables
 */
const levelMapping = [ 'I', 'II', 'III', 'IV', 'V' ];

export default function CharmFactors(props) {
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
        Helper.debug('Component: AlgorithmSetting -> CharmFactors');

        let charmSeriesMapping = {};
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
        });

        let charmFactor = stateAlgorithmParams.usingFactor.charm;


        let seriesMapping = {};

        CharmDataset.getItems().filter((charmInfo) => {
            let text = _(charmInfo.series);

            if (Helper.isNotEmpty(segment)
                && -1 === text.toLowerCase().search(segment.toLowerCase())
            ) {
                return false;
            }

            return true;
        }).forEach((charmInfo) => {
            if (Helper.isEmpty(seriesMapping[charmInfo.seriesId])) {
                seriesMapping[charmInfo.seriesId] = {
                    series: charmInfo.series,
                    min: 1,
                    max: 1
                };
            }

            if (seriesMapping[charmInfo.seriesId].max < charmInfo.level) {
                seriesMapping[charmInfo.seriesId].max = charmInfo.level;
            }
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
                <div key={blockIndex} className="mhwc-item mhwc-item-2-step">
                    <div className="col-12 mhwc-name">
                        <span>{_('charmFactor')}</span>
                    </div>
                    <div className="col-12 mhwc-content">
                        {seriesIds.slice(blockIndex * 10, (blockIndex + 1) * 10).map((seriesId) => {
                            let selectLevel = Helper.isNotEmpty(charmFactor[seriesId])
                                ? charmFactor[seriesId] : -1;
                            let levelList = [
                                { key: -1, value: _('all') },
                                { key: 0, value: _('exclude') }
                            ];

                            [...Array(seriesMapping[seriesId].max - seriesMapping[seriesId].min + 1).keys()].forEach((data, index) => {
                                levelList.push({ key: index + 1, value: levelMapping[index] })
                            });

                            return (
                                <div key={seriesId} className="col-6 mhwc-value">
                                    <span>{_(seriesMapping[seriesId].series)}</span>
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
            );
        }

        return blocks;
    }, [segment, stateAlgorithmParams, stateRequiredSkills]);
};
