'use strict';
/**
 * Gulp Tasks
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

const gulp = require('gulp');
const del = require('del');
const $ = require('gulp-load-plugins')();
const log = require('fancy-log');
const colors = require('ansi-colors');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const webpackConfig = require('./webpack.config.js');
const sentryWebpackPlugin = require("@sentry/webpack-plugin");
const postfix = (new Date()).getTime().toString();

let ENVIRONMENT = 'development';
let WEBPACK_NEED_WATCH = false;

/**
 * Compile Style & Script
 */
function handleCompileError(event) {
    log.error(colors.red(event.message), 'error.');
}

function compileSass() {
    return gulp.src('src/assets/styles/main.{sass,scss}')
        .pipe($.sass({
            outputStyle: ('production' === ENVIRONMENT) ? 'compressed' : 'expanded'
        }).on('error', handleCompileError))
        .pipe($.replace('../fonts/', '../../assets/fonts/vendor/'))
        .pipe($.autoprefixer())
        .pipe($.rename(function (path) {
            path.basename = path.basename.split('.')[0];
            path.extname = '.min.css';
        }))
        .pipe(gulp.dest('src/boot/assets/styles'));
}

function compileWebpack(callback) {
    if ('production' === ENVIRONMENT) {
        webpackConfig.mode = ENVIRONMENT;
        webpackConfig.plugins = webpackConfig.plugins || [];
        webpackConfig.plugins.push(new webpack.DefinePlugin({
            'process.env': {
                'ENV': "'production'",
                'BUILD_TIME': postfix,
                'NODE_ENV': JSON.stringify('production')
            }
        }));
        webpackConfig.plugins.push(new sentryWebpackPlugin({
            authToken: process.env.SENTRY_AUTH_TOKEN,
            org: "scarstudio",
            project: "mhwc",
            release: postfix,
            include: "src/boot/assets/scripts"
        }));
    } else {
        webpackConfig.plugins = webpackConfig.plugins || [];
        webpackConfig.plugins.push(new webpack.DefinePlugin({
            'process.env': {
                'ENV': "'development'",
                'BUILD_TIME': postfix,
                'NODE_ENV': JSON.stringify('development')
            }
        }));
    }

    if (WEBPACK_NEED_WATCH) {
        webpackConfig.watch = true;
    }

    let result = gulp.src([ 'src/assets/scripts/main.jsx', 'src/assets/scripts/worker.js' ])
        .pipe(webpackStream(webpackConfig, webpack).on('error', handleCompileError))
        .pipe(gulp.dest('src/boot/assets/scripts'));

    if (WEBPACK_NEED_WATCH) {
        callback();
    } else {
        return result;
    }
}

/**
 * Copy Files & Folders
 */
function copyStatic() {
    return gulp.src('src/static/**/*')
        .pipe(gulp.dest('src/boot'));
}

function copyAssetsFonts() {
    return gulp.src('src/assets/fonts/*')
        .pipe(gulp.dest('src/boot/assets/fonts'));
}

function copyAssetsImages() {
    return gulp.src('src/assets/images/**/*')
        .pipe(gulp.dest('src/boot/assets/images'));
}

function copyVendorFonts() {
    return gulp.src('node_modules/font-awesome/fonts/*.{otf,eot,svg,ttf,woff,woff2}')
        .pipe(gulp.dest('src/boot/assets/fonts/vendor'));
}

/**
 * Watching Files
 */
function watch() {

    // Watch Files
    gulp.watch('src/boot/**/*').on('change', $.livereload.changed);
    gulp.watch('src/static/**/*', copyStatic);
    gulp.watch('src/assets/fonts/*', copyAssetsFonts);
    gulp.watch('src/assets/images/**/*', copyAssetsImages);
    gulp.watch('src/assets/styles/**/*.{sass,scss}', compileSass);

    // Start LiveReload
    $.livereload.listen();
}

/**
 * Release
 */
function releaseCopyBoot() {
    return gulp.src('src/boot/**/*')
        .pipe($.filter(['**', '!**/*.map']))
        .pipe(gulp.dest('docs'));
}

function releaseReplaceIndex() {
    return gulp.src('src/boot/index.html')
        .pipe($.replace('?timestamp', `?${postfix}`))
        .pipe(gulp.dest('src/boot'));
}

gulp.task(
    'releaseUploadSourcemap',
    $.shell.task([
        `./node_modules/@sentry/cli/bin/sentry-cli releases -o scarstudio -p mhwc files ${postfix} upload-sourcemaps ./src/boot --ignore node_modules --rewrite`
    ])
);

/**
 * Set Variables
 */
function setEnv(callback) {

    // Warrning: Change ENVIRONMENT to Prodctuion
    ENVIRONMENT = 'production';

    callback();
}

function setWatch(callback) {

    // Webpack need watch
    WEBPACK_NEED_WATCH = true;

    callback();
}

/**
 * Clean Temp Folders
 */
function cleanBoot() {
    return del('src/boot');
}

function cleanDocs() {
    return del('docs');
}

/**
 * Bundled Tasks
 */
gulp.task('prepare', gulp.series(
    cleanBoot,
    gulp.parallel(copyStatic, copyAssetsFonts, copyAssetsImages, copyVendorFonts),
    gulp.parallel(compileSass, compileWebpack)
));

gulp.task('release', gulp.series(
    setEnv, cleanDocs,
    'prepare',
    gulp.parallel('releaseUploadSourcemap', releaseReplaceIndex),
    releaseCopyBoot
));

gulp.task('default', gulp.series(
    setWatch,
    'prepare',
    watch
));
