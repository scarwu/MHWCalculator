/**
 * Icon Tab
 *
 * @package     Monster Hunter World - Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (https://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

import React, { useMemo } from 'react'

// Load Core
import Helper from 'core/helper'

export default function IconTab(props) {
    const {iconName, altName, isActive, onClick} = props

    return useMemo(() => {
        Helper.debug('Component: Common -> IconTab')

        let className = [
            'mhwc-body'
        ]

        if (isActive) {
            className.push('is-active')
        }

        return (
            <div className="mhwc-icon_tab">
                <a className={className.join(' ')} onClick={onClick}>
                    <div className="mhwc-icon">
                        <i className={`fa fa-${iconName}`}></i>
                    </div>
                </a>

                <div className="mhwc-label">
                    <span>{altName}</span>
                </div>
            </div>
        )
    }, [iconName, altName, isActive, onClick])
}
