/**
 * Functional Tab
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

export default function FunctionalTab(props) {
    const {iconName, isActive, onClick} = props;

    return useMemo(() => {
        Helper.log('Component: Common -> FunctionalTab');

        return (
            <div className="mhwc-functional_tab">
                <a className="mhwc-body" onClick={onClick}>
                    <div className="mhwc-icon">
                        <i className={`fa fa-${iconName}`}></i>
                    </div>
                </a>
            </div>
        )
    }, [iconName, isActive]);
};
