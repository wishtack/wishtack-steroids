/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

module.exports = function watchFactory(args) {

    var gulp = require('gulp');

    var config = require('../../config')();
    var plugins = require('../../plugins');
    var buildApp = require('./build-app');

    var reload = function reload() {
        plugins.livereload.reload('/');
    };

    var buildAppAndReload = gulp.series(
        buildApp(args),
        reload
    );

    return function watch(done) {

        /* Start livereload. */
        plugins.livereload.listen({port: 8729});

        gulp.watch(config.appAngularPattern, buildAppAndReload);
        gulp.watch(config.appDjangoTemplatesPattern, buildAppAndReload);
        gulp.watch(config.bowerJsonPath, gulp.series('bower'));

    };

};

