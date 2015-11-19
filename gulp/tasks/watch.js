/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

module.exports = function buildAndWatch(done) {

    var args = {
        bower: false,
        plumber: true,
        uglify: false
    };

    var gulp = require('gulp');

    var build = require('./lib/build');
    var watch = require('./lib/watch');

    return gulp.series(
        build(args),
        watch(args)
    )(done);

};
