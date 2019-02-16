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
import zhTW from 'langs/zhTW';
import enUS from 'langs/enUS';

let langs = {
    zhTW: zhTW,
    enUS: enUS
};

let defaultLang = Constant.defaultLang;
let browserLnag = navigator.language.replace('-', '');
let currentLang = 'undefined' !== typeof langs[browserLnag]
    ? browserLnag : defaultLang;

export default langs[currentLang];
