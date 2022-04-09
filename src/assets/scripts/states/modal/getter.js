/**
 * Modal State - Getter
 *
 * @package     Monster Hunter World - Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (https://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

import Store from './store';

export default {
    isShowChangelog: () => {
        return Store.getState().changelog.isShow;
    },
    isShowAlgorithmSetting: () => {
        return Store.getState().algorithmSetting.isShow;
    },
    getAlgorithmSettingBypassData: () => {
        return Store.getState().algorithmSetting.bypassData;
    },
    isShowBundleItemSelector: () => {
        return Store.getState().bundleItemSelector.isShow;
    },
    isShowConditionItemSelector: () => {
        return Store.getState().conditionItemSelector.isShow;
    },
    getConditionItemSelectorBypassData: () => {
        return Store.getState().conditionItemSelector.bypassData;
    },
    isShowEquipItemSelector: () => {
        return Store.getState().equipItemSelector.isShow;
    },
    getEquipItemSelectorBypassData: () => {
        return Store.getState().equipItemSelector.bypassData;
    }
};
