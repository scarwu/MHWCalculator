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
import FunctionalIcon from 'components/common/functionalIcon';

// Load State Control
import ModalStates from 'states/modal';

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
    const [stateIsShow, updateIsShow] = useState(ModalStates.getters.isShowChangelog());
    const refModal = useRef();

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {
        const unsubscribe = ModalStates.store.subscribe(() => {
            updateIsShow(ModalStates.getters.isShowChangelog());
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
        ModalStates.setters.hideChangelog();
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
                    <strong>{_('changelog')}</strong>

                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName="times" altName={_('close')}
                            onClick={handleWindowClose} />
                    </div>
                </div>
                <div className="mhwc-list" dangerouslySetInnerHTML={{__html: renderChangelog()}}></div>
            </div>
        </div>
    ) : false;
};
