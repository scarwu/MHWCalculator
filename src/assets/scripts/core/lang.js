/**
 * Lnaguage
 *
 * @package     Monster Hunter World - Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (https://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Constant
import Constant from 'constant'

// Load Core
import Status from 'core/status'
import Helper from 'core/helper'

// Load Langs
import zhTWUI from 'langs/zhTW/ui.json'
import zhTWDataset from 'langs/zhTW/dataset.json'
import jaJPUI from 'langs/jaJP/ui.json'
import jaJPDataset from 'langs/jaJP/dataset.json'
import enUSUI from 'langs/enUS/ui.json'
import enUSDataset from 'langs/enUS/dataset.json'

let langs = {
    zhTW: Object.assign({}, zhTWUI, zhTWDataset),
    jaJP: Object.assign({}, jaJPUI, jaJPDataset),
    enUS: Object.assign({}, enUSUI, enUSDataset)
}

let defaultLang = Constant.defaultLang
let browserLnag = navigator.language.replace('-', '')
let currentLang = Status.get('sys:lang')

// Decide Current Lang
currentLang = Helper.isNotEmpty(Constant.langs[currentLang])
    ? currentLang : (
        Helper.isNotEmpty(Constant.langs[browserLnag])
            ? browserLnag : defaultLang
    )

// Set Status
Status.set('sys:lang', currentLang)

function getExistLang (key) {
    for (let lang in langs) {
        if (Helper.isNotEmpty(langs[lang][key])) {
            return langs[lang][key]
        }
    }

    return null
}

export default (key) => {
    currentLang = Status.get('sys:lang')

    if (Helper.isNotEmpty(langs[currentLang]) && Helper.isNotEmpty(langs[currentLang][key])) {
        return langs[currentLang][key]
    }

    if (Helper.isNotEmpty(langs[browserLnag]) && Helper.isNotEmpty(langs[browserLnag][key])) {
        return langs[browserLnag][key]
    }

    if (Helper.isNotEmpty(langs[defaultLang]) && Helper.isNotEmpty(langs[defaultLang][key])) {
        return langs[defaultLang][key]
    }

    return getExistLang(key)
}
