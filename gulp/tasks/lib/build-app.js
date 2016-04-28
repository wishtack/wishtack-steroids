/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

module.exports = function buildAppFactory(args) {

    var NamedParameters = require('named-parameters').NamedParameters;

    args = new NamedParameters(args)
        .default('bower', true)
        .default('uglify', true)
        .default('watch', false)
        .values();

    var bower = args.bower;
    var uglify = args.uglify;
    var watch = args.watch;

    return function buildApp(done) {

        var gulp = require('gulp');

        var config = require('../../config')();
        var plugins = require('../../plugins');
        var loadenv = require('./loadenv');
        var webpack = require('./webpack');

        return gulp.series(
            /* Load environment before building as we might cross-env build the project.
             * I.e.: Build the production project on local machine using 'gulp build --env=prod'. */
            loadenv(),
            bower ? ['bower'] : [],
            webpack({
                uglify: uglify,
                watch: watch
            }),
            'cache-manifest'
        )(done);

    };

};
