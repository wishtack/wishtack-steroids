/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

var webpack = require('webpack');
var webpackMerge = require('webpack-merge');

module.exports = webpackMerge.smart(require('./webpack.common-build.config'), {
    plugins: [
        new webpack.optimize.UglifyJsPlugin()
    ]
});
