/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

var path = require('path');
var webpackMerge = require('webpack-merge');
var ProvidePlugin = require('webpack/lib/ProvidePlugin');
var DefinePlugin  = require('webpack/lib/DefinePlugin');
var ENV = process.env.ENV = process.env.NODE_ENV = 'test';

var webpackHelper = require('./webpack-helper');

/*
 * Config
 */
module.exports = webpackMerge.smart(require('./webpack.common.config'), {

    debug: true,

    devtool: 'inline-source-map',

    module: {

        loaders: [
            /* Support for .ts files. */
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader',
                exclude: [/\.e2e\.ts$/]
            },
            /* Override static file loader by removing hash. */
            {
                include: [webpackHelper.appAngularPath],
                test: /\.(html|gif|ico|jpg|png)$/,
                loader: 'file-loader?name=' + path.join(webpackHelper.assetsRelativePath, '[path][name].[ext]')
            }
        ],
        
        noParse: [
            path.join(webpackHelper.rootPath, 'zone.js/dist')
        ],

        postLoaders: [
            /* Coverage with istanbul. */
            {
                test: /\.(js|ts)$/,
                include: webpackHelper.appAngularPath,
                loader: 'istanbul-instrumenter-loader'
            }
        ]
    },
    
    plugins: [
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
    ],
    
    resolve: {
        cache: false
    },
    
    stats: {colors: true, reasons: true}

});
