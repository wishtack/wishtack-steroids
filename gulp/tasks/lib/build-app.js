/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

module.exports = function buildAppFactory(args) {

    return function buildApp(done) {

        var gulp = require('gulp');

        var config = require('../../config')();
        var loadenv = require('./loadenv');
        var webpack = require('./webpack');

        return gulp.series(
            /* Load environment before building as we might cross-env build the project.
             * I.e.: Build the production project on local machine using 'gulp build --env=prod'. */
            loadenv(),
            'typings-install',
            webpack(args),
            'cache-manifest'
        )(done);

    };

};
