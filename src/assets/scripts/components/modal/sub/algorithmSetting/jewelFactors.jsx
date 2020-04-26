/**
 * Algorithm Setting: Jewel Factors
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
import JewelDataset from 'libraries/dataset/jewel';

// Load Components
import BasicSelector from 'components/common/basicSelector';

// Load State Control
import CommonState from 'states/common';

/**
 * Variables
 */
const jewelSizeList = [ 1, 2, 3, 4 ];

export default function JewelFactors(props) {
    const {segment} = props;

    /**
     * Hooks
     */
    const [stateAlgorithmParams, updateAlgorithmParams] = useState(CommonState.getter.getAlgorithmParams());
    const [stateRequiredSkills, updateRequiredSkills] = useState(CommonState.getter.getRequiredSkills());

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribe = CommonState.store.subscribe(() => {
            updateAlgorithmParams(CommonState.getter.getAlgorithmParams());
            updateRequiredSkills(CommonState.getter.getRequiredSkills());
        });

        return () => {
            unsubscribe();
        };
    }, []);

    return useMemo(() => {
        Helper.debug('Component: AlgorithmSetting -> JewelFactors');

        let jewelMapping = {};
        let skillLevelMapping = {};

        const skillIds = stateRequiredSkills.map((skill) => {
            skillLevelMapping[skill.id] = skill.level;

            return skill.id;
        });

        skillIds.forEach((skillId) => {
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

        let jewelFactor = stateAlgorithmParams.usingFactor.jewel;

        return jewelSizeList.map((size) => {
            if (false === jewelFactor['size' + size]) {
                return false;
            }

            let jewelMapping = {};

            JewelDataset.sizeIs(size).getItems().filter((jewelInfo) => {
                let text = _(jewelInfo.name);

                if (Helper.isNotEmpty(segment)
                    && -1 === text.toLowerCase().search(segment.toLowerCase())
                ) {
                    return false;
                }

                return true;
            }).forEach((jewelInfo) => {
                if (Helper.isEmpty(jewelMapping[jewelInfo.id])) {
                    jewelMapping[jewelInfo.id] = {
                        name: jewelInfo.name,
                        min: 1,
                        max: 1
                    };
                }

                jewelInfo.skills.forEach((skill) => {
                    let skillInfo = SkillDataset.getInfo(skill.id);

                    if (jewelMapping[jewelInfo.id].max < skillInfo.list.length) {
                        jewelMapping[jewelInfo.id].max = skillInfo.list.length;
                    }
                });
            });

            let jewelIds = Object.keys(jewelMapping).sort((jewelIdA, jewelIdB) => {
                return _(jewelIdA) > _(jewelIdB) ? 1 : -1;
            });

            if (0 === jewelIds.length) {
                return false;
            }

            let blocks = []

            for (let blockIndex = 0; blockIndex < Math.ceil(jewelIds.length / 10); blockIndex++) {
                blocks.push(
                    <div key={size + '_' + blockIndex} className="mhwc-item mhwc-item-2-step">
                        <div className="col-12 mhwc-name">
                            <span>{_('jewelFactor')}: [{size}]</span>
                        </div>
                        <div className="col-12 mhwc-content">
                            {jewelIds.slice(blockIndex * 10, (blockIndex + 1) * 10).map((jewelId) => {
                                let selectLevel = Helper.isNotEmpty(jewelFactor[jewelId])
                                    ? jewelFactor[jewelId] : -1;
                                let diffLevel = jewelMapping[jewelId].max - jewelMapping[jewelId].min + 1;
                                let levelList = [
                                    { key: -1, value: _('unlimited') },
                                    { key: 0, value: _('exclude') }
                                ];

                                [...Array(diffLevel).keys()].forEach((data, index) => {
                                    levelList.push({ key: index + 1, value: index + 1 })
                                });

                                return (
                                    <div key={jewelId} className="col-6 mhwc-value">
                                        <span>{_(jewelMapping[jewelId].name)}</span>
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
            }

            return blocks;
        });
    }, [segment, stateAlgorithmParams, stateRequiredSkills]);
};
