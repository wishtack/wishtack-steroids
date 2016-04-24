/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

/*
 * Helper: root(), and rootDir() are defined at the bottom
 */
var path = require('path');
// Webpack Plugins
var ProvidePlugin = require('webpack/lib/ProvidePlugin');
var DefinePlugin  = require('webpack/lib/DefinePlugin');
var ENV = process.env.ENV = process.env.NODE_ENV = 'test';

/* No need to clone the common config as webpack will run with webpack.config.js or webpack.config.test.js etc...
 * in a dedicated process. We will never load different configs in the same process. AFAIT ;). */
var webpackCommonConfig = require('./webpack.common.config');
var webpackHelper = require('./webpack-helper');

webpackCommonConfig.resolve.cache = false;

webpackCommonConfig.devtool = 'eval';

//webpackCommon.module.preLoaders.push({
//    test: /\.ts$/,
//    loader: 'tslint-loader',
//    exclude: [
//        webpackHelper.root('node_modules')
//    ]
//});

/* Support for .ts files. */
webpackCommonConfig.module.loaders.push({test: /\.ts$/, loader: 'ts-loader', exclude: [/\.e2e\.ts$/]});

/* Coverage with instanbul. */
webpackCommonConfig.module.postLoaders.push({
    test: /\.(js|ts)$/,
    include: webpackHelper.root('src'),
    loader: 'istanbul-instrumenter-loader',
    exclude: [
        /\.(e2e|spec)\.ts$/,
        /node_modules/
    ]
});

webpackCommonConfig.module.noParse.push(webpackHelper.root('zone.js/dist'));
webpackCommonConfig.module.noParse.push(webpackHelper.root('angular2/bundles'));

webpackCommonConfig.plugins = webpackCommonConfig.plugins.concat([
    new DefinePlugin({
        // Environment helpers
        'process.env': {
            'ENV': JSON.stringify(ENV),
            'NODE_ENV': JSON.stringify(ENV)
        }
    }),
    new ProvidePlugin({
        // TypeScript helpers
        '__metadata': 'ts-helper/metadata',
        '__decorate': 'ts-helper/decorate',
        '__awaiter': 'ts-helper/awaiter',
        '__extends': 'ts-helper/extends',
        '__param': 'ts-helper/param',
        'Reflect': 'es7-reflect-metadata/src/global/browser'
    })
]);

webpackCommonConfig.stats = {colors: true, reasons: true};

/*
 * Config
 */
module.exports = webpackCommonConfig;
