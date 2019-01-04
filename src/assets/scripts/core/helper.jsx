'use strict';
/**
 * Helper
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Config
import Config from 'config';

function log(...params) {
    if ('development' !== Config.env) {
        return;
    }

    console.log.apply(this, params);
}

function deepCopy(data) {
    return JSON.parse(JSON.stringify(data));
}

export default {
    log: log,
    deepCopy: deepCopy,
};
