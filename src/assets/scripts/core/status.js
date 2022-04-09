/**
 * Status Libray
 *
 * @package     Monster Hunter World - Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (https://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

let prefix = 'mhwc:2020:8'
let storage = window.localStorage

export const get = (key) => {
    if (undefined === storage[`${prefix}:${key}`]) {
        return undefined
    }

    let dataSet = JSON.parse(storage[`${prefix}:${key}`])

    return dataSet
}

export const set = (key, value) => {
    let dataSet = (undefined !== storage[`${prefix}:${key}`])
        ? JSON.parse(storage[`${prefix}:${key}`]) : {}

    dataSet = value

    storage[`${prefix}:${key}`] = JSON.stringify(dataSet)
}

export const has = (key) => {
    if (undefined === storage[`${prefix}:${key}`]) {
        return undefined
    }

    let dataSet = JSON.parse(storage[`${prefix}:${key}`])

    return undefined !== dataSet
}

export default {
    get,
    set,
    has
}
