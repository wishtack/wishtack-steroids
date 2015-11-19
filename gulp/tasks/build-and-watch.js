/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

module.exports = function buildAndWatch(done) {

    var gulp = require('gulp');

    var build = require('./lib/build');

    return gulp.series(
        build({
            bower: false,
            plumber: true,
            uglify: false
        }),
        'watch'
    )(done);

};
