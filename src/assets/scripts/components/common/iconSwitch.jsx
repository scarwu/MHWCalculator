/**
 * Icon Switch
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

export default function IconSwitch(props) {
    const {defaultValue, options, onChange} = props;

    return useMemo(() => {
        Helper.debug('Component: Common -> IconSwitch');

        let currentIndex = null;

        options.forEach((option, optionIndex) => {
            if (defaultValue !== option.key) {
                return;
            }

            currentIndex = optionIndex;
        });

        const handlePrev = () => {
            if (Helper.isEmpty(options[currentIndex - 1])) {
                return;
            }

            onChange(options[currentIndex - 1].key);
        };

        const handleNext = () => {
            if (Helper.isEmpty(options[currentIndex + 1])) {
                return;
            }

            onChange(options[currentIndex + 1].key);
        };

        const handleChange = (event) => {
            onChange(event.target.value);
        };

        return (
            <div className="mhwc-icon_switch">
                <div className="mhwc-body">
                    <a className="mhwc-icon" onClick={handlePrev}>
                        <i className="fa fa-chevron-left"></i>
                    </a>
                    <select className="mhwc-select" value={defaultValue} onChange={handleChange}>
                        {options.map((option) => {
                            return (
                                <option key={option.key} value={option.key}>{option.value}</option>
                            );
                        })}
                    </select>
                    <a className="mhwc-icon" onClick={handleNext}>
                        <i className="fa fa-chevron-right"></i>
                    </a>
                </div>
            </div>
        );
    }, [defaultValue, options, onChange]);
};
