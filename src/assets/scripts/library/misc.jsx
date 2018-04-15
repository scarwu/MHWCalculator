'use strict';
/**
 * Misc Libray
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

function deepCopy (data) {
    return JSON.parse(JSON.stringify(data));
}

module.exports = {
    deepCopy: deepCopy
};
