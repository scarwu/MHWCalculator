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
import React, { Component } from 'react';
import { Link } from 'react-router-dom';

// Load Core Libraries
import Status from 'core/status';
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';
import JewelDataset from 'libraries/dataset/jewel';
import CommonDataset from 'libraries/dataset/common';

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

// Load Json
import TestData from 'files/json/testData.json';

export default class Main extends Component {

    // Default Props
    static defaultProps = {
        hash: null
    };

    constructor (props) {
        super(props);

        // Initial State
        this.state = {
            isImportEquips: false,
            lang: Status.get('sys:lang'),
            ignoreEquips: Status.get('app:ignoreEquips') || {}
        };

        // Set Build Time
        Status.set('sys:buildTime', Config.buildTime);
    }

    /**
     * Handle Functions
     */
    handleBundleExport = () => {
        let equips = Helper.deepCopy(CommonStates.getters.getCurrentEquips());
        let hash = Helper.base64Encode(JSON.stringify(equips));

        let protocol = window.location.protocol;
        let hostname = window.location.hostname;
        let pathname = window.location.pathname;

        window.open(`${protocol}//${hostname}${pathname}#/${hash}`, '_blank');
    };

    handleLangChange = () => {
        let lang = this.refs.lang.value;

        // Se Data to Status
        Status.set('sys:lang', lang);

        this.setState({
            lang: lang
        });
    };

    /**
     * Lifecycle Functions
     */
    static getDerivedStateFromProps (nextProps, prevState) {
        let hash = nextProps.match.params.hash;

        if (Helper.isEmpty(hash) || true === prevState.isImportEquips) {
            return null;
        }

        CommonStates.setters.replaceCurrentEquips(JSON.parse(Helper.base64Decode(hash)));

        return {
            isImportEquips: true
        };
    }

    /**
     * Render Functions
     */
    render () {
        return (
            <div key={this.state.lang} id="mhwc-app" className="container-fluid">
                <div className="row mhwc-header">
                    <a className="mhwc-title" href="./">
                        <h1>{_('title')}</h1>
                    </a>

                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName="link" altName={_('exportBundle')}
                            onClick={this.handleBundleExport} />
                        <FunctionalIcon
                            iconName="info" altName={_('showChangelog')}
                            onClick={ModalStates.setters.showChangelog} />
                        <div className="mhwc-lang">
                            <div>
                                <i className="fa fa-globe"></i>
                                <select defaultValue={this.state.lang} ref="lang" onChange={this.handleLangChange}>
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
}
