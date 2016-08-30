/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

var webpackMerge = require('webpack-merge');
var LiveReloadPlugin = require('webpack-livereload-plugin');

/*
 * Config
 */
module.exports = webpackMerge.smart(require('./webpack.common-build.config'), {
    debug: true,
    devtool: 'eval',
    plugins: [
        new LiveReloadPlugin({
            port: 8729
        })
    ]
});
