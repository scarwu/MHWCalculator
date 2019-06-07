'use strict';
/**
 * Base64 Libray
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

export default {
    encode: (text) => {
        text = window.btoa(text);

        return text
            .replace(/\+/g, '-')
            .replace(/\//g, '_');
    },
    decode: (text) => {
        text = text
            .replace(/\-/g, '+')
            .replace(/\_/g, '/');

        return window.atob(text);
    }
};
