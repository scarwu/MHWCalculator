/**
 * Algorithm Setting
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React, { Fragment, useState, useEffect, useCallback, useRef } from 'react';

// Load Core Libraries
import Status from 'core/status';
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';
import JewelDataset from 'libraries/dataset/jewel';
import ArmorDataset from 'libraries/dataset/armor';
import CharmDataset from 'libraries/dataset/charm';
import SkillDataset from 'libraries/dataset/skill';

// Load Components
import IconButton from 'components/common/iconButton';
import IconInput from 'components/common/iconInput';
import BasicSelector from 'components/common/basicSelector';
import BasicInput from 'components/common/basicInput';

// Load State Control
import CommonState from 'states/common';
import ModalState from 'states/modal';

// Load Config
import Config from 'config';

/**
 * Variables
 */
const levelMapping = [ 'I', 'II', 'III', 'IV', 'V' ];

const sortList = [
    { key: 'complex', value: _('complexSort') },
    { key: 'defense', value: _('defenseSort') },
    { key: 'fire', value: _('fireSort') },
    { key: 'water', value: _('waterSort') },
    { key: 'thunder', value: _('thunderSort') },
    { key: 'ice', value: _('iceSort') },
    { key: 'dragon', value: _('dragonSort') },
    { key: 'amount', value: _('amountSort') },
    { key: 'slot', value: _('slotSort') },
    { key: 'expectedValue', value: _('expectedValueSort') },
    { key: 'expectedLevel', value: _('expectedLevelSort') }
];

const orderList = [
    { key: 'desc', value: _('desc') },
    { key: 'asc', value: _('asc') }
];

const strategyList = [
    { key: 'rough', value: _('roughStrategy') },
    { key: 'speed', value: _('speedStrategy') },
    { key: 'complete', value: _('completeStrategy') }
];

const armorRareList = [5, 6, 7, 8, 9, 10, 11, 12];
const jewelSizeList = [1, 2, 3, 4];

/**
 * Handler Functions
 */
const handleLimitChange = (event) => {
    if ('' === event.target.value) {
        return;
    }

    let limit = parseInt(event.target.value);

    limit = (false === isNaN(limit)) ? limit : 1;

    event.target.value = limit;

    CommonState.setter.setAlgorithmParamsLimit(limit);
};

const handleSortChange = (event) => {
    CommonState.setter.setAlgorithmParamsSort(event.target.value);
};

const handleOrderChange = (event) => {
    CommonState.setter.setAlgorithmParamsOrder(event.target.value);
};

const handleStrategyChange = (event) => {
    CommonState.setter.setAlgorithmParamsStrategy(event.target.value);
};

