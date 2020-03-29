/**
 * Basic Input
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

export default function BasicInput(props) {
    const {defaultValue, placeholder, onChange} = props;

    return useMemo(() => {
        Helper.log('Component: Common -> BasicInput');

        return (
            <div className="mhwc-basic_input">
                <input className="mhwc-input" type="text"
                    defaultValue={defaultValue}
                    placeholder={placeholder}
                    onChange={onChange} />
            </div>
        );
    }, [defaultValue, placeholder]);
};
