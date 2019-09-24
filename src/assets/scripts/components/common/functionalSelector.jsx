/**
 * Functional Selector
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

export default function FunctionalSelector(props) {
    const {iconName, defaultValue, options, onChange} = props;

    return useMemo(() => {
        Helper.log('Component: Common -> FunctionalSelector');

        return (
            <div className="mhwc-functional_selector">
                <div className="mhwc-body">
                    <div className="mhwc-icon">
                        <i className={`fa fa-${iconName}`}></i>
                    </div>
                    <select className="mhwc-select" value={defaultValue} onChange={onChange}>
                        {options.map((option) => {
                            return (
                                <option key={option.key} value={option.key}>{option.value}</option>
                            );
                        })}
                    </select>
                </div>
            </div>
        );
    }, [iconName, defaultValue, options]);
};
