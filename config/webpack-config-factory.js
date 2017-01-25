/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

var webpack = require('webpack');
var webpackMerge = require('webpack-merge');
var webpackNodeExternals = require('webpack-node-externals');
var path = require('path');

class WebpackConfigFactory {

    buildConfig({entry, libraryName, outputPath, srcRootPath}) {

        return webpackMerge(
            this._commonConfig({srcRootPath}),
            {
                entry: entry,
                devtool: 'source-map',
                externals: [webpackNodeExternals()],
                output: {
                    path: outputPath,
                    filename: `${libraryName}.min.js`,
                    library: libraryName,
                    libraryTarget: 'umd',
                    umdNamedDefine: true
                },
                plugins: [
                    new webpack.optimize.UglifyJsPlugin({minimize: true})
                ]
            }
        );

    }

    testConfig({srcRootPath}) {

        return webpackMerge(
            this._commonConfig({srcRootPath}),
            {
                devtool: 'inline-source-map'
            }
        );

    }

    _commonConfig({srcRootPath}) {

        return {
            module: {
                rules: [
                    {
                        test: /\.ts$/,
                        use: [
                            'babel-loader',
                            'awesome-typescript-loader'
                        ],
                        exclude: /node_modules/
                    },
                    {
                        test: /\.js$/,
                        use: [
                            'babel-loader'
                        ],
                        exclude: /node_modules/
                    }
                ]
            },
            resolve: {
                modules: [
                    srcRootPath,
                    'node_modules'
                ],
                extensions: ['.js', '.ts']
            }
        }

    }

}

module.exports.WebpackConfigFactory = WebpackConfigFactory;
