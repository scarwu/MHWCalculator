'use strict';
/**
 * Gulp Tasks
 *
 * @package     MHW Calculator
 * @author      Scar Wu
 * @copyright   Copyright (c) Scar Wu (http://scar.tw)
 * @link        https://github.com/scarwu/MHWCalculator
 */

let ENVIRONMENT = 'development'; // production | development | testing
let WEBPACK_NEED_WATCH = false;

let gulp = require('gulp');
let del = require('del');
let $ = require('gulp-load-plugins')();
let process = require('process');
let webpackStream = require('webpack-stream');
let webpack = require('webpack');
let webpackConfig = require('./webpack.config.js');

let postfix = (new Date()).getTime().toString();

function createSrcAndDest(path) {
    let src = path.replace(process.env.PWD + '/', '');
    let dest = src.replace('src/assets', 'src/boot/assets').split('/');

    dest.pop();

    return {
        src: src,
        dest: dest.join('/')
    };
}

function handleCompileError(event) {
    $.util.log($.util.colors.red(event.message), 'error.');
}

// Assets Compile Task
let compileTask = {
    sass: function (src, dest) {
        return gulp.src(src)
            .pipe($.sass({
                outputStyle: ('production' === ENVIRONMENT) ? 'compressed' : 'expanded'
            }).on('error', handleCompileError))
            .pipe($.replace('../fonts/', '../../assets/fonts/vendor/'))
            .pipe($.autoprefixer())
            .pipe($.rename(function (path) {
                path.basename = path.basename.split('.')[0];
                path.extname = '.min.css';
            }))
            .pipe(gulp.dest(dest));
    },
    webpack: function (src, dest) {
        if ('production' === ENVIRONMENT) {
            let definePlugin = new webpack.DefinePlugin({
                'process.env': {
                    'ENV': "'production'",
                    'BUILD_TIME': postfix,
                    'NODE_ENV': "'production'"
                }
            });

            webpackConfig.mode = ENVIRONMENT;
            webpackConfig.plugins = webpackConfig.plugins || [];
            webpackConfig.plugins.push(definePlugin);
        }

        if (WEBPACK_NEED_WATCH) {
            webpackConfig.watch = true;
        }

        return gulp.src(src)
            .pipe(webpackStream(webpackConfig, webpack).on('error', handleCompileError))
            .pipe(gulp.dest(dest));
    }
};

/**
 * Copy Files & Folders
 */
function copyStatic() {
    return gulp.src([
            'src/static/**/*'
        ])
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
    return gulp.src([
            'node_modules/font-awesome/fonts/*.{otf,eot,svg,ttf,woff,woff2}'
        ])
        .pipe(gulp.dest('src/boot/assets/fonts/vendor'));
}

/**
 * Styles
 */
function styleSass() {
    return compileTask.sass([
        'src/assets/styles/main.{sass,scss}',
    ], 'src/boot/assets/styles');
}

/**
 * Complex
 */
function complexWebpack() {
    let result = compileTask.webpack(
        'src/assets/scripts/main.jsx',
        'src/boot/assets/scripts'
    );

    return WEBPACK_NEED_WATCH ? true : result;
}

/**
 * Watching Files
 */
function watch() {

    // Start LiveReload
    $.livereload.listen();

    gulp.watch([
        'src/boot/**/*'
    ]).on('change', $.livereload.changed);

    // Static Files
    gulp.watch('src/assets/fonts/*', [
        'copyAssetsFonts'
    ]);

    gulp.watch('src/assets/images/**/*', [
        'copyAssetsImages'
    ]);

    gulp.watch([
        'src/static/**/*'
    ], [
        'copyStatic'
    ]);

    // Pre Compile Files
    gulp.watch('src/assets/styles/**/*.{sass,scss}', [
        styleSass
    ]);
}

/**
 * Release
 */
// Copy
function releaseCopyBoot() {
    return gulp.src([
            'src/boot/**/*'
        ])
        .pipe(gulp.dest('docs'));
}

// Replace
function releaseReplaceIndex() {
    return gulp.src('docs/index.html')
        .pipe($.replace('?timestamp', '?' + (new Date()).getTime().toString()))
        .pipe(gulp.dest('docs'));
}

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
gulp.task('clean', () => {
    return del([
        'src/boot'
    ]);
});

gulp.task('cleanRelease', () => {
    return del([
        'src/boot',
        'docs'
    ]);
});

gulp.task('cleanAll', () => {
    return del([
        'src/boot',
        'node_modules'
    ]);
});

/**
 * Bundled Tasks
 */
gulp.task('prepare', gulp.series('clean',
    gulp.parallel(copyStatic),
    gulp.parallel(copyAssetsFonts, copyAssetsImages, copyVendorFonts),
    gulp.parallel(styleSass, complexWebpack)
));

gulp.task('release', gulp.series(setEnv, 'cleanRelease', 'prepare',
    gulp.parallel(releaseCopyBoot),
    gulp.parallel(releaseReplaceIndex)
));

gulp.task('default', gulp.series(setWatch, 'prepare', watch));
