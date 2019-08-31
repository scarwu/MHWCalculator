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
import React from 'react';

export default function (props) {
    return (
        <div className="mhwc-sharpness_bar">
            <div className="mhwc-steps">
                {['red', 'orange', 'yellow', 'green', 'blue', 'white'].map((step) => {
                    return (
                        <div key={'sharpness_' + step} className="mhwc-step" style={{
                            width: (props.data.steps[step] / 4) + '%'
                        }}></div>
                    );
                })}
            </div>

            <div className="mhwc-mask" style={{
                width: ((400 - props.data.value) / 4) + '%'
            }}></div>
        </div>
    );
};
