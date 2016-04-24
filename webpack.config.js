var _ = require('lodash');
var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var SplitByPathPlugin = require('webpack-split-by-path');

/* No need to clone the common config as webpack will run with webpack.config.js or webpack.config.test.js etc...
 * in a dedicated process. We will never load different configs in the same process. AFAIT ;). */
var webpackCommonConfig = require('./webpack.common.config');

webpackCommonConfig.debug = true;

/* Support for .ts files. */
webpackCommonConfig.module.loaders.push({test: /\.ts$/, loader: 'ts-loader', exclude: [/\.(spec|e2e|async)\.ts$/]});

webpackCommonConfig.plugins = webpackCommonConfig.plugins.concat([
    //new webpack.IgnorePlugin(/^angular2\//),
    new SplitByPathPlugin([
        {
            name: 'vendor',
            path: path.join(__dirname, 'node_modules')
        }
    ]),
    new webpack.optimize.OccurenceOrderPlugin(true),
    //new webpack.optimize.CommonsChunkPlugin({
    //    name: 'polyfills',
    //    filename: assetsScriptsPath + 'polyfills.bundle.js',
    //    minChunks: Infinity
    //}),
    // static assets
    new CopyWebpackPlugin([{
        from: 'app/templates',
        to: 'templates'
    }]),
    // generating html
    new HtmlWebpackPlugin({
        filename: 'templates/home_body.html',
        template: 'app/templates/home_body.html'
    })
    //new webpack.optimize.UglifyJsPlugin()
    // replace
    // new webpack.DefinePlugin({
    //     'process.env': {
    //         'ENV': JSON.stringify(metadata.ENV),
    //         'NODE_ENV': JSON.stringify(metadata.ENV)
    //     }
    // })
]);

/*
 * Config
 */
module.exports = webpackCommonConfig;
