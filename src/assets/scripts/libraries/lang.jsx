'use strict';
/**
 * Lnaguage
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Constant
import Constant from 'constant';

// Load Langs
import zhTWUI from 'json/langs/zhTW/ui.json';
import zhTWDataset from 'json/langs/zhTW/dataset.json';
import enUSUI from 'json/langs/enUS/ui.json';
import enUSDataset from 'json/langs/enUS/dataset.json';

let langs = {
    zhTW: Object.assign({}, zhTWUI, zhTWDataset),
    enUS: Object.assign({}, enUSUI, enUSDataset)
};

let defaultLang = Constant.defaultLang;
let browserLnag = navigator.language.replace('-', '');
let currentLang = ('undefined' !== typeof langs[browserLnag])
    ? browserLnag : defaultLang;

export default (key) => {
    return ('undefined' !== typeof langs[currentLang][key])
        ? langs[currentLang][key] : langs[defaultLang][key];
};
