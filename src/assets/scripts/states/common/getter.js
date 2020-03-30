/**
 * Common State - Getter
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

import Store from './store';

export default {
    getTempData: () => {
        return Store.getState().tempData;
    },
    getRequiredSets: () => {
        return Store.getState().requiredSets;
    },
    getRequiredSkills: () => {
        return Store.getState().requiredSkills;
    },
    getRequiredEquipPins: () => {
        return Store.getState().requiredEquipPins;
    },
    getCurrentEquips: () => {
        return Store.getState().currentEquips;
    },
    getAlgorithmParams: () => {
        return Store.getState().algorithmParams;
    },
    getComputedResult: () => {
        return Store.getState().computedResult;
    },
    getReservedBundles: () => {
        return Store.getState().reservedBundles;
    },
    getCustomWeapon: () => {
        return Store.getState().customWeapon;
    }
};
