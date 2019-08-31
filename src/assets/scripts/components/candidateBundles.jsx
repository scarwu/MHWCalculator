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
import Status from 'core/status';
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';
import WeaponDataset from 'libraries/dataset/weapon';
import ArmorDataset from 'libraries/dataset/armor';
import CharmDataset from 'libraries/dataset/charm';
import JewelDataset from 'libraries/dataset/jewel';
import SkillDataset from 'libraries/dataset/skill';
import FittingAlgorithm from 'libraries/fittingAlgorithm';

// Load Components
import FunctionalIcon from 'components/common/functionalIcon';

// Load Constant
import Constant from 'constant';

export default class CandidateBundles extends Component {

    // Default Props
    static defaultProps = {
        onPickUp: (data) => {}
    };

    constructor (props) {
        super(props);

        // Initial State
        this.state = {
            bundleList: Status.get('candidateBundles:bundleList') || [],
            bundleLimit: 25,
            searchTime: Status.get('candidateBundles:searchTime') || null,
            isSearching: false
        };
    }

    /**
     * Handle Functions
     */
    handleBundlePickUp = (index) => {
        let bundleList = this.state.bundleList;

        this.props.onPickUp(bundleList[index]);
    };

    handleLimitChange = () => {
        let bundleLimit = parseInt(this.refs.bundleLimit.value, 10);
        bundleLimit = !isNaN(bundleLimit) ? bundleLimit : 0;

        this.setState({
            bundleLimit: bundleLimit
        });
    };

    /**
     * Lifecycle Functions
     */
    componentDidMount () {
        Event.on('SearchCandidateEquips', 'CandidateBundles', (data) => {
            this.setState({
                isSearching: true
            });

            setTimeout(() => {
                let startTime = new Date().getTime();
                let bundleList = FittingAlgorithm.search(data.equips, data.ignoreEquips, data.sets, data.skills);
                let stopTime = new Date().getTime();

                let searchTime = (stopTime - startTime) / 1000;

                Helper.log('Bundle List:', bundleList);
                Helper.log('Search Time:', searchTime);

                // Set Data to Status
                Status.set('candidateBundles:bundleList', bundleList);
                Status.set('candidateBundles:searchTime', searchTime);

                this.setState({
                    bundleList: bundleList,
                    searchTime: searchTime,
                    isSearching: false
                });
            }, 100);
        });
    }

