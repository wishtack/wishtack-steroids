/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

var path = require('path');
var ProvidePlugin = require('webpack/lib/ProvidePlugin');
var DefinePlugin  = require('webpack/lib/DefinePlugin');
var ENV = process.env.ENV = process.env.NODE_ENV = 'test';

/* No need to clone the common config as webpack will run with webpack.config.js or webpack.config.test.js etc...
 * in a dedicated process. We will never load different configs in the same process. AFAIT ;). */
var webpackCommonConfig = require('./webpack.common.config');
var webpackHelper = require('./webpack-helper');

webpackCommonConfig.resolve.cache = false;

webpackCommonConfig.devtool = 'eval';

// webpackCommon.module.preLoaders.push({
//    test: /\.ts$/,
//    loader: 'tslint-loader',
//    exclude: [
//        webpackHelper.root('node_modules')
//    ]
// });

/* Support for .ts files. */
webpackCommonConfig.module.loaders.push({
    test: /\.ts$/,
    loader: 'awesome-typescript-loader',
    exclude: [/\.e2e\.ts$/]
});

/* Coverage with instanbul. */
webpackCommonConfig.module.postLoaders.push({
    test: /\.(js|ts)$/,
    include: webpackHelper.appAngularPath,
    loader: 'istanbul-instrumenter-loader'
});

webpackCommonConfig.module.noParse.push(path.join(webpackHelper.rootPath, 'zone.js/dist'));

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
        '__param': 'ts-helper/param'
    })
]);

webpackCommonConfig.stats = {colors: true, reasons: true};

/*
 * Config
 */
module.exports = webpackCommonConfig;
