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
        .values();

    var bower = args.bower;

    return function buildApp(done) {

        var gulp = require('gulp');

        var config = require('../../config')();
        var plugins = require('../../plugins');
        var loadenv = require('./loadenv');

        return gulp.series(
            /* Load environment before building as we might cross-env build the project.
             * I.e.: Build the production project on local machine using 'gulp build --env=prod'. */
            loadenv(),
            bower ? ['bower'] : [],
            'webpack',
            'cache-manifest'
        )(done);

    };

};
