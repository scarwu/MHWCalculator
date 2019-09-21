'use strict';
/**
 * Changelog
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
import FunctionalButton from 'components/common/functionalButton';

// Load State Control
import ModalState from 'states/modal';

// Load Markdown
import zhTWChangelog from 'files/md/langs/zhTW/changelog.md';
import jaJPChangelog from 'files/md/langs/jaJP/changelog.md';
import enUSChangelog from 'files/md/langs/enUS/changelog.md';

let ChangelogMap = {
    zhTW: zhTWChangelog,
    jaJP: jaJPChangelog,
    enUS: enUSChangelog
};

export default function Changelog(props) {

    /**
     * Hooks
     */
    const [stateIsShow, updateIsShow] = useState(ModalState.getter.isShowChangelog());
    const refModal = useRef();

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribe = ModalState.store.subscribe(() => {
            updateIsShow(ModalState.getter.isShowChangelog());
        });

        return () => {
            unsubscribe();
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
        ModalState.setter.hideChangelog();
    };

    /**
     * Render Functions
     */
    let renderChangelog = () => {
        return Helper.isNotEmpty(ChangelogMap[Status.get('sys:lang')])
            ? ChangelogMap[Status.get('sys:lang')] : false;
    };

    return stateIsShow ? (
        <div className="mhwc-selector" ref={refModal} onClick={handleFastWindowClose}>
            <div className="mhwc-modal mhwc-slim-modal">
                <div className="mhwc-panel">
                    <span className="mhwc-title">{_('changelog')}</span>

                    <div className="mhwc-icons_bundle">
                        <FunctionalButton
                            iconName="times" altName={_('close')}
                            onClick={handleWindowClose} />
                    </div>
                </div>
                <div className="mhwc-list">
                    <div className="mhwc-article" dangerouslySetInnerHTML={{__html: renderChangelog()}}></div>
                </div>
            </div>
        </div>
    ) : false;
};
