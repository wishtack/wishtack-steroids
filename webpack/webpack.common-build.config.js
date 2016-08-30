/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

var path = require('path');
var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var SplitByPathPlugin = require('webpack-split-by-path');

var webpackHelper = require('./webpack-helper');

/*
 * Config
 */
module.exports = webpackMerge.smart(require('./webpack.common.config'), {
    module: {
        loaders: [
            /* Support for .ts files. */
            {
                test: /\.ts$/,
                loaders: ['ng-annotate', 'awesome-typescript-loader'],
                exclude: [/\.(spec|e2e|async)\.ts$/]
            }
        ]
    },
    plugins: [
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
        /* Injecting tags in html. */
        new HtmlWebpackPlugin({
            filename: webpackHelper.distIndexHtmlRelativePath,
            template: webpackHelper.appIndexHtmlPath
        })
    ]
});
