/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

var webpack = require('webpack');
var path = require('path');

class WebpackConfigFactory {

    buildConfig({entry, libraryName, outputPath, srcRootPath}) {
        return {
            entry: entry,
            devtool: 'source-map',
            output: {
                path: outputPath,
                filename: `${libraryName}.min.js`,
                library: libraryName,
                libraryTarget: 'umd',
                umdNamedDefine: true
            },
            module: {
                loaders: [
                    {
                        test: /\.ts$/,
                        loader: 'babel!ts',
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
            },
            plugins: [
                new webpack.optimize.UglifyJsPlugin({ minimize: true })
            ]
        };
    }

    testConfig({srcRootPath}) {

        return {
            devtool: 'inline-source-map',
            module: {
                loaders: [
                    {
                        test: /\.ts$/,
                        loader: 'babel!ts',
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
        };

    }

}

module.exports.WebpackConfigFactory = WebpackConfigFactory;
