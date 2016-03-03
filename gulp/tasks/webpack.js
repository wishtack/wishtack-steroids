/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

module.exports = function webpack(callback) {

    var gulp = require('gulp');
    var gutil = require('gulp-util');
    var webpack = require('webpack');
    var webpackConfig = require('../../webpack.config.js');

    webpack(webpackConfig, function(err, stats) {
        if (err) {
            throw new gutil.PluginError('webpack', err);
        }
        gutil.log("[webpack]", stats.toString());
        callback();
    });

};