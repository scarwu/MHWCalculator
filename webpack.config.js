'use strict';
/**
 * Webpack Config
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

const path = require('path');
const marked = require('marked');

module.exports = {
    mode: 'development',
    entry: {
        main: './src/assets/scripts/main.jsx'
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
                test: /.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: true,
                        plugins: [
                            // Stage 0
                            '@babel/plugin-proposal-function-bind',

                            // Stage 1
                            '@babel/plugin-proposal-export-default-from',
                            '@babel/plugin-proposal-logical-assignment-operators',
                            ['@babel/plugin-proposal-optional-chaining', { 'loose': false }],
                            ['@babel/plugin-proposal-pipeline-operator', { 'proposal': 'minimal' }],
                            ['@babel/plugin-proposal-nullish-coalescing-operator', { 'loose': false }],
                            '@babel/plugin-proposal-do-expressions',

                            // Stage 2
                            ['@babel/plugin-proposal-decorators', { 'legacy': true }],
                            '@babel/plugin-proposal-function-sent',
                            '@babel/plugin-proposal-export-namespace-from',
                            '@babel/plugin-proposal-numeric-separator',
                            '@babel/plugin-proposal-throw-expressions',

                            // Stage 3
                            '@babel/plugin-syntax-dynamic-import',
                            '@babel/plugin-syntax-import-meta',
                            ['@babel/plugin-proposal-class-properties', { 'loose': false }],
                            '@babel/plugin-proposal-json-strings'
                        ],
                        presets: [
                            ['@babel/preset-env', { useBuiltIns: 'usage', corejs: 3 }],
                            '@babel/preset-react'
                        ]
                    }
                }
            },
            {
                test: /\.md$/,
                use: [
                    {
                        loader: 'html-loader'
                    },
                    {
                        loader: 'markdown-loader',
                        options: {
                            pedantic: true,
                            renderer: new marked.Renderer()
                        }
                    }
                ]
            }
        ]
    }
}