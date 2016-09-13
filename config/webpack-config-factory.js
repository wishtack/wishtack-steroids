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

    testConfig({entry, libraryName, outputPath, rootPath}) {

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
                        test: /\.tsx?$/,
                        loader: 'babel!ts',
                        exclude: /node_modules/
                    },
                    {
                        test: /\.jsx?$/,
                        loader: 'babel',
                        exclude: /node_modules/
                    }
                ]
            },
            resolve: {
                root: rootPath,
                extensions: ['', '.js']
            },
            plugins: [
                new webpack.optimize.UglifyJsPlugin({ minimize: true })
            ]
        };

    }

}

module.exports.WebpackConfigFactory = WebpackConfigFactory;
