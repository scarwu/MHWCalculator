/**
 * Lnaguage
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Core Libraries
import Status from 'core/status';
import Helper from 'core/helper';

// Load Constant
import Constant from 'constant';

// Load Langs
import zhTWUI from 'files/json/langs/zhTW/ui.json';
import zhTWDataset from 'files/json/langs/zhTW/dataset.json';
import jaJPUI from 'files/json/langs/jaJP/ui.json';
import jaJPDataset from 'files/json/langs/jaJP/dataset.json';
import enUSUI from 'files/json/langs/enUS/ui.json';
import enUSDataset from 'files/json/langs/enUS/dataset.json';

let langs = {
    zhTW: Object.assign({}, zhTWUI, zhTWDataset),
    jaJP: Object.assign({}, jaJPUI, jaJPDataset),
    enUS: Object.assign({}, enUSUI, enUSDataset)
};

let defaultLang = Constant.default.lang;
let browserLnag = navigator.language.replace('-', '');
let currentLang = Status.get('sys:lang');

// Decide Current Lang
currentLang = Helper.isNotEmpty(Constant.langs[currentLang])
    ? currentLang : (
        Helper.isNotEmpty(Constant.langs[browserLnag])
            ? browserLnag : defaultLang
    );

// Set Status
Status.set('sys:lang', currentLang);

function getExistLang (key) {
    for (let lang in langs) {
        if (Helper.isNotEmpty(langs[lang][key])) {
            return langs[lang][key];
        }
    }

    return null;
}

export default (key) => {
    currentLang = Status.get('sys:lang');

    return (Helper.isNotEmpty(langs[currentLang][key]))
        ? langs[currentLang][key] : (Helper.isNotEmpty(langs[defaultLang][key])
            ? langs[defaultLang][key] : getExistLang(key));
};
