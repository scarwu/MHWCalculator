/**
 * Algorithm Setting
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React, { useState, useEffect, useCallback, useRef } from 'react';

// Load Core Libraries
import Status from 'core/status';
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';

// Load Components
import ArmorFactors from 'components/modal/sub/algorithmSetting/armorFactors';
import CharmFactors from 'components/modal/sub/algorithmSetting/charmFactors';
import JewelFactors from 'components/modal/sub/algorithmSetting/jewelFactors';
import IconButton from 'components/common/iconButton';
import IconSelector from 'components/common/iconSelector';
import IconInput from 'components/common/iconInput';
import BasicSelector from 'components/common/basicSelector';
import BasicInput from 'components/common/basicInput';

// Load State Control
import CommonState from 'states/common';
import ModalState from 'states/modal';

/**
 * Variables
 */
const getSortList = () => {
    return [
        { key: 'complex',       value: _('complexSort') },
        { key: 'defense',       value: _('defenseSort') },
        { key: 'fire',          value: _('fireSort') },
        { key: 'water',         value: _('waterSort') },
        { key: 'thunder',       value: _('thunderSort') },
        { key: 'ice',           value: _('iceSort') },
        { key: 'dragon',        value: _('dragonSort') },
        { key: 'amount',        value: _('amountSort') },
        { key: 'slot',          value: _('slotSort') },
        { key: 'expectedValue', value: _('expectedValueSort') },
        { key: 'expectedLevel', value: _('expectedLevelSort') }
    ];
}

const getOrderList = () => {
    return [
        { key: 'desc',          value: _('desc') },
        { key: 'asc',           value: _('asc') }
    ];
}

const getModeList = () => {
    return [
        { key: 'all',                   value: _('all') },
        { key: 'armorFactor',           value: _('armorFactor') },
        { key: 'charmFactor',           value: _('charmFactor') },
        { key: 'jewelFactor',           value: _('jewelFactor') },
        { key: 'byRequiredConditions',  value: _('byRequiredConditions') }
    ];
}

const armorRareList = [ 5, 6, 7, 8, 9, 10, 11, 12 ];
const jewelSizeList = [ 1, 2, 3, 4 ];

/**
 * Handler Functions
 */
const handleModeChange = (event) => {
    ModalState.setter.showAlgorithmSetting({
        mode: event.target.value
    });
};

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

export default function AlgorithmSetting(props) {

    /**
     * Hooks
     */
    const [stateAlgorithmParams, updateAlgorithmParams] = useState(CommonState.getter.getAlgorithmParams());
    const [stateIsShow, updateIsShow] = useState(ModalState.getter.isShowAlgorithmSetting());
    const [stateBypassData, updateBypassData] = useState(ModalState.getter.getAlgorithmSettingBypassData());
    const [stateSegment, updateSegment] = useState(undefined);
    const [stateMode, updateMode] = useState(undefined);
    const refModal = useRef();

    useEffect(() => {
        if (Helper.isEmpty(stateBypassData)) {
            return;
        }

        if (Helper.isEmpty(stateBypassData.mode)) {
            return;
        }

        updateMode(stateBypassData.mode);
    }, [stateBypassData]);

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribeCommon = CommonState.store.subscribe(() => {
            updateAlgorithmParams(CommonState.getter.getAlgorithmParams());
        });

        const unsubscribeModal = ModalState.store.subscribe(() => {
            updateIsShow(ModalState.getter.isShowAlgorithmSetting());
            updateBypassData(ModalState.getter.getAlgorithmSettingBypassData());
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
                        <IconSelector
                            iconName="globe" defaultValue={stateMode}
                            options={getModeList()} onChange={handleModeChange} />
                        <IconButton
                            iconName="times" altName={_('close')}
                            onClick={ModalState.setter.hideAlgorithmSetting} />
                    </div>
                </div>
                <div className="mhwc-list">
                    <div className="mhwc-wrapper">
                        <div className="mhwc-item mhwc-item-2-step">
                            <div className="col-12 mhwc-name">
                                <span>{_('strategy')}</span>
                            </div>
                            <div className="col-12 mhwc-content">
                                <div className="col-6 mhwc-name">
                                    <span>{_('resultLimit')}</span>
                                </div>
                                <div className="col-6 mhwc-value">
                                    <BasicInput
                                        iconName="list-alt"
                                        defaultValue={stateAlgorithmParams.limit}
                                        onChange={handleLimitChange} />
                                </div>
                                <div className="col-6 mhwc-name">
                                    <span>{_('sortBy')}</span>
                                </div>
                                <div className="col-6 mhwc-value">
                                    <BasicSelector
                                        iconName="sort-amount-desc"
                                        defaultValue={stateAlgorithmParams.sort}
                                        options={getSortList()} onChange={handleSortChange} />
                                </div>
                                <div className="col-6 mhwc-name">
                                    <span>{_('sortOrder')}</span>
                                </div>
                                <div className="col-6 mhwc-value">
                                    <BasicSelector
                                        iconName="sort-amount-desc"
                                        defaultValue={stateAlgorithmParams.order}
                                        options={getOrderList()} onChange={handleOrderChange} />
                                </div>
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

                        {'all' === stateMode || 'armorFactor' === stateMode || 'byRequiredConditions' === stateMode ? (
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
                        ) : false}

                        {'all' === stateMode || 'jewelFactor' === stateMode || 'byRequiredConditions' === stateMode ? (
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
                        ) : false}

                        {'all' === stateMode || 'armorFactor' === stateMode || 'byRequiredConditions' === stateMode
                            ? <ArmorFactors segment={stateSegment}
                                byRequiredConditions={'byRequiredConditions' === stateMode} />
                            : false}
                        {'all' === stateMode || 'charmFactor' === stateMode || 'byRequiredConditions' === stateMode
                            ? <CharmFactors segment={stateSegment}
                                byRequiredConditions={'byRequiredConditions' === stateMode} />
                            : false}
                        {'all' === stateMode || 'jewelFactor' === stateMode || 'byRequiredConditions' === stateMode
                            ? <JewelFactors segment={stateSegment}
                                byRequiredConditions={'byRequiredConditions' === stateMode} />
                            : false}
                    </div>
                </div>
            </div>
        </div>
    ) : false;
};
