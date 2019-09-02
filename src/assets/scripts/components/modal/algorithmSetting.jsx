'use strict';
/**
 * Algorithm Setting
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React, { useState, useEffect, useRef } from 'react';

// Load Core Libraries
import Status from 'core/status';
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';

// Load Components
import FunctionalIcon from 'components/common/functionalIcon';

// Load State Control
import CommonStates from 'states/common';
import ModalStates from 'states/modal';

export default function (props) {
    const refModal = useRef();
    const [stateAlgorithmParams, updateAlgorithmParams] = useState(CommonStates.getters.getAlgorithmParams());
    const [stateIsShow, updateIsShow] = useState(ModalStates.getters.isShowAlgorithmSetting());
            console.log(stateIsShow)
    // Did Mount & Will Ummount
    useEffect(() => {
        const unsubscribeCommon = CommonStates.store.subscribe(() => {
            updateAlgorithmParams(CommonStates.getters.getAlgorithmParams());
        });

        const unsubscribeModal = ModalStates.store.subscribe(() => {
            updateIsShow(ModalStates.getters.isShowAlgorithmSetting());
        });

        return () => {
            unsubscribeCommon();
            unsubscribeModal();
        };
    }, []);

    /**
     * Handle Functions
     */
    let handleFastWindowClose = (event) => {
        if (refModal.current !== event.target) {
            return;
        }

        handleWindowClose();
    };

    let handleWindowClose = () => {
        ModalStates.setters.hideAlgorithmSetting();
    };

    /**
     * Render Functions
     */
    return stateIsShow ? (
        <div className="mhwc-selector" ref={refModal} onClick={handleFastWindowClose}>
            <div className="mhwc-modal mhwc-slim-modal">
                <div className="mhwc-panel">
                    <strong>{_('algorithmSetting')}</strong>

                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName="times" altName={_('close')}
                            onClick={handleWindowClose} />
                    </div>
                </div>
                <div className="mhwc-list">

                </div>
            </div>
        </div>
    ) : false;
};
