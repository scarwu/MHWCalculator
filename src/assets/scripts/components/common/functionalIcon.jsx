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
import React from 'react';

// Load Libraries
export default function (props) {
    return (
        <div className="mhwc-functional_icon">
            <a onClick={props.onClick}>
                <i className={`fa fa-${props.iconName}`}></i>
            </a>

            <div>
                <span>{props.altName}</span>
            </div>
        </div>
    );
};
