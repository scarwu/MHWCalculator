'use strict';
/**
 * Functional Button
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React from 'react';

export default function FunctionalButton(props) {
    return (
        <div className="mhwc-functional_button">
            <a className="mhwc-body" onClick={props.onClick}>
                <div className="mhwc-icon">
                    <i className={`fa fa-${props.iconName}`}></i>
                </div>
            </a>

            <div className="mhwc-label">
                <span>{props.altName}</span>
            </div>
        </div>
    );
};
