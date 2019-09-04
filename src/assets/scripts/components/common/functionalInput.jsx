'use strict';
/**
 * Functional Input
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React from 'react';

export default function FunctionalInput(props) {
    return (
        <div className="mhwc-functional_input">
            <div className="mhwc-body">
                <div className="mhwc-icon">
                    <i className={`fa fa-${props.iconName}`}></i>
                </div>
                <input className="mhwc-input" type="text"
                    placeholder={props.placeholder}
                    onChange={props.onChange} />
            </div>
        </div>
    );
};
