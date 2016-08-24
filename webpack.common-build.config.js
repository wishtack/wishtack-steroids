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
                loader: 'awesome-typescript-loader',
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
            filename: path.join(webpackHelper.templatesDirectoryName, 'home.html'),
            template: path.join(webpackHelper.appTemplatesPath, 'home.html')
        })
    ]
});
