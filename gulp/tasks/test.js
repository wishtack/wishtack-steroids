/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

module.exports = function test(done) {

    var gulp = require('gulp');

    return gulp.series(
        'test-karma',
        'test-py'
    )(done);

};
