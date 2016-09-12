/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

module.exports = (args) => {

    var NamedParameters = require('named-parameters').NamedParameters;

    args = new NamedParameters(args)
        .default('debug', false)
        .default('dev', false)
        .default('watch', false)
        .values();

    var debug = args.debug;
    var dev = args.dev;
    var watch = args.watch;

    return function webpack(done) {

        var _ = require('lodash');
        var gulp = require('gulp');
        var gutil = require('gulp-util');
        var webpack = require('webpack');
        var webpackConfig;

        if (dev) {
            if (debug) {
                webpackConfig = require('../../../webpack/webpack.build-dev-debug.config');
            }
            else {
                webpackConfig = require('../../../webpack/webpack.build-dev.config');
            }
        }
        else {
            webpackConfig = require('../../../webpack/webpack.build-prod.config');
        }
        
        /* Clone. */
        webpackConfig = _.extend({}, webpackConfig);
        
        webpackConfig.watch = watch;

        webpack(webpackConfig, function(err, stats) {
            if (err) {
                throw new gutil.PluginError('webpack', err);
            }
            gutil.log("[webpack]", stats.toString({
                chunks: false
            }));
            
            if (!watch) {
                done();
            }
        });

    };

};
