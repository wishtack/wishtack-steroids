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
                loaders: [
                    {
                        test: /\.ts$/,
                        loader: 'babel!awesome-typescript',
                        exclude: /node_modules/
                    },
                    {
                        test: /\.js$/,
                        loader: 'babel',
                        exclude: /node_modules/
                    }
                ]
            },
            resolve: {
                root: srcRootPath,
                extensions: ['', '.js', '.ts']
            }
        }

    }

}

module.exports.WebpackConfigFactory = WebpackConfigFactory;
