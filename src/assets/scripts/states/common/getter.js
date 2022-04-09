/**
 * Common State - Getter
 *
 * @package     Monster Hunter World - Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (https://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

import Store from './store'

export const getTempData = () => {
    return Store.getState().tempData
}

export const getRequiredSets = () => {
    return Store.getState().requiredSets
}

export const getRequiredSkills = () => {
    return Store.getState().requiredSkills
}

export const getRequiredEquips = () => {
    return Store.getState().requiredEquips
}

export const getCurrentEquips = () => {
    return Store.getState().currentEquips
}

export const getAlgorithmParams = () => {
    return Store.getState().algorithmParams
}

export const getComputedResult = () => {
    return Store.getState().computedResult
}

export const getReservedBundles = () => {
    return Store.getState().reservedBundles
}

export const getCustomWeapon = () => {
    return Store.getState().customWeapon
}

export default {
    getTempData,
    getRequiredSets,
    getRequiredSkills,
    getRequiredEquips,
    getCurrentEquips,
    getAlgorithmParams,
    getComputedResult,
    getReservedBundles,
    getCustomWeapon
}
