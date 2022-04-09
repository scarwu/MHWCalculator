/**
 * Basic Selector
 *
 * @package     Monster Hunter World - Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (https://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

import React, { useMemo } from 'react'

// Load Core
import Helper from 'core/helper'

export default function BasicSelector(props) {
    const {defaultValue, options, onChange} = props

    return useMemo(() => {
        Helper.debug('Component: Common -> BasicSelector')

        return (
            <div className="mhwc-basic_selector">
                <select className="mhwc-select" value={defaultValue} onChange={onChange}>
                    {options.map((option) => {
                        return (
                            <option key={option.key} value={option.key}>{option.value}</option>
                        )
                    })}
                </select>
            </div>
        )
    }, [defaultValue, options, onChange])
}
