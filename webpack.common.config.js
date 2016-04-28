var _ = require('lodash');
var CleanWebpackPlugin = require('clean-webpack-plugin');
var LiveReloadPlugin = require('webpack-livereload-plugin');
var path = require('path');
var webpack = require('webpack');

var webpackHelper = require('./webpack-helper');

var rootPath = webpackHelper.root('.');
var appPath = webpackHelper.root('app/');
var appAngularPath = appPath + 'angular/';
var distDirectoryName = 'dist';
var distPath = webpackHelper.root(distDirectoryName + '/');
var assetsScriptsPath = 'assets/scripts/';

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

    externals: {
        'angular': 'angular'
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

            /* support for .html as raw text. */
            {test: /\.html$/, loader: 'raw-loader', exclude: [webpackHelper.root('app/templates/home.html')]}

        ],
        postLoaders: []
    },

    plugins: [
        new CleanWebpackPlugin([distDirectoryName], {
            root: rootPath,
            verbose: true,
            dry: false
        }),
        new LiveReloadPlugin({
            port: 8729
        })
    ],

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
