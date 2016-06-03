var _ = require('lodash');
var path = require('path');
var webpack = require('webpack');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var LiveReloadPlugin = require('webpack-livereload-plugin');
var SplitByPathPlugin = require('webpack-split-by-path');

/* No need to clone the common config as webpack will run with webpack.config.js or webpack.config.test.js etc...
 * in a dedicated process. We will never load different configs in the same process. AFAIT ;). */
var webpackCommonConfig = require('./webpack.common.config');
var webpackHelper = require('./webpack-helper');


webpackCommonConfig.debug = true;

/* Support for .ts files. */
webpackCommonConfig.module.loaders.push({
    test: /\.ts$/,
    loader: 'awesome-typescript-loader',
    exclude: [/\.(spec|e2e|async)\.ts$/]
});

webpackCommonConfig.plugins = webpackCommonConfig.plugins.concat([
    new CleanWebpackPlugin([webpackHelper.distDirectoryName], {
        root: webpackHelper.rootPath,
        verbose: true,
        dry: false
    }),
    new SplitByPathPlugin([
        {
            name: 'vendor',
            path: path.join(webpackHelper.rootPath, 'node_modules')
        }
    ]),
    new webpack.optimize.OccurenceOrderPlugin(true),
    //new webpack.optimize.CommonsChunkPlugin({
    //    name: 'polyfills',
    //    filename: assetsScriptsPath + 'polyfills.bundle.js',
    //    minChunks: Infinity
    //}),
    /* Static assets. */
    new CopyWebpackPlugin([
        {
            from: webpackHelper.appTemplatesPath,
            to: webpackHelper.templatesDirectoryName
        }
    ]),
    /* Injecting tags in html. */
    new HtmlWebpackPlugin({
        filename: path.join(webpackHelper.templatesDirectoryName, 'home_body.html'),
        template: path.join(webpackHelper.appTemplatesPath, 'home_body.html')
    }),
    new LiveReloadPlugin({
        port: 8729
    })
]);

/*
 * Config
 */
module.exports = webpackCommonConfig;
