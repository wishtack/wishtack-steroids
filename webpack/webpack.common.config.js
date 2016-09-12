/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

var path = require('path');
var webpack = require('webpack');

var webpackHelper = require('./webpack-helper');

/*
 * Config
 */
module.exports = {

    debug: false,

    /* Angular app. */
    entry: {
        app: path.join(webpackHelper.appAngularPath, 'bootstrap.ts')
    },

    output: {
        chunkFilename: path.join(webpackHelper.assetsScriptsRelativePath, '[id].[chunkhash].chunk.js'),
        filename: path.join(webpackHelper.assetsScriptsRelativePath, '[name].[chunkhash].bundle.js'),
        path: webpackHelper.distPath,
        publicPath: webpackHelper.publicPath,
        sourceMapFilename: path.join(webpackHelper.assetsScriptsRelativePath, '[name].[chunkhash].map')
    },

    resolve: {
        extensions: webpackHelper.prepend(['.ts', '.js', '.json', '.css', '.html'], '.async')
    },

    module: {
        noParse: [],
        preLoaders: [
            {test: /\.js$/, loader: "source-map-loader", exclude: [path.join(webpackHelper.rootPath, 'node_modules/rxjs')]}
        ],
        loaders: [

            /* Support for .js files. */
            {test: /\.js$/, loaders: ['ng-annotate', 'babel'], exclude: [/node_modules/]},

            /* Support Angular 2 async routes via .async.ts. */
            {test: /\.async\.ts$/, loaders: ['es6-promise-loader', 'ts-loader'], exclude: [/\.(spec|e2e)\.ts$/]},

            /* Support for *.json files. */
            {test: /\.json$/, loader: 'json-loader'},

            /* Support for CSS as raw text. */
            {test: /\.css$/, loaders: ['css-loader', 'raw-loader']},

            /* Support for LESS. */
            {test: /\.less/, loaders: ['css-loader', 'less-loader']},

            /* Support for SASS. */
            {test: /\.scss/, loaders: ['css-loader', 'sass-loader']},
            
            /* Support for LESS. */
            {test: /\.less/, loader: 'less-loader'},

            /* Support for assets as revved files. */
            {
                include: [webpackHelper.appAngularPath],
                test: /\.(html|gif|ico|jpg|png)$/,
                loader: 'file-loader?name=' + path.join(webpackHelper.assetsRelativePath, '[path][name].[hash].[ext]')
            }

        ],
        postLoaders: []
    },

    plugins: [],

    tslint: {
        emitErrors: false,
        failOnHint: false,
        resourcePath: webpackHelper.appAngularPath
    },

    /* We need this due to problems with es6-shim. */
    node: {
        global: 'window',
        progress: false,
        crypto: 'empty',
        module: false,
        clearImmediate: false,
        setImmediate: false
    }
};
