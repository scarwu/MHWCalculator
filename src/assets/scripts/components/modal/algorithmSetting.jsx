'use strict';
/**
 *
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

// Load Components
import FunctionalButton from 'components/common/functionalButton';

// Load State Control
import CommonState from 'states/common';
import ModalState from 'states/modal';

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
            <div className="mhwc-modal mhwc-slim-modal">
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
                                <span>一般設定</span>
                            </div>
                            <div className="col-12 mhwc-content">
                                <div className="col-4 mhwc-name">
                                    顯示數量
                                </div>
                                <div className="col-8 mhwc-value">
                                    {stateAlgorithmParams.limit}
                                </div>
                                <div className="col-4 mhwc-name">
                                    排序方式
                                </div>
                                <div className="col-8 mhwc-value">
                                    {stateAlgorithmParams.sort}
                                </div>
                                <div className="col-4 mhwc-name">
                                    搜尋策略
                                </div>
                                <div className="col-8 mhwc-value">
                                    {stateAlgorithmParams.strategy}
                                </div>
                            </div>
                        </div>
                        <div className="mhwc-item mhwc-item-2-step">
                            <div className="col-12 mhwc-name">
                                <span>裝備因子</span>
                            </div>
                            <div className="col-12 mhwc-content">
                                {Object.keys(stateAlgorithmParams.includeArmorRare).map((rare) => {
                                    return (
                                        <Fragment>
                                            <div className="col-4 mhwc-name">
                                                {_('rare') + `: ${rare}`}
                                            </div>
                                            <div className="col-8 mhwc-value">
                                                {stateAlgorithmParams.includeArmorRare[rare] ? '納入' : '未納入'}
                                            </div>
                                        </Fragment>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    ) : false;
};
