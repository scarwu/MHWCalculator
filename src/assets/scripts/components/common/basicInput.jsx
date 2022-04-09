/**
 * Basic Input
 *
 * @package     Monster Hunter World - Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (https://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

import React, { useMemo } from 'react'

// Load Core
import Helper from 'core/helper'

export default function BasicInput(props) {
    const {defaultValue, placeholder, onChange, bypassRef} = props

    return useMemo(() => {
        Helper.debug('Component: Common -> BasicInput')

        return (
            <div className="mhwc-basic_input">
                <input className="mhwc-input" type="text" ref={bypassRef}
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    onBlur={onChange}
                    onKeyPress={(event) => {
                        if (13 === event.charCode) {
                            onChange(event)
                        }
                    }} />
            </div>
        )
    }, [defaultValue, placeholder, onChange, bypassRef])
}
