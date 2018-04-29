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
        bundleLimit: 25
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

            let startTime = new Date().getTime();
            let bundleList = FA.search(data.equips, data.sets, data.skills);
            let stopTime = new Date().getTime();

            console.log('Time Cheker: ', (stopTime - startTime) / 1000);
            console.log(bundleList);

            this.setState({
                bundleList: bundleList
            });
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
                <div key={index} className="row mhwc-item">
                    <div className="col-12 mhwc-name">
                        <span>備選 {index + 1}</span>

                        <div className="mhwc-icons_bundle">
                            <a className="mhwc-icon" onClick={() => {this.handleBundlePickup(index)}}>
                                <i className="fa fa-check"></i>
                            </a>
                        </div>
                    </div>
                    <div className="col-12 mhwc-value">
                        <div className="row">
                            <div className="col-4 mhwc-name">
                                <span>裝備</span>
                            </div>
                            <div className="col-8 mhwc-value">
                                <span>{
                                    Object.values(data.equips).filter((equipName) => {
                                        return (null !== equipName);
                                    }).map((equipName) => {
                                        return equipName;
                                    }).join(', ')
                                }</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4 mhwc-name">
                                <span>裝飾珠</span>
                            </div>
                            <div className="col-8 mhwc-value">
                                <span>{
                                    Object.keys(data.jewels).map((jewelName) => {
                                        let jewelCount = data.jewels[jewelName];

                                        return `${jewelName} x ${jewelCount}`;
                                    }).join(', ')
                                }</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4 mhwc-name">
                                <span>防禦力</span>
                            </div>
                            <div className="col-8 mhwc-value">
                                <span>{data.defense}</span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-4 mhwc-name">
                                <span>技能</span>
                            </div>
                            <div className="col-8 mhwc-value">
                                <span>{
                                    Object.keys(data.skills).map((skillName) => {
                                        let skillCount = data.skills[skillName];

                                        return `${skillName} Lv.${skillCount}`;
                                    }).join(', ')
                                }</span>
                            </div>
                        </div>
                    </div>
                </div>
            );
        });
    };

    render () {
        return (
            <div className="mhwc-candidate_bundles">
                {this.renderBundleItems()}
            </div>
        );
    }
}
