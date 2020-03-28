/**
 * Status Libray
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

let prefix = 'mhwc:2020:0';
let storage = window.localStorage;

function get(key) {
    if (undefined === storage[`${prefix}:${key}`]) {
        return undefined;
    }

    let dataSet = JSON.parse(storage[`${prefix}:${key}`]);

    return dataSet;
}

function set(key, value) {
    let dataSet = (undefined !== storage[`${prefix}:${key}`])
        ? JSON.parse(storage[`${prefix}:${key}`]) : {};

    dataSet = value;

    storage[`${prefix}:${key}`] = JSON.stringify(dataSet);
}

function has(key) {
    if (undefined === storage[`${prefix}:${key}`]) {
        return undefined;
    }

    let dataSet = JSON.parse(storage[`${prefix}:${key}`]);

    return undefined !== dataSet;
}

export default {
    get: get,
    set: set,
    has: has
};
