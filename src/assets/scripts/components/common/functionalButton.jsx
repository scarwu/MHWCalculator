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
import React, { useMemo } from 'react';

// Load Core Libraries
import Helper from 'core/helper';

export default function FunctionalButton(props) {
    const {iconName, altName, onClick} = props;

    return useMemo(() => {
        Helper.log('Component: FunctionalButton');

        return (
            <div className="mhwc-functional_button">
                <a className="mhwc-body" onClick={onClick}>
                    <div className="mhwc-icon">
                        <i className={`fa fa-${iconName}`}></i>
                    </div>
                </a>

                <div className="mhwc-label">
                    <span>{altName}</span>
                </div>
            </div>
        )
    }, [iconName, altName]);
};
