'use strict';
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

// Load Constant
import Constant from 'constant';

// Load Langs
import zhTWUI from 'json/langs/zhTW/ui.json';
import zhTWDataset from 'json/langs/zhTW/dataset.json';
import jaJPUI from 'json/langs/jaJP/ui.json';
import jaJPDataset from 'json/langs/jaJP/dataset.json';
import enUSUI from 'json/langs/enUS/ui.json';
import enUSDataset from 'json/langs/enUS/dataset.json';

let langs = {
    zhTW: Object.assign({}, zhTWUI, zhTWDataset),
    jaJP: Object.assign({}, jaJPUI, jaJPDataset),
    enUS: Object.assign({}, enUSUI, enUSDataset)
};

let defaultLang = Constant.defaultLang;
let browserLnag = navigator.language.replace('-', '');
let currentLang = Status.get('lang');

// Decide Current Lang
currentLang = ('undefined' !== typeof langs[currentLang])
    ? currentLang : ('undefined' !== typeof langs[browserLnag])
        ? browserLnag : defaultLang;

// Set Status
Status.set('lang', currentLang);

export default (key) => {
    currentLang = Status.get('lang');

    return ('undefined' !== typeof langs[currentLang][key])
        ? langs[currentLang][key] : langs[defaultLang][key];
};
