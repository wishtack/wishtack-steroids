var _ = require('lodash');
var path = require('path');
var webpack = require('webpack');

var webpackHelper = require('./webpack-helper');

var rootPath = webpackHelper.rootPath();
var appPath = rootPath + 'app/';
var appAngularPath = appPath + 'angular/';
var appTemplatesPath = appPath + 'templates/';
var distDirectoryName = webpackHelper.distDirectoryName();
var distPath = rootPath + distDirectoryName + '/';
var assetsPath = 'assets/';
var assetsScriptsPath = assetsPath + 'scripts/';

/*
 * Config
 */
module.exports = {

    /* Use 'eval' for faster builds. */
    devtool: 'source-map',

    debug: false,

    /* Angular app. */
    entry: {
        app: appAngularPath + 'bootstrap.ts'
    },

    output: {
        chunkFilename: assetsScriptsPath + '[id].[chunkhash].chunk.js',
        filename: assetsScriptsPath + '[name].[chunkhash].bundle.js',
        path: distPath,
        publicPath: '/',
        sourceMapFilename: assetsScriptsPath + '[name].[chunkhash].map'
    },

    resolve: {
        extensions: webpackHelper.prepend(['.ts', '.js', '.json', '.css', '.html'], '.async')
    },

    module: {
        noParse: [],
        preLoaders: [
            {test: /\.js$/, loader: "source-map-loader", exclude: [webpackHelper.root('node_modules/rxjs')]}
        ],
        loaders: [

            /* Support for .js files. */
            {test: /\.js$/, loaders: ['ng-annotate', 'babel'], exclude: [/node_modules/]},

            /* Support Angular 2 async routes via .async.ts. */
            {test: /\.async\.ts$/, loaders: ['es6-promise-loader', 'ts-loader'], exclude: [/\.(spec|e2e)\.ts$/]},

            /* Support for *.json files. */
            {test: /\.json$/, loader: 'json-loader'},

            /* Support for CSS as raw text. */
            {test: /\.css$/, loader: 'raw-loader'},

            /* Support for assets as revved files. */
            {
                include: [appAngularPath],
                test: /\.(html|gif|ico|jpg|png)$/,
                loader: 'file-loader?name=' + assetsPath + '[path][name].[hash].[ext]'
            },

            {
                include: [appTemplatesPath],
                test: /\.html/,
                loader: 'raw-loader'
            }

        ],
        postLoaders: []
    },

    plugins: [],

    tslint: {
        emitErrors: false,
        failOnHint: false,
        resourcePath: 'app'
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
