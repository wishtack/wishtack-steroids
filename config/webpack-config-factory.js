/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const path = require('path');

class WebpackConfigFactory {

    buildConfig({entry, libraryName, projectPath}) {

        const distDirectoryName = 'dist';

        const outputPath = path.join(projectPath, distDirectoryName);
        const srcRootPath = path.join(projectPath, 'src');

        return webpackMerge(
            this._commonConfig({projectPath, srcRootPath, outputPath}),
            {
                entry: entry,
                devtool: 'source-map',
                mode: 'production',
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
                    })
                ]
            }
        );

    }

    testConfig({coverage, projectPath}) {

        const srcRootPath = path.join(projectPath, 'src');

        return webpackMerge(
            this._commonConfig({projectPath, srcRootPath}),
            {
                devtool: 'inline-source-map',
                mode: 'development',
                module: {
                    rules: [
                        ...coverage ? [{
                            enforce: 'post',
                            test: /\.(js|ts)$/,
                            loader: 'istanbul-instrumenter-loader',
                            options: {
                                preserveComments: true
                            },
                            include: srcRootPath,
                            exclude: [
                                /\.(e2e|spec)\.ts$/,
                                /node_modules/
                            ]
                        }] : []
                    ]
                }
            }
        );

    }

    _commonConfig({projectPath, srcRootPath, outputPath, tsOptions = {}}) {

        tsOptions = {
            /* Setting default `configFile`. */
            configFile: path.join(projectPath, 'tsconfig.json'),
            ...tsOptions,
        };

        return {
            module: {
                rules: [
                    {
                        test: /\.ts$/,
                        use: [
                            {
                                loader: 'ts-loader',
                                options: tsOptions
                            }
                        ]
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
