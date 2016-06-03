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
    
    module: {
        
        loaders: [
            /* Support for .ts files. */
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader',
                exclude: [/\.e2e\.ts$/]
            }
        ],
        
        noParse: [
            path.join(webpackHelper.rootPath, 'zone.js/dist')
        ],
        
        preLoaders: [
            /* Coverage with istanbul. */
            {
                test: /\.(js|ts)$/,
                include: webpackHelper.appAngularPath,
                loader: 'istanbul-instrumenter-loader'
            }
            // {
            //     test: /\.ts$/,
            //     loader: 'tslint-loader',
            //     exclude: [
            //         webpackHelper.root('node_modules')
            //     ]
            // }
        ],
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
