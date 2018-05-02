'use strict';
/**
 * Candidate Bundles
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React, { Component } from 'react';

// Load Core Libraries
import Event from 'core/event';

// Load Custom Libraries
import Misc from 'library/misc';
import FittingAlgorithm from 'library/fittingAlgorithm';

// Load Constant & Lang
import Constant from 'constant';
import Lang from 'lang';

export default class CandidateBundles extends Component {

    // Default Props
    static defaultProps = {
        data: {},
        onPickup: (data) => {}
    };

    // Initial State
    state = {
        bundleList: [],
        bundleLimit: 25,
        searchTime: null,
        isSearching: false
    };

    /**
     * Handle Functions
     */
    handleBundlePickup = (index) => {
        let bundleList = this.state.bundleList;

        this.props.onPickup(bundleList[index]);
    };

    /**
     * Lifecycle Functions
     */
    componentDidMount () {
        let FA = new FittingAlgorithm();

        Event.on('SearchCandidateEquips', 'CandidateBundles', (data) => {
            this.setState({
                isSearching: true
            });

            setTimeout(() => {
                let startTime = new Date().getTime();
                let bundleList = FA.search(data.equips, data.sets, data.skills);
                let stopTime = new Date().getTime();

                let searchTime = (stopTime - startTime) / 1000;

                Misc.log('Bundle List:', bundleList);
                Misc.log('Search Time:', searchTime);

                this.setState({
                    bundleList: bundleList,
                    searchTime: searchTime,
                    isSearching: false
                });
            }, 100);
        });
    }

    /**
     * Render Functions
     */
    renderBundleItems = () => {
        let bundleList = this.state.bundleList;
        let bundleLimit = this.state.bundleLimit;

        return bundleList.slice(0, bundleLimit).map((data, index) => {
            return (
                <div key={index} className="row mhwc-bundle">
                    <div className="col-12 mhwc-name">
                        <span className="mhwc-bundle_name" >備選 {index + 1}</span>

                        <div className="mhwc-icons_bundle">
                            <a className="mhwc-icon" onClick={() => {this.handleBundlePickup(index)}}>
                                <i className="fa fa-check"></i>
                            </a>
                        </div>
                    </div>

                    <div className="col-12 mhwc-item mhwc-equips">
                        <div className="col-12 mhwc-name">
                            <span>裝備</span>
                        </div>
                        <div className="col-12 mhwc-value">
                            <div className="row">
                            {Object.keys(data.equips).map((euqipType) => {
                                return (null !== data.equips[euqipType]) ? [(
                                    <div key={'weapon_1'} className="col-2">
                                        <div className="mhwc-name">
                                            <span>{Lang[euqipType]}</span>
                                        </div>
                                    </div>
                                ), (
                                    <div key={'weapon_2'} className="col-4">
                                        <div className="mhwc-value">
                                            <span>{data.equips[euqipType]}</span>
                                        </div>
                                    </div>
                                )] : false;
                            })}
                            </div>
                        </div>
                    </div>

                    <div className="col-12 mhwc-item mhwc-defense">
                        <div className="row">
                            <div className="col-4 mhwc-name">
                                <span>防禦力</span>
                            </div>
                            <div className="col-8 mhwc-value">
                                <span>{data.defense}</span>
                            </div>
                        </div>
                    </div>

                    {(0 !== Object.keys(data.jewels).length) ? (
                        <div className="col-12 mhwc-item mhwc-jewels">
                            <div className="col-12 mhwc-name">
                                <span>裝飾珠</span>
                            </div>
                            <div className="col-12 mhwc-value">
                                <div className="row">
                                    {Object.keys(data.jewels).sort((a, b) => {
                                        return data.jewels[b] - data.jewels[a];
                                    }).map((jewelName) => {
                                        let jewelCount = data.jewels[jewelName];

                                        return (
                                            <div key={jewelName} className="col-4">
                                                <div className="mhwc-value">
                                                    <span>{`${jewelName} x ${jewelCount}`}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : false}

                    {(0 !== Object.keys(data.skills).length) ? (
                        <div className="col-12 mhwc-item mhwc-skills">
                            <div className="col-12 mhwc-name">
                                <span>技能</span>
                            </div>
                            <div className="col-12 mhwc-value">
                                <div className="row">
                                    {Object.keys(data.skills).sort((a, b) => {
                                        return data.skills[b] - data.skills[a];
                                    }).map((skillName) => {
                                        let skillCount = data.skills[skillName];;

                                        return (
                                            <div key={skillName} className="col-6">
                                                <div className="mhwc-value">
                                                    <span>{`${skillName} Lv.${skillCount}`}</span>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : false}
                </div>
            );
        });
    };

    render () {
        return (
            <div className="mhwc-candidate_bundles">
                {true === this.state.isSearching ? (
                    <div className="mhwc-mask">
                        <i className="fa fa-spin fa-cog"></i>
                    </div>
                ) : false}

                {(null !== this.state.searchTime) ? (
                    <div className="row mhwc-bundle">
                        <div className="col-12 mhwc-name">
                            <span className="mhwc-bundle_name" >
                                搜尋花費 {this.state.searchTime} 秒，並找出 {this.state.bundleList.length} 筆結果。
                            </span>
                        </div>
                    </div>
                ) : false}

                {this.renderBundleItems()}
            </div>
        );
    }
}
