'use strict';

/**
 * Misc
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.simcz.tw/)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import React from 'react';

function numberWithCommas (number) {
    let blocks = [];
    let chars = number.toString();
    let anchor = chars.length % 3;

    if (3 >= chars.length) {
        return number;
    }

    for (let x in chars) {
        if (anchor === x % 3
             && 0 !== blocks.length) {

            blocks.push(
                <span key={x + 'comma'}>,</span>
            );
        }

        blocks.push(
            <span key={x}>
                {chars[x]}
            </span>
        );
    }

    return blocks;
};

module.exports = {
    numberWithCommas: numberWithCommas
};