    componentWillUnmount () {
        Event.off('SearchCandidateEquips', 'CandidateBundles');
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
                        <span>{_('bundle')}: {index + 1}</span>
                        <div className="mhwc-icons_bundle">
                            <FunctionalIcon
                                iconName="check" altName={_('equip')}
                                onClick={() => {this.handleBundlePickUp(index)}} />
                        </div>
                    </div>

                    <div className="col-12 mhwc-item mhwc-equips">
                        <div className="col-12 mhwc-name">
                            <span>{_('equip')}</span>
                        </div>
                        <div className="col-12 mhwc-value">
                            <div className="row">
                            {Object.keys(data.equips).map((equipType, index) => {
                                if (Helper.isEmpty(data.equips[equipType])) {
                                    return false;
                                }

                                let equipInfo = null;

                                if ('weapon' === equipType) {
                                    equipInfo = WeaponDataset.getInfo(data.equips[equipType]);
                                } else if ('helm' === equipType
                                    || 'chest' === equipType
                                    || 'arm' === equipType
                                    || 'waist' === equipType
                                    || 'leg' === equipType
                                ) {
                                    equipInfo = ArmorDataset.getInfo(data.equips[equipType]);
                                } else if ('charm' === equipType) {
                                    equipInfo = CharmDataset.getInfo(data.equips[equipType]);
                                }

                                return (Helper.isNotEmpty(equipInfo) )? [(
                                    <div key={`${equipType}_1`} className="col-2">
                                        <div className="mhwc-name">
                                            <span>{_(equipType)}</span>
                                        </div>
                                    </div>
                                ), (
                                    <div key={`${equipType}_2`} className="col-4">
                                        <div className="mhwc-value">
                                            <span>{_(equipInfo.name)}</span>
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
                                <span>{_('defense')}</span>
                            </div>
                            <div className="col-8 mhwc-value">
                                <span>{data.defense}</span>
                            </div>
                        </div>
                    </div>

                    {(0 < data.meta.remainingSlotCount.all) ? (
                        <div className="col-12 mhwc-item mhwc-slots">
                            <div className="col-12 mhwc-name">
                                <span>{_('remainingSlot')}</span>
                            </div>
                            <div className="col-12 mhwc-value">
                                <div className="row">
                                    {Object.keys(data.meta.remainingSlotCount).map((slotSize) => {
                                        if ('all' === slotSize) {
                                            return;
                                        }

                                        let slotCount = data.meta.remainingSlotCount[slotSize];

                                        return (slotCount > 0) ? (
                                            <div key={slotSize} className="col-4">
                                                <div className="mhwc-value">
                                                    <span>{`[${slotSize}] x ${slotCount}`}</span>
                                                </div>
                                            </div>
                                        ) : false;
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : false}

                    {(0 !== Object.keys(data.jewels).length) ? (
                        <div className="col-12 mhwc-item mhwc-jewels">
                            <div className="col-12 mhwc-name">
                                <span>{_('jewel')}</span>
                            </div>
                            <div className="col-12 mhwc-value">
                                <div className="row">
                                    {Object.keys(data.jewels).sort((jewelIdA, jewelIdB) => {
                                        return data.jewels[jewelIdB] - data.jewels[jewelIdA];
                                    }).map((jewelId) => {
                                        let jewelCount = data.jewels[jewelId];
                                        let jewelInfo = JewelDataset.getInfo(jewelId);

                                        return (Helper.isNotEmpty(jewelInfo)) ? (
                                            <div key={jewelId} className="col-4">
                                                <div className="mhwc-value">
                                                    <span>{`[${jewelInfo.size}] ${_(jewelInfo.name)} x ${jewelCount}`}</span>
                                                </div>
                                            </div>
                                        ) : false;
                                    })}
                                </div>
                            </div>
                        </div>
                    ) : false}

                    {(0 !== Object.keys(data.skills).length) ? (
                        <div className="col-12 mhwc-item mhwc-skills">
                            <div className="col-12 mhwc-name">
                                <span>{_('skill')}</span>
                            </div>
                            <div className="col-12 mhwc-value">
                                <div className="row">
                                    {Object.keys(data.skills).sort((skillIdA, skillIdB) => {
                                        return data.skills[skillIdB] - data.skills[skillIdA];
                                    }).map((skillId) => {
                                        let skillCount = data.skills[skillId];
                                        let skillInfo = SkillDataset.getInfo(skillId);;

                                        return (Helper.isNotEmpty(skillInfo)) ? (
                                            <div key={skillId} className="col-6">
                                                <div className="mhwc-value">
                                                    <span>{`${_(skillInfo.name)} Lv.${skillCount}`}</span>
                                                </div>
                                            </div>
                                        ) : false;
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
        return [(
            <div key="bar" className="row mhwc-panel">
                {true === this.state.isSearching ? (
                    <div className="mhwc-mask">
                        <i className="fa fa-spin fa-cog"></i>
                    </div>
                ) : false}

                {(Helper.isNotEmpty(this.state.searchTime)) ? (
                    <div className="row mhwc-search_info">
                        <div className="col-12">
                            <span>
                                {_('searchResult1').replace('%s', this.state.searchTime)}
                                <input type="text" defaultValue={this.state.bundleLimit} ref="bundleLimit" onChange={this.handleLimitChange} />
                                {_('searchResult2').replace('%s', this.state.bundleList.length)}
                            </span>
                        </div>
                    </div>
                ) : false}
            </div>
        ), (
            <div key="list" className="mhwc-list">
                {this.renderBundleItems()}
            </div>
        )];
    }
}
