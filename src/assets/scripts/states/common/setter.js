/**
 * Common State - Setter
 *
 * @package     Monster Hunter World - Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (https://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

import store from './store'

// Switch Temp Data
export const switchTempData = (target, index) => {
    store.dispatch({
        type: 'SWITCH_TEMP_DATA',
        payload: {
            target: target,
            index: index
        }
    })
}

// Required Sets
export const addRequiredSet = (setId) => {
    store.dispatch({
        type: 'ADD_REQUIRED_SET',
        payload: {
            setId: setId
        }
    })
}

export const removeRequiredSet = (setId) => {
    store.dispatch({
        type: 'REMOVE_REQUIRED_SET',
        payload: {
            setId: setId
        }
    })
}

export const increaseRequiredSetStep = (setId) => {
    store.dispatch({
        type: 'INCREASE_REQUIRED_SET_STEP',
        payload: {
            setId: setId
        }
    })
}

export const decreaseRequiredSetStep = (setId) => {
    store.dispatch({
        type: 'DECREASE_REQUIRED_SET_STEP',
        payload: {
            setId: setId
        }
    })
}

export const cleanRequiredSets = () => {
    store.dispatch({
        type: 'CLEAN_REQUIRED_SETS'
    })
}

// Required Skills
export const addRequiredSkill = (skillId) => {
    store.dispatch({
        type: 'ADD_REQUIRED_SKILL',
        payload: {
            skillId: skillId
        }
    })
}

export const removeRequiredSkill = (skillId) => {
    store.dispatch({
        type: 'REMOVE_REQUIRED_SKILL',
        payload: {
            skillId: skillId
        }
    })
}

export const increaseRequiredSkillLevel = (skillId) => {
    store.dispatch({
        type: 'INCREASE_REQUIRED_SKILL_LEVEL',
        payload: {
            skillId: skillId
        }
    })
}

export const decreaseRequiredSkillLevel = (skillId) => {
    store.dispatch({
        type: 'DECREASE_REQUIRED_SKILL_LEVEL',
        payload: {
            skillId: skillId
        }
    })
}

export const cleanRequiredSkills = () => {
    store.dispatch({
        type: 'CLEAN_REQUIRED_SKILLS'
    })
}

// Required Equips
export const setRequiredEquips = (equipType, currentEquip) => {
    store.dispatch({
        type: 'SET_REQUIRED_EQUIPS',
        payload: {
            equipType: equipType,
            currentEquip: currentEquip
        }
    })
}

export const cleanRequiredEquips = () => {
    store.dispatch({
        type: 'CLEAN_REQUIRED_EQUIPS'
    })
}

// CurrentEquips
export const setCurrentEquip = (data) => {
    store.dispatch({
        type: 'SET_CURRENT_EQUIP',
        payload: {
            data: data
        }
    })
}

export const replaceCurrentEquips = (data) => {
    store.dispatch({
        type: 'REPLACE_CURRENT_EQUIPS',
        payload: {
            data: data
        }
    })
}

export const cleanCurrentEquips = () => {
    store.dispatch({
        type: 'CLEAN_CURRENT_EQUIPS'
    })
}

// Algorithm Params
export const setAlgorithmParamsLimit = (limit) => {
    store.dispatch({
        type: 'SET_ALGORITHM_PARAMS_LIMIT',
        payload: {
            limit: limit
        }
    })
}

export const setAlgorithmParamsSort = (sort) => {
    store.dispatch({
        type: 'SET_ALGORITHM_PARAMS_SORT',
        payload: {
            sort: sort
        }
    })
}

export const setAlgorithmParamsOrder = (order) => {
    store.dispatch({
        type: 'SET_ALGORITHM_PARAMS_ORDER',
        payload: {
            order: order
        }
    })
}

export const toggleAlgorithmParamsFlag = (target) => {
    store.dispatch({
        type: 'TOGGLE_ALGORITHM_PARAMS_FLAG',
        payload: {
            target: target
        }
    })
}

export const setAlgorithmParamsUsingFactor = (target, flag, value) => {
    store.dispatch({
        type: 'SET_ALGORITHM_PARAMS_USING_FACTOR',
        payload: {
            target: target,
            flag: flag,
            value: value
        }
    })
}

// Computed Result
export const saveComputedResult = (data) => {
    store.dispatch({
        type: 'UPDATE_COMPUTED_RESULT',
        payload: {
            data: data
        }
    })
}

export const cleanComputedResult = () => {
    store.dispatch({
        type: 'UPDATE_COMPUTED_RESULT',
        payload: {
            data: null
        }
    })
}

// Reserved Bundles
export const addReservedBundle = (data) => {
    store.dispatch({
        type: 'ADD_RESERVED_BUNDLE',
        payload: {
            data: data
        }
    })
}

export const updateReservedBundleName = (index, name) => {
    store.dispatch({
        type: 'UPDATE_RESERVED_BUNDLE_NAME',
        payload: {
            index: index,
            name: name
        }
    })
}

export const removeReservedBundle = (index) => {
    store.dispatch({
        type: 'REMOVE_RESERVED_BUNDLE',
        payload: {
            index: index
        }
    })
}

// Custom Weapon
export const replaceCustomWeapon = (data) => {
    store.dispatch({
        type: 'REPLACE_CUSTOM_WEAPON',
        payload: {
            data: data
        }
    })
}

export const setCustomWeaponValue = (target, value) => {
    store.dispatch({
        type: 'SET_CUSTOM_WEAPON_VALUE',
        payload: {
            target: target,
            value: value
        }
    })
}

export const setCustomWeaponElderseal = (affinity) => {
    store.dispatch({
        type: 'SET_CUSTOM_WEAPON_ELDERSEAL',
        payload: {
            affinity: affinity
        }
    })
}

export const setCustomWeaponSharpness = (step) => {
    store.dispatch({
        type: 'SET_CUSTOM_WEAPON_SHARPNESS',
        payload: {
            step: step
        }
    })
}

export const setCustomWeaponElementType = (target, type) => {
    store.dispatch({
        type: 'SET_CUSTOM_WEAPON_ELEMENT_TYPE',
        payload: {
            target: target,
            type: type
        }
    })
}

export const setCustomWeaponElementValue = (target, value) => {
    store.dispatch({
        type: 'SET_CUSTOM_WEAPON_ELEMENT_VALUE',
        payload: {
            target: target,
            value: value
        }
    })
}

export const setCustomWeaponSlot = (index, size) => {
    store.dispatch({
        type: 'SET_CUSTOM_WEAPON_SLOT',
        payload: {
            index: index,
            size: size
        }
    })
}

export const setCustomWeaponSkill = (index, id) => {
    store.dispatch({
        type: 'SET_CUSTOM_WEAPON_SKILL',
        payload: {
            index: index,
            id: id
        }
    })
}

export const setCustomWeaponSet = (id) => {
    store.dispatch({
        type: 'SET_CUSTOM_WEAPON_SET',
        payload: {
            id: id
        }
    })
}

export default {
    switchTempData,
    addRequiredSet,
    removeRequiredSet,
    increaseRequiredSetStep,
    decreaseRequiredSetStep,
    cleanRequiredSets,
    addRequiredSkill,
    removeRequiredSkill,
    increaseRequiredSkillLevel,
    decreaseRequiredSkillLevel,
    cleanRequiredSkills,
    setRequiredEquips,
    cleanRequiredEquips,
    setCurrentEquip,
    replaceCurrentEquips,
    cleanCurrentEquips,
    setAlgorithmParamsLimit,
    setAlgorithmParamsSort,
    setAlgorithmParamsOrder,
    toggleAlgorithmParamsFlag,
    setAlgorithmParamsUsingFactor,
    saveComputedResult,
    cleanComputedResult,
    addReservedBundle,
    updateReservedBundleName,
    removeReservedBundle,
    replaceCustomWeapon,
    setCustomWeaponValue,
    setCustomWeaponElderseal,
    setCustomWeaponSharpness,
    setCustomWeaponElementType,
    setCustomWeaponElementValue,
    setCustomWeaponSlot,
    setCustomWeaponSkill,
    setCustomWeaponSet
}
