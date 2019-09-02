'use strict';
/**
 * Inventory Setting
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

// Load Components
import FunctionalIcon from 'components/common/functionalIcon';

// Load Constant
import Constant from 'constant';

// Load State Control
import CommonStates from 'states/common';
import ModalStates from 'states/modal';

export default class InventorySetting extends Component {

    // Default Props
    static defaultProps = {

    };

    constructor (props) {
        super(props);

        // Initial State
        this.state = {
            isShow: ModalStates.getters.isShowInventorySetting()
        };
    }

    /**
     * Handle Functions
     */
    handleFastWindowClose = (event) => {
        if (this.refs.modal !== event.target) {
            return;
        }

        this.handleWindowClose();
    };

    handleWindowClose = () => {
        ModalStates.setters.hideInventorySetting();
    };

    handleSegmentInput = () => {
        let segment = this.refs.segment.value;

        segment = (0 !== segment.length)
            ? segment.replace(/([.?*+^$[\]\\(){}|-])/g, '').trim() : null;

        this.setState({
            segment: segment
        });
    };

    /**
     * Render Functions
     */
    componentDidMount () {
        this.unsubscribe = ModalStates.store.subscribe(() => {
            this.setState({
                isShow: ModalStates.getters.isShowInventorySetting()
            });
        });
    }

    componentWillUnmount(){
        this.unsubscribe();
    }

    render () {
        return this.state.isShow ? (
            <div className="mhwc-selector" ref="modal" onClick={this.handleFastWindowClose}>
                <div className="mhwc-modal">
                    <div className="mhwc-panel">
                        <input className="mhwc-text_segment" type="text"
                            placeholder={_('inputKeyword')}
                            ref="segment" onChange={this.handleSegmentInput} />

                        <div className="mhwc-icons_bundle">
                            <FunctionalIcon
                                iconName="times" altName={_('close')}
                                onClick={this.handleWindowClose} />
                        </div>
                    </div>
                    <div className="mhwc-list">

                    </div>
                </div>
            </div>
        ) : false;
    }
}
