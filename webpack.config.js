'use strict';
/**
 * Webpack Config
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

var path = require('path');

module.exports = {
    mode: 'development',
    entry: {
        'mhwc': './src/assets/scripts/mhwc.jsx'
    },
    output: {
        filename: '[name].min.js'
    },
    resolve: {
        modules: [
            path.resolve('./src/assets/scripts'),
            'node_modules'
        ],
        extensions: [
            '.js',
            '.jsx'
        ]
    },
    externals: {

    },
    module: {
        rules: [
            {
                test: /.jsx$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        query: {
                            cacheDirectory: true,
                            plugins: [
                                'transform-class-properties'
                            ],
                            presets: [
                                'stage-3',
                                'stage-2',
                                'stage-1',
                                'stage-0',
                                'es2017',
                                'es2016',
                                'es2015',
                                'react'
                            ]
                        }
                    }
                ]
            }
        ]
    }
}