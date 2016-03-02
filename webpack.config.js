var _ = require('lodash');
var path = require('path');
var walkSync = require('walk-sync');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ENV = process.env.ENV = process.env.NODE_ENV = 'development';

var webpackHelper = require('./webpack-helper');

var appPath = webpackHelper.root('app/');
var appAngularPath = appPath + 'angular/';
var distPath = webpackHelper.root('dist/');
var assetsScriptsPath = 'assets/scripts/';
var metadata = {
    host: 'localhost',
    port: 3000
};

/*
 * Config
 */
module.exports = {
    /* Use 'eval' for faster builds. */
    devtool: 'source-map',
    debug: true,
    /* Angular app. */
    entry: {
        app: appAngularPath + 'bootstrap.ts'
    },
    externals: _.map(walkSync('node_modules', {
        globs: [
            '**/*.d.ts'
        ]
    }), function removeTypeScriptExtension(fileName) {
        return fileName.replace(/\.d\.ts$/, '');
    }),
    output: {
        chunkFilename: assetsScriptsPath + '[id].chunk.js',
        filename: assetsScriptsPath + '[name].bundle.js',
        path: distPath,
        publicPath: '/',
        sourceMapFilename: assetsScriptsPath + '[name].map'
    },
    resolve: {
        extensions: webpackHelper.prepend(['.ts', '.js', '.json', '.css', '.html'], '.async')
    },
    module: {
        preLoaders: [
            {test: /\.js$/, loader: "source-map-loader", exclude: [webpackHelper.root('node_modules/rxjs')]}
        ],
        loaders: [

            /* Support for .js files. */
            {test: /\.js$/, exclude: [/app\/angular/, /node_modules/], loader: 'ng-annotate!babel'},

            /* Support Angular 2 async routes via .async.ts. */
            {test: /\.async\.ts$/, loaders: ['es6-promise-loader', 'ts-loader'], exclude: [/\.(spec|e2e)\.ts$/]},

            /* Support for .ts files. */
            {test: /\.ts$/, loader: 'ts-loader', exclude: [/\.(spec|e2e|async)\.ts$/]},

            /* Support for *.json files. */
            {test: /\.json$/, loader: 'json-loader'},

            /* Support for CSS as raw text. */
            {test: /\.css$/, loader: 'raw-loader'},

            /* support for .html as raw text. */
            {test: /\.html$/, loader: 'raw-loader', exclude: [webpackHelper.root('app/templates/home.html')]}

        ]
    },

    plugins: [
        new webpack.optimize.OccurenceOrderPlugin(true),
        //new webpack.optimize.CommonsChunkPlugin({
        //    name: 'polyfills',
        //    filename: assetsScriptsPath + 'polyfills.bundle.js',
        //    minChunks: Infinity
        //}),
        // static assets
        //new CopyWebpackPlugin([{
        //    from: 'app/templates/**/*.html',
        //    to: 'templates'
        //}]),
        // generating html
        new HtmlWebpackPlugin({
            filename: 'templates/home_body.html',
            template: 'app/templates/home_body.html'
        }),
        // replace
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         'ENV': JSON.stringify(metadata.ENV),
        //         'NODE_ENV': JSON.stringify(metadata.ENV)
        //     }
        // })
    ],

    // Other module loader config
    tslint: {
        emitErrors: false,
        failOnHint: false,
        resourcePath: 'app'
    },
    // our Webpack Development Server config
    devServer: {
        port: metadata.port,
        host: metadata.host,
        historyApiFallback: true,
        watchOptions: {aggregateTimeout: 300, poll: 1000}
    },
    // we need this due to problems with es6-shim
    node: {
        global: 'window',
        progress: false,
        crypto: 'empty',
        module: false,
        clearImmediate: false,
        setImmediate: false
    }
};
