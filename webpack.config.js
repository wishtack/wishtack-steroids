
var _ = require('lodash');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var glob = require('glob');
var walkSync = require('walk-sync');
var webpack = require('webpack');

module.exports = {
    entry: {
        app: './app/angular/bootstrap.ts'
    },
    externals: _.map(walkSync('node_modules', {
        globs: [
            '**/*.d.ts'
        ]
    }), function removeTypeScriptExtension(fileName) {
        return fileName.replace(/\.d\.ts$/, '');
    }),
    output: {
        filename: 'assets/scripts/app.[chunkhash].js',
        libraryTarget: 'umd',
        path: 'dist',
        publicPath: '/'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin(),
        new HtmlWebpackPlugin({
            filename: 'templates/home.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true
            },
            template: 'app/templates/home.html',
            inject: 'head'
        })
    ],
    module: {
        loaders: [
            {
                loader: 'ts-loader',
                query: {
                    compilerOptions: {
                        experimentalDecorators: true,
                        target: 'es5',
                        removeComments: true,
                        sourceMap: true
                    }
                },
                test: /\.ts$/
            }
        ]
    }
}
