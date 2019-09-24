/**
 * Main Module
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React, { useState, useEffect, useCallback } from 'react';

// Load Core Libraries
import Status from 'core/status';
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';

// Load Components
import FunctionalButton from 'components/common/functionalButton';
import FunctionalSelector from 'components/common/functionalSelector';
import ConditionOptions from 'components/conditionOptions';
import CandidateBundles from 'components/candidateBundles';
import EquipsDisplayer from 'components/equipsDisplayer';
import CharacterStatus from 'components/characterStatus';

// Load State Control
import CommonState from 'states/common';
import ModalState from 'states/modal';

// Load Config & Constant
import Config from 'config';
import Constant from 'constant';

if ('production' === Config.env) {
    if (Config.buildTime !== Status.get('sys:buildTime')) {
        ModalState.setter.showChangelog();
    }

    Status.set('sys:buildTime', Config.buildTime);
}

/**
 * Variables
 */
const langList = Object.keys(Constant.langs).filter((lang) => {
    return ('production' === Config.env) ? 'zhTW' === lang : true;
}).map((lang) => {
    return { key: lang, value: Constant.langs[lang] };
});

/**
 * Handle Functions
 */
const handleBundleExport = () => {
    let equips = Helper.deepCopy(CommonState.getter.getCurrentEquips());
    let hash = Helper.base64Encode(JSON.stringify(equips));

    let protocol = window.location.protocol;
    let hostname = window.location.hostname;
    let pathname = window.location.pathname;

    window.open(`${protocol}//${hostname}${pathname}#/${hash}`, '_blank');
};

export default function App(props) {

    /**
     * Hooks
     */
    const [stateLang, setLang] = useState(Status.get('sys:lang'));

    // Like Did Mount & Will Unmount Cycle
    useEffect(() => {

        // Restore Equips from Url to State
        if (Helper.isNotEmpty(props.match.params.hash)) {
            CommonState.setter.replaceCurrentEquips(
                JSON.parse(Helper.base64Decode(props.match.params.hash))
            );
        }
    }, []);

    /**
     * Handle Functions
     */
    const handleLangChange = useCallback((event) => {
        Status.set('sys:lang', event.target.value);
        setLang(event.target.value);
    }, []);

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
                    <FunctionalButton
                        iconName="link" altName={_('exportBundle')}
                        onClick={handleBundleExport} />
                    <FunctionalButton
                        iconName="info" altName={_('showChangelog')}
                        onClick={ModalState.setter.showChangelog} />
                    <FunctionalSelector
                        iconName="globe" defaultValue={stateLang}
                        options={langList} onChange={handleLangChange} />
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
