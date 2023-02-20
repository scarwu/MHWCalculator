/**
 * Event Libray
 *
 * @package     Monster Hunter World - Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (https://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Core
import Helper from 'core/helper'

let eventList = {}

function on(name, key, callback) {
    if (Helper.isEmpty(eventList[name])) {
        eventList[name] = {}
    }

    eventList[name][key] = callback
}

function off(name, key) {
    if (Helper.isEmpty(eventList[name])) {
        return false
    }

    delete eventList[name][key]
}

function trigger(name, arg) {
    if (Helper.isEmpty(eventList[name])) {
        return false
    }

    for (let key in eventList[name]) {
        eventList[name][key](arg)
    }
}

export default {
    off,
    on,
    trigger
}
