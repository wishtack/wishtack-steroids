
var fs = require('fs');
var webpack = require('webpack');

module.exports = {
    entry: {
        app: './app/angular/bootstrap.ts'
    },
    externals: [
        'angular2/core',
        'angular2/platform/browser'
    ],
    output: {
        filename: 'dist/assets/scripts/app.js',
        libraryTarget: 'umd'
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.js']
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
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
