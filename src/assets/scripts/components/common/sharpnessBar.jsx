'use strict';
/**
 * Sharpness Bar
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

export default function SharpnessBar(props) {
    const {data} = props;

    return useMemo(() => {
        Helper.log('Component: Common -> SharpnessBar');

        return (
            <div className="mhwc-sharpness_bar">
                <div className="mhwc-steps">
                    {['red', 'orange', 'yellow', 'green', 'blue', 'white', 'purple'].map((step) => {
                        return (
                            <div key={step} className="mhwc-step" style={{
                                width: (data.steps[step] / 4) + '%'
                            }}></div>
                        );
                    })}
                </div>

                <div className="mhwc-mask" style={{
                    width: ((400 - data.value) / 4) + '%'
                }}></div>
            </div>
        );
    }, [data]);
};
