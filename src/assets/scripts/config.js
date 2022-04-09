/**
 * Config
 *
 * @package     Monster Hunter World - Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (https://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

 export const env = process.env.ENV || 'development'
 export const buildTime = process.env.BUILD_TIME || (new Date()).getTime().toString()
 export const sentryDsn = 'https://000580e8cc8a4f3bbf668d4acfc90da2@sentry.io/1400031'

export default {
    env,
    buildTime,
    sentryDsn
};
