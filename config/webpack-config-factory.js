/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const webpackNodeExternals = require('webpack-node-externals');
const path = require('path');

class WebpackConfigFactory {

    buildConfig({entry, libraryName, projectPath}) {

        const distDirectoryName = 'dist';
        const srcDirectoryName = 'src';

        const outputPath = path.join(projectPath, distDirectoryName);
        const srcRootPath = path.join(projectPath, srcDirectoryName);

        const tsOptions = {
            declaration: true,
            declarationDir: outputPath
        };

        return webpackMerge(
            this._commonConfig({srcRootPath, outputPath, tsOptions}),
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
                    new CleanWebpackPlugin([distDirectoryName], {
                        root: projectPath
                    }),
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

    _commonConfig({srcRootPath, outputPath, tsOptions = {}}) {

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
                            {
                                loader: 'awesome-typescript-loader',
                                options: tsOptions
                            }
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
