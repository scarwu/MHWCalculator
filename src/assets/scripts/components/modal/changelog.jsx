/**
 * Changelog
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
import IconButton from 'components/common/iconButton';

// Load State Control
import ModalState from 'states/modal';

// Load Markdown
import zhTWChangelog from 'files/md/langs/zhTW/changelog.md';
import jaJPChangelog from 'files/md/langs/jaJP/changelog.md';
import enUSChangelog from 'files/md/langs/enUS/changelog.md';

/**
 * Variables
 */
const changelogMap = {
    zhTW: zhTWChangelog,
    jaJP: jaJPChangelog,
    enUS: enUSChangelog
};

/**
 * Handle Functions
 */
const getChangelog = () => {
    let changeLog = Helper.isNotEmpty(changelogMap[Status.get('sys:lang')])
        ? changelogMap[Status.get('sys:lang')] : false;

    if (false === changeLog) {
        return false;
    }

    return changeLog.replace(/\n/g, '').split('<hr>').map((log) => {
        let [all, title, content] = log.match(/^\<h3.+\>(.+)\<\/h3\>(.+)$/);

        return (
            <div className="mhwc-item mhwc-item-2-step">
                <div className="col-12 mhwc-name">
                    <span>{title}</span>
                </div>
                <div className="col-12 mhwc-value mhwc-description"
                     dangerouslySetInnerHTML={{__html: content}}></div>
            </div>
        );
    });

    return Helper.isNotEmpty(changelogMap[Status.get('sys:lang')])
        ? changelogMap[Status.get('sys:lang')] : false;
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
    const handleFastWindowClose = useCallback((event) => {
        if (refModal.current !== event.target) {
            return;
        }

        ModalState.setter.hideChangelog();
    }, []);

    return stateIsShow ? (
        <div className="mhwc-selector" ref={refModal} onClick={handleFastWindowClose}>
            <div className="mhwc-modal mhwc-slim-modal">
                <div className="mhwc-panel">
                    <span className="mhwc-title">{_('changelog')}</span>

                    <div className="mhwc-icons_bundle">
                        <IconButton
                            iconName="times" altName={_('close')}
                            onClick={ModalState.setter.hideChangelog} />
                    </div>
                </div>
                <div className="mhwc-list">
                    <div className="mhwc-wrapper">
                        {getChangelog()}
                    </div>
                </div>
            </div>
        </div>
    ) : false;
};
