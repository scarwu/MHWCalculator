'use strict';
/**
 * Main Module
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
import ConditionOptions from 'components/conditionOptions';
import CandidateBundles from 'components/candidateBundles';
import EquipsDisplayer from 'components/equipsDisplayer';
import CharacterStatus from 'components/characterStatus';

// Load Config & Constant
import Config from 'config';
import Constant from 'constant';

// Load State Control
import CommonStates from 'states/common';
import ModalStates from 'states/modal';

export default function App(props) {

    /**
     * Hooks
     */
    const [stateLang, updateLang] = useState(Status.get('sys:lang'));
    const refLang = useRef();

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {

        // Set Build Time
        Status.set('sys:buildTime', Config.buildTime);

        // Restore Equips from Url to State
        if (Helper.isNotEmpty(props.match.params.hash)) {
            CommonStates.setters.replaceCurrentEquips(
                JSON.parse(Helper.base64Decode(props.match.params.hash))
            );
        }
    }, []);

    /**
     * Handle Functions
     */
    let handleBundleExport = () => {
        let equips = Helper.deepCopy(CommonStates.getters.getCurrentEquips());
        let hash = Helper.base64Encode(JSON.stringify(equips));

        let protocol = window.location.protocol;
        let hostname = window.location.hostname;
        let pathname = window.location.pathname;

        window.open(`${protocol}//${hostname}${pathname}#/${hash}`, '_blank');
    };

    let handleLangChange = () => {
        Status.set('sys:lang', refLang.current.value);

        updateLang(refLang.current.value);
    };

    /**
     * Render Functions
     */
    return (
        <div key={stateLang} id="mhwc-app" className="container-fluid">
            <div className="row mhwc-header">
                <a className="mhwc-title" href="./">
                    <h1>{_('title')}</h1>
                </a>

                <div className="mhwc-icons_bundle">
                    <FunctionalIcon
                        iconName="link" altName={_('exportBundle')}
                        onClick={handleBundleExport} />
                    <FunctionalIcon
                        iconName="info" altName={_('showChangelog')}
                        onClick={ModalStates.setters.showChangelog} />
                    <div className="mhwc-lang">
                        <div>
                            <i className="fa fa-globe"></i>
                            <select defaultValue={stateLang} ref={refLang} onChange={handleLangChange}>
                                {Object.keys(Constant.langs).map((lang) => {
                                    return (
                                        <option key={lang} value={lang}>{Constant.langs[lang]}</option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row mhwc-container">
                <ConditionOptions />
                <CandidateBundles />
                <EquipsDisplayer />
                <CharacterStatus />
            </div>

            <div className="row mhwc-footer">
                <div className="col-12">
                    <span>Copyright (c) Scar Wu</span>
                </div>

                <div className="col-12">
                    <a href="//scar.tw" target="_blank">
                        <span>Blog</span>
                    </a>
                    &nbsp;|&nbsp;
                    <a href="https://github.com/scarwu/MHWCalculator" target="_blank">
                        <span>Github</span>
                    </a>
                </div>
            </div>
        </div>
    );
}
