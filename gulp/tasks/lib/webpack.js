/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

module.exports = (args) => {

    var NamedParameters = require('named-parameters').NamedParameters;

    args = new NamedParameters(args)
        .require('uglify')
        .require('watch')
        .values();

    var uglify = args.uglify;
    var watch = args.watch;

    return function webpack(done) {

        var _ = require('lodash');
        var gulp = require('gulp');
        var gutil = require('gulp-util');
        var webpack = require('webpack');
        var webpackConfig = require('../../../webpack.config.js');

        webpackConfig = _.extend({}, webpackConfig);

        if (uglify) {
            webpackConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());
        }

        webpackConfig.watch = watch;

        webpack(webpackConfig, function(err, stats) {
            if (err) {
                throw new gutil.PluginError('webpack', err);
            }
            gutil.log("[webpack]", stats.toString({
                chunks: false
            }));
            done();
        });

    };

};