const renderArmorFactors = (armorFactor, stateSegment) => {
    return armorRareList.map((rare) => {
        if (false === armorFactor['rare' + rare]) {
            return false;
        }

        let seriesMapping = {};

        ArmorDataset.rareIs(rare).getItems().filter((info) => {
            let text = _(info.series);

            if (Helper.isNotEmpty(stateSegment)
                && -1 === text.toLowerCase().search(stateSegment.toLowerCase())
            ) {
                return false;
            }

            return true;
        }).forEach((info) => {
            seriesMapping[info.seriesId] = {
                series: info.series
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
                        <span>{_('advanced')}: (R{rare}) {_('armorFactor')}-{blockIndex + 1}</span>
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
};

const renderCharmFactors = (charmFactor, stateSegment) => {
    let seriesMapping = {};

    CharmDataset.getItems().filter((info) => {
        let text = _(info.series);

        if (Helper.isNotEmpty(stateSegment)
            && -1 === text.toLowerCase().search(stateSegment.toLowerCase())
        ) {
            return false;
        }

        return true;
    }).forEach((info) => {
        if (Helper.isEmpty(seriesMapping[info.seriesId])) {
            seriesMapping[info.seriesId] = {
                series: info.series,
                min: 1,
                max: 1
            };
        }

        if (seriesMapping[info.seriesId].max < info.level) {
            seriesMapping[info.seriesId].max = info.level;
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
                    <span>{_('advanced')}: {_('charmFactor')}-{blockIndex + 1}</span>
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
};

const renderJewelFactors = (jewelFactor, stateSegment) => {
    return jewelSizeList.map((size) => {
        if (false === jewelFactor['size' + size]) {
            return false;
        }

        let jewelMapping = {};

        JewelDataset.sizeIs(size).getItems().filter((info) => {
            let text = _(info.name);

            if (Helper.isNotEmpty(stateSegment)
                && -1 === text.toLowerCase().search(stateSegment.toLowerCase())
            ) {
                return false;
            }

            return true;
        }).forEach((info) => {
            if (Helper.isEmpty(jewelMapping[info.id])) {
                jewelMapping[info.id] = {
                    name: info.name,
                    min: 1,
                    max: 1
                };
            }

            info.skills.forEach((skill) => {
                let skillInfo = SkillDataset.getInfo(skill.id);

                if (jewelMapping[info.id].max < skillInfo.list.length) {
                    jewelMapping[info.id].max = skillInfo.list.length;
                }
            })
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
                        <span>{_('advanced')}: [{size}] {_('jewelFactor')}-{blockIndex + 1}</span>
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
};

export default function AlgorithmSetting(props) {

    /**
     * Hooks
     */
    const [stateAlgorithmParams, updateAlgorithmParams] = useState(CommonState.getter.getAlgorithmParams());
    const [stateIsShow, updateIsShow] = useState(ModalState.getter.isShowAlgorithmSetting());
    const [stateSegment, updateSegment] = useState(undefined);
    const refModal = useRef();

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribeCommon = CommonState.store.subscribe(() => {
            updateAlgorithmParams(CommonState.getter.getAlgorithmParams());
        });

        const unsubscribeModal = ModalState.store.subscribe(() => {
            updateIsShow(ModalState.getter.isShowAlgorithmSetting());
        });

        return () => {
            unsubscribeCommon();
            unsubscribeModal();
        };
    }, []);

    /**
     * Handle Functions
     */
    const handleFastWindowClose = useCallback((event) => {
        if (refModal.current !== event.target) {
            return;
        }

        ModalState.setter.hideAlgorithmSetting();
    }, []);

    const handleSegmentInput = useCallback((event) => {
        let segment = event.target.value;

        segment = (0 !== segment.length)
            ? segment.replace(/([.?*+^$[\]\\(){}|-])/g, '').trim() : null;

        updateSegment(segment);
    }, []);

    /**
     * Render Functions
     */
    return stateIsShow ? (
        <div className="mhwc-selector" ref={refModal} onClick={handleFastWindowClose}>
            <div className="mhwc-modal">
                <div className="mhwc-panel">
                    <strong>{_('algorithmSetting')}</strong>

                    <div className="mhwc-icons_bundle">
                        <IconInput
                            iconName="search" placeholder={_('inputKeyword')}
                            defaultValue={stateSegment} onChange={handleSegmentInput} />

                        <IconButton
                            iconName="times" altName={_('close')}
                            onClick={ModalState.setter.hideAlgorithmSetting} />
                    </div>
                </div>
                <div className="mhwc-list">
                    <div className="mhwc-wrapper">
                        <div className="mhwc-item mhwc-item-2-step">
                            <div className="col-12 mhwc-name">
                                <span>{_('resultLimit')}</span>

                                <div className="mhwc-icons_bundle">
                                    <BasicInput
                                        iconName="list-alt"
                                        defaultValue={stateAlgorithmParams.limit}
                                        onChange={handleLimitChange} />
                                </div>
                            </div>
                        </div>

                        <div className="mhwc-item mhwc-item-2-step">
                            <div className="col-12 mhwc-name">
                                <span>{_('sort')}</span>

                                <div className="mhwc-icons_bundle">
                                    <BasicSelector
                                        iconName="sort-amount-desc"
                                        defaultValue={stateAlgorithmParams.sort}
                                        options={sortList} onChange={handleSortChange} />
                                    <BasicSelector
                                        iconName="sort-amount-desc"
                                        defaultValue={stateAlgorithmParams.order}
                                        options={orderList} onChange={handleOrderChange} />
                                </div>
                            </div>
                        </div>

                        <div className="mhwc-item mhwc-item-2-step">
                            <div className="col-12 mhwc-name">
                                <span>{_('strategy')}</span>
                            </div>
                            <div className="col-12 mhwc-content">
                                {['isEndEarly', 'isExpectBundle', 'isRequireConsistent'].map((target) => {
                                    return (
                                        <div key={target} className="col-6 mhwc-value">
                                            <span>{_(target)}</span>
                                            <div className="mhwc-icons_bundle">
                                                {stateAlgorithmParams.flag[target] ? (
                                                    <IconButton
                                                        iconName="star"
                                                        altName={_('exclude')}
                                                        onClick={() => {CommonState.setter.toggleAlgorithmParamsFlag(target)}} />
                                                ) : (
                                                    <IconButton
                                                        iconName="star-o"
                                                        altName={_('include')}
                                                        onClick={() => {CommonState.setter.toggleAlgorithmParamsFlag(target)}} />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mhwc-item mhwc-item-2-step">
                            <div className="col-12 mhwc-name">
                                <span>{_('basic')}: {_('armorFactor')}</span>
                            </div>
                            <div className="col-12 mhwc-content">
                                {armorRareList.map((rare) => {
                                    return (
                                        <div key={rare} className="col-6 mhwc-value">
                                            <span>{_('rare') + `: ${rare}`}</span>
                                            <div className="mhwc-icons_bundle">
                                                {stateAlgorithmParams.usingFactor.armor['rare' + rare] ? (
                                                    <IconButton
                                                        iconName="star"
                                                        altName={_('exclude')}
                                                        onClick={() => {CommonState.setter.setAlgorithmParamsUsingFactor('armor', 'rare' + rare, false)}} />
                                                ) : (
                                                    <IconButton
                                                        iconName="star-o"
                                                        altName={_('include')}
                                                        onClick={() => {CommonState.setter.setAlgorithmParamsUsingFactor('armor', 'rare' + rare, true)}} />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="mhwc-item mhwc-item-2-step">
                            <div className="col-12 mhwc-name">
                                <span>{_('basic')}: {_('jewelFactor')}</span>
                            </div>
                            <div className="col-12 mhwc-content">
                                {jewelSizeList.map((size) => {
                                    return (
                                        <div key={size} className="col-6 mhwc-value">
                                            <span>{_('size') + `: ${size}`}</span>
                                            <div className="mhwc-icons_bundle">
                                                {stateAlgorithmParams.usingFactor.jewel['size' + size] ? (
                                                    <IconButton
                                                        iconName="star"
                                                        altName={_('exclude')}
                                                        onClick={() => {CommonState.setter.setAlgorithmParamsUsingFactor('jewel', 'size' + size, false)}} />
                                                ) : (
                                                    <IconButton
                                                        iconName="star-o"
                                                        altName={_('include')}
                                                        onClick={() => {CommonState.setter.setAlgorithmParamsUsingFactor('jewel', 'size' + size, true)}} />
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {renderArmorFactors(stateAlgorithmParams.usingFactor.armor, stateSegment)}
                        {renderCharmFactors(stateAlgorithmParams.usingFactor.charm, stateSegment)}
                        {renderJewelFactors(stateAlgorithmParams.usingFactor.jewel, stateSegment)}
                    </div>
                </div>
            </div>
        </div>
    ) : false;
};
