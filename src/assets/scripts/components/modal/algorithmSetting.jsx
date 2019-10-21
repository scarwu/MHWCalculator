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
import FunctionalButton from 'components/common/functionalButton';
import FunctionalSelector from 'components/common/functionalSelector';
import FunctionalInput from 'components/common/functionalInput';

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

const renderArmorFactors = (armorFactor) => {
    return armorRareList.map((rare) => {
        if (false === armorFactor['rare' + rare]) {
            return false;
        }

        let seriesIds = {};

        ArmorDataset.rareIs(rare).getItems().forEach((info) => {
            seriesIds[info.seriesId] = true;
        });

        return (
            <div key={rare} className="mhwc-item mhwc-item-2-step">
                <div className="col-12 mhwc-name">
                    <span>{_('armorFactor')} R{rare}</span>
                </div>
                <div className="col-12 mhwc-content">
                    {Object.keys(seriesIds).sort((seriesIdA, seriesIdB) => {
                        return _(seriesIdA) > _(seriesIdB) ? 1 : -1;
                    }).map((seriesId) => {
                        let isInclude = Helper.isNotEmpty(armorFactor[seriesId])
                            ? armorFactor[seriesId] : true;

                        return (
                            <div key={seriesId} className="col-6 mhwc-value">
                                <span>{_(seriesId)}</span>
                                <div className="mhwc-icons_bundle">
                                    {isInclude ? (
                                        <FunctionalButton
                                            iconName="star"
                                            altName={_('exclude')}
                                            onClick={() => {CommonState.setter.setAlgorithmParamsUsingFactor('armor', seriesId, false)}} />
                                    ) : (
                                        <FunctionalButton
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
    });
};

const renderCharmFactors = (charmFactor) => {
    let seriesIds = {};

    CharmDataset.getItems().forEach((info) => {
        if (Helper.isEmpty(seriesIds[info.seriesId])) {
            seriesIds[info.seriesId] = {
                min: 1,
                max: 1
            };
        }

        if (seriesIds[info.seriesId].max < info.level) {
            seriesIds[info.seriesId].max = info.level;
        }
    });

    return (
        <div className="mhwc-item mhwc-item-2-step">
            <div className="col-12 mhwc-name">
                <span>{_('charmFactor')}</span>
            </div>
            <div className="col-12 mhwc-content">
                {Object.keys(seriesIds).sort((seriesIdA, seriesIdB) => {
                    return _(seriesIdA) > _(seriesIdB) ? 1 : -1;
                }).map((seriesId) => {
                    let selectLevel = Helper.isNotEmpty(charmFactor[seriesId])
                        ? charmFactor[seriesId] : -1;
                    let levelList = [
                        { key: -1, value: _('all') },
                        { key: 0, value: _('exclude') }
                    ];

                    [...Array(seriesIds[seriesId].max - seriesIds[seriesId].min + 1).keys()].forEach((data, index) => {
                        levelList.push({ key: index + 1, value: levelMapping[index] })
                    });

                    return (
                        <div key={seriesId} className="col-6 mhwc-value">
                            <span>{_(seriesId)}</span>
                            <div className="mhwc-icons_bundle">
                                <FunctionalSelector
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
};

const renderJewelFactors = (jewelFactor) => {
    return jewelSizeList.map((size) => {
        if (false === jewelFactor['size' + size]) {
            return false;
        }

        let jewelIds = {};

        JewelDataset.sizeIs(size).getItems().forEach((info) => {
            if (Helper.isEmpty(jewelIds[info.id])) {
                jewelIds[info.id] = {
                    min: 1,
                    max: 1
                };
            }

            info.skills.forEach((skill) => {
                let skillInfo = SkillDataset.getInfo(skill.id);

                if (jewelIds[info.id].max < skillInfo.list.length) {
                    jewelIds[info.id].max = skillInfo.list.length;
                }
            })
        });

        return (
            <div key={size} className="mhwc-item mhwc-item-2-step">
                <div className="col-12 mhwc-name">
                    <span>{_('jewelFactor')} [{size}]</span>
                </div>
                <div className="col-12 mhwc-content">
                    {Object.keys(jewelIds).sort((jewelIdA, jewelIdB) => {
                        return _(jewelIdA) > _(jewelIdB) ? 1 : -1;
                    }).map((jewelId) => {
                        let selectLevel = Helper.isNotEmpty(jewelFactor[jewelId])
                            ? jewelFactor[jewelId] : -1;
                        let diffLevel = jewelIds[jewelId].max - jewelIds[jewelId].min + 1;
                        let levelList = [
                            { key: -1, value: _('unlimited') },
                            { key: 0, value: _('exclude') }
                        ];

                        [...Array(diffLevel).keys()].forEach((data, index) => {
                            levelList.push({ key: index + 1, value: index + 1 })
                        });

                        return (
                            <div key={jewelId} className="col-6 mhwc-value">
                                <span>{_(jewelId)}</span>
                                <div className="mhwc-icons_bundle">
                                    <FunctionalSelector
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
    });
};

export default function AlgorithmSetting(props) {

    /**
     * Hooks
     */
    const [stateAlgorithmParams, updateAlgorithmParams] = useState(CommonState.getter.getAlgorithmParams());
    const [stateIsShow, updateIsShow] = useState(ModalState.getter.isShowAlgorithmSetting());
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

    /**
     * Render Functions
     */
    return stateIsShow ? (
        <div className="mhwc-selector" ref={refModal} onClick={handleFastWindowClose}>
            <div className="mhwc-modal">
                <div className="mhwc-panel">
                    <strong>{_('algorithmSetting')}</strong>

                    <div className="mhwc-icons_bundle">
                        <FunctionalButton
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
                                    <FunctionalInput
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
                                    <FunctionalSelector
                                        iconName="sort-amount-desc"
                                        defaultValue={stateAlgorithmParams.sort}
                                        options={sortList} onChange={handleSortChange} />
                                    <FunctionalSelector
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
                                {['isEndEarly', 'isRequireConsistent'].map((target) => {
                                    return (
                                        <div key={target} className="col-6 mhwc-value">
                                            <span>{_(target)}</span>
                                            <div className="mhwc-icons_bundle">
                                                {stateAlgorithmParams.flag[target] ? (
                                                    <FunctionalButton
                                                        iconName="star"
                                                        altName={_('exclude')}
                                                        onClick={() => {CommonState.setter.toggleAlgorithmParamsFlag(target)}} />
                                                ) : (
                                                    <FunctionalButton
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
                                <span>{_('armorFactor')}</span>
                            </div>
                            <div className="col-12 mhwc-content">
                                {armorRareList.map((rare) => {
                                    return (
                                        <div key={rare} className="col-6 mhwc-value">
                                            <span>{_('rare') + `: ${rare}`}</span>
                                            <div className="mhwc-icons_bundle">
                                                {stateAlgorithmParams.usingFactor.armor['rare' + rare] ? (
                                                    <FunctionalButton
                                                        iconName="star"
                                                        altName={_('exclude')}
                                                        onClick={() => {CommonState.setter.setAlgorithmParamsUsingFactor('armor', 'rare' + rare, false)}} />
                                                ) : (
                                                    <FunctionalButton
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

                        {renderArmorFactors(stateAlgorithmParams.usingFactor.armor)}
                        {renderCharmFactors(stateAlgorithmParams.usingFactor.charm)}

                        <div className="mhwc-item mhwc-item-2-step">
                            <div className="col-12 mhwc-name">
                                <span>{_('jewelFactor')}</span>
                            </div>
                            <div className="col-12 mhwc-content">
                                {jewelSizeList.map((size) => {
                                    return (
                                        <div key={size} className="col-6 mhwc-value">
                                            <span>{_('size') + `: ${size}`}</span>
                                            <div className="mhwc-icons_bundle">
                                                {stateAlgorithmParams.usingFactor.jewel['size' + size] ? (
                                                    <FunctionalButton
                                                        iconName="star"
                                                        altName={_('exclude')}
                                                        onClick={() => {CommonState.setter.setAlgorithmParamsUsingFactor('jewel', 'size' + size, false)}} />
                                                ) : (
                                                    <FunctionalButton
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

                        {renderJewelFactors(stateAlgorithmParams.usingFactor.jewel)}
                    </div>
                </div>
            </div>
        </div>
    ) : false;
};
