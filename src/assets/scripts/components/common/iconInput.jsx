/**
 * Icon Input
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

export default function IconInput(props) {
    const {iconName, defaultValue, placeholder, onChange} = props;

    return useMemo(() => {
        Helper.log('Component: Common -> IconInput');

        return (
            <div className="mhwc-icon_input">
                <div className="mhwc-body">
                    <div className="mhwc-icon">
                        <i className={`fa fa-${iconName}`}></i>
                    </div>
                    <input className="mhwc-input" type="text"
                        defaultValue={defaultValue}
                        placeholder={placeholder}
                        onBlur={onChange}
                        onKeyPress={(event) => {
                            if (13 === event.charCode) {
                                onChange(event);
                            }
                        }} />
                </div>
            </div>
        );
    }, [iconName, defaultValue, placeholder]);
};
