/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */


/**
 * Builds the project then runs the server and watches file changes.
 */
module.exports = function start(done) {

    var gulp = require('gulp');

    gulp.parallel(
        'serve',
        'watch'
    )(done);

};
