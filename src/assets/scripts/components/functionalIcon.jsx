'use strict';
/**
 * Functional Icon
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React, { PureComponent } from 'react';

export default class FunctionalIcon extends PureComponent {

    // Default Props
    static defaultProps = {
        iconName: null,
        altName: null,
        onClick: () => {}
    };

    /**
     * Render Functions
     */
    render () {
        return (
            <div className="mhwc-functional_icon">
                <a onClick={this.props.onClick}>
                    <i className={`fa fa-${this.props.iconName}`}></i>
                </a>

                <div>
                    <span>{this.props.altName}</span>
                </div>
            </div>
        );
    }
}
