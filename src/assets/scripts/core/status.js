/**
 * Status Libray
 *
 * @package     Monster Hunter World - Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (https://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Core
import Helper from 'core/helper'

let prefix = 'mhwc:2020:8'
let storage = window.localStorage

export const get = (key) => {
    if (Helper.isEmpty(storage[`${prefix}:${key}`])) {
        return null
    }

    let dataSet = storage[`${prefix}:${key}`]

    try {
        dataSet = JSON.parse(dataSet)
    } catch (error) {
        dataSet = null
    }

    return dataSet
}

export const set = (key, value) => {
    let dataSet = (Helper.isNotEmpty(storage[`${prefix}:${key}`]))
        ? storage[`${prefix}:${key}`] : null

    try {
        dataSet = JSON.parse(dataSet)
    } catch (error) {
        dataSet = null
    }

    if (Helper.isNotEmpty(value)) {
        dataSet = value
    }

    storage[`${prefix}:${key}`] = JSON.stringify(dataSet)
}

export const has = (key) => {
    if (Helper.isEmpty(storage[`${prefix}:${key}`])) {
        return null
    }

    let dataSet = storage[`${prefix}:${key}`]

    try {
        dataSet = JSON.parse(dataSet)
    } catch (error) {
        dataSet = null
    }

    return Helper.isNotEmpty(dataSet)
}

export default {
    get,
    set,
    has
}
