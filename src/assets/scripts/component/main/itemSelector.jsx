'use strict';
/**
 * Item Selector
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
import DataSet from 'library/dataset';

// Load Constant & Lang
import Constant from 'constant';
import Lang from 'lang';

export default class ItemSelector extends Component {

    // Default Props
    static defaultProps = {
        data: {},
        onPickup: (data) => {},
        onClose: () => {}
    };

    // Initial State
    state = {
        data: {}
    };

    /**
     * Handle Functions
     */
    handleWindowClose = () => {
        this.props.onClose();
    };

    handleItemPickup = () => {
        this.props.onPickup({});
        this.props.onClose();
    };

    /**
     * Lifecycle Functions
     */
    componentWillMount () {
        this.setState({
            data: this.props.data
        });
    }

    componentWillReceiveProps (nextProps) {
        this.setState({
            data: this.props.data
        });
    }

    /**
     * Render Functions
     */
    render () {
        return (
            <div className="mhwc-selector">

            </div>
        );
    }
}
