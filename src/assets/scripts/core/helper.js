/**
 * Helper
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

// Load Libraries
import MD5 from 'md5';

// Load Config
import Config from 'config';

function log(...params) {
    if ('production' !== Config.env) {
        console.log.apply(this, params);
    }
}

function debug(...params) {
    if ('production' !== Config.env) {
        console.debug.apply(this, params);
    }
}

function isEmpty(variable) {
    return (undefined === variable || null === variable);
}

function isNotEmpty(variable) {
    return (undefined !== variable && null !== variable);
}

function deepCopy(data) {
    return JSON.parse(JSON.stringify(data));
}

function jsonHash(data) {
    return MD5(JSON.stringify(data));
}

function base64Encode(text) {
    text = window.btoa(text);

    return text
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function base64Decode(text) {
    text = text
        .replace(/\-/g, '+')
        .replace(/\_/g, '/');

    return window.atob(text);
}

export default {
    log: log,
    debug: debug,
    isEmpty: isEmpty,
    isNotEmpty: isNotEmpty,
    deepCopy: deepCopy,
    jsonHash: jsonHash,
    base64Encode: base64Encode,
    base64Decode: base64Decode
};
