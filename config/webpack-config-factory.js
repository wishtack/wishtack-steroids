/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const webpackNodeExternals = require('webpack-node-externals');
const path = require('path');

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
                    new webpack.optimize.UglifyJsPlugin({
                        minimize: true,
                        sourceMap: true
                    })
                ]
            }
        );

    }

    testConfig({srcRootPath}) {

        return webpackMerge(
            this._commonConfig({srcRootPath}),
            {
                devtool: 'inline-source-map',
                module: {
                    rules: [
                        {
                            enforce: 'post',
                            test: /\.(js|ts)$/,
                            loader: 'istanbul-instrumenter-loader',
                            include: srcRootPath,
                            exclude: [
                                /\.(e2e|spec)\.ts$/,
                                /node_modules/
                            ]
                        }
                    ]
                }
            }
        );

    }

    _commonConfig({srcRootPath}) {

        return {
            module: {
                rules: [
                    {
                        enforce: 'pre',
                        test: /\.ts$/,
                        use: [
                            'tslint-loader'
                        ],
                        exclude: /node_modules/
                    },
                    {
                        test: /\.ts$/,
                        use: [
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
            plugins: [
                new webpack.LoaderOptionsPlugin({
                    options: {
                        tslint: {
                            emitErrors: false,
                            failOnHint: false,
                            resourcePath: srcRootPath
                        }
                    }
                })
            ],
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
