/**
 * Icon Button
 *
 * @package     Monster Hunter World - Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (https://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

import React, { useMemo } from 'react'

// Load Core
import Helper from 'core/helper'

export default function IconButton(props) {
    const {iconName, altName, onClick} = props

    return useMemo(() => {
        Helper.debug('Component: Common -> IconButton')

        return (
            <div className="mhwc-icon_button">
                <div className="mhwc-body">
                    <a className="mhwc-icon" onClick={onClick}>
                        <i className={`fa fa-${iconName}`}></i>
                    </a>
                </div>

                <div className="mhwc-label">
                    <span>{altName}</span>
                </div>
            </div>
        )
    }, [iconName, altName, onClick])
}
