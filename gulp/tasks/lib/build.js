/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

module.exports = function buildFactory(args) {

    return function build(done) {

        var gulp = require('gulp');

        var buildApp = require('./build-app');

        return gulp.series(
            buildApp(args)
        )(done);

    };

};
