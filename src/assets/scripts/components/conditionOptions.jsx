'use strict';
/**
 * Condition Options
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React, { Component } from 'react';

// Load Core Libraries
import Helper from 'core/helper';

// Load Custom Libraries
import _ from 'libraries/lang';
import SetDataset from 'libraries/dataset/set';
import SkillDataset from 'libraries/dataset/skill';

// Load Components
import FunctionalIcon from 'components/common/functionalIcon';

// Load State Control
import CommonStates from 'states/common';
import ModalStates from 'states/modal';

export default class EquipsDisplayer extends Component {

    constructor (props) {
        super(props);

        // Initial State
        this.state = {
            requiredSets: CommonStates.getters.getRequiredSets(),
            requiredSkills: CommonStates.getters.getRequiredSkills(),
        };
    }

    /**
     * Handle Functions
     */
    handleRequireConditionRefresh = () => {
        CommonStates.setters.cleanRequiredSets();
        CommonStates.setters.cleanRequiredSkills();
    };

    /**
     * Lifecycle Functions
     */
    componentDidMount () {
        this.unsubscribe = CommonStates.store.subscribe(() => {
            this.setState({
                requiredSets: CommonStates.getters.getRequiredSets(),
                requiredSkills: CommonStates.getters.getRequiredSkills()
            });
        });
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    /**
     * Render Functions
     */
    renderSelectedSetItems = () => {
        return this.state.requiredSets.map((data, index) => {
            let setInfo = SetDataset.getInfo(data.id);

            if (Helper.isEmpty(setInfo)) {
                return false;
            }

            let setRequire = setInfo.skills[data.step - 1].require;

            return (
                <div key={setInfo.id} className="row mhwc-item">
                    <div className="col-12 mhwc-name">
                        <span>
                            {_(setInfo.name)} x {setRequire}
                        </span>

                        <div className="mhwc-icons_bundle">
                            <FunctionalIcon
                                iconName="minus-circle" altName={_('down')}
                                onClick={() => {CommonStates.setters.decreaseRequiredSetStep(index)}} />
                            <FunctionalIcon
                                iconName="plus-circle" altName={_('up')}
                                onClick={() => {CommonStates.setters.increaseRequiredSetStep(index)}} />
                            <FunctionalIcon
                                iconName="times" altName={_('clean')}
                                onClick={() => {CommonStates.setters.removeRequiredSetByIndex(index)}} />
                        </div>
                    </div>
                    <div className="col-12 mhwc-value">
                        {setInfo.skills.map((skill) => {
                            if (setRequire < skill.require) {
                                return false;
                            }

                            let skillInfo = SkillDataset.getInfo(skill.id);

                            return (Helper.isNotEmpty(skillInfo)) ? (
                                <div key={skill.id}>
                                    <span>({skill.require}) {_(skillInfo.name)}</span>
                                </div>
                            ) : false;
                        })}
                    </div>
                </div>
            );
        });
    };

    renderSelectedSkillItems = () => {
        return this.state.requiredSkills.map((data, index) => {
            let skillInfo = SkillDataset.getInfo(data.id);

            return (Helper.isNotEmpty(skillInfo)) ? (
                <div key={skillInfo.id} className="row mhwc-item">
                    <div className="col-12 mhwc-name">
                        <span>
                            {_(skillInfo.name)} Lv.{data.level} / {skillInfo.list.length}
                        </span>

                        <div className="mhwc-icons_bundle">
                            <FunctionalIcon
                                iconName="minus-circle" altName={_('down')}
                                onClick={() => {CommonStates.setters.decreaseRequiredSkillLevel(index)}} />
                            <FunctionalIcon
                                iconName="plus-circle" altName={_('up')}
                                onClick={() => {CommonStates.setters.increaseRequiredSkillLevel(index)}} />
                            <FunctionalIcon
                                iconName="times" altName={_('clean')}
                                onClick={() => {CommonStates.setters.removeRequiredSkillByIndex(index)}} />
                        </div>
                    </div>
                    <div className="col-12 mhwc-value">
                        <span>
                            {(0 !== data.level)
                                ? _(skillInfo.list[data.level - 1].description)
                                : _('skillLevelZero')}
                        </span>
                    </div>
                </div>
            ) : false;
        });
    };

    render () {
        return (
            <div className="col mhwc-conditions">
                <div className="mhwc-section_name">
                    <span className="mhwc-title">{_('requireCondition')}</span>

                    <div className="mhwc-icons_bundle">
                        <FunctionalIcon
                            iconName="refresh" altName={_('reset')}
                            onClick={this.handleRequireConditionRefresh} />
                        <FunctionalIcon
                            iconName="plus" altName={_('skill')}
                            onClick={ModalStates.setters.showSkillItemSelector} />
                        <FunctionalIcon
                            iconName="plus" altName={_('set')}
                            onClick={ModalStates.setters.showSetItemSelector} />
                    </div>
                </div>

                <div className="mhwc-list">
                    {this.renderSelectedSetItems()}
                    {this.renderSelectedSkillItems()}
                </div>
            </div>
        );
    }
}
