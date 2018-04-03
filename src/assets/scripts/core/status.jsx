'use strict';

/**
 * Status Libray
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.simcz.tw/)
 * @link        https://github.com/scarwu/MHWCalculator
 */

var prefix = 'mhwcStatus';
var storage = window.localStorage;

function get (key) {
    if (undefined === storage[prefix]) {
        return undefined;
    }

    let dataSet = JSON.parse(storage[prefix]);

    return dataSet[key];
}

function set (key, value) {
    let dataSet = (undefined !== storage[prefix])
        ? JSON.parse(storage[prefix]) : {};

    dataSet[key] = value;

    storage[prefix] = JSON.stringify(dataSet);
}

function has (key) {
    if (undefined === storage[prefix]) {
        return undefined;
    }

    let dataSet = JSON.parse(storage[prefix]);

    return undefined !== dataSet[key];
}

module.exports = {
    get: get,
    set: set,
    has: has
};
