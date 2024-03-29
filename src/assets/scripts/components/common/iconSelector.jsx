/**
 * Icon Selector
 *
 * @package     Monster Hunter World - Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (https://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

import React, { useMemo } from 'react'

// Load Core
import Helper from 'core/helper'

export default function IconSelector(props) {
    const {iconName, defaultValue, options, onChange} = props

    return useMemo(() => {
        Helper.debug('Component: Common -> IconSelector')

        return (
            <div className="mhwc-icon_selector">
                <div className="mhwc-body">
                    <div className="mhwc-icon">
                        <i className={`fa fa-${iconName}`}></i>
                    </div>
                    <select className="mhwc-select" value={defaultValue} onChange={onChange}>
                        {options.map((option) => {
                            return (
                                <option key={option.key} value={option.key}>{option.value}</option>
                            )
                        })}
                    </select>
                </div>
            </div>
        )
    }, [iconName, defaultValue, options, onChange])
}
