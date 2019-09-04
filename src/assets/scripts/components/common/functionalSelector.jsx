'use strict';
/**
 * Functional Selector
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React from 'react';

export default function FunctionalSelector(props) {
    return (
        <div className="mhwc-functional_selector">
            <div>
                <i className={`fa fa-${props.iconName}`}></i>
                <select defaultValue={props.defaultValue} onChange={props.onChange}>
                    {Object.keys(props.options).map((key) => {
                        return (
                            <option key={key} value={key}>{props.options[key]}</option>
                        );
                    })}
                </select>
            </div>
        </div>
    );
};
