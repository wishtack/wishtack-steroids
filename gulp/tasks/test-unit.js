/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

module.exports = function testUnit(done) {

    var gulp = require('gulp');

    return gulp.series(
        'test-karma',
        'test-py-unit'
    )(done);

};
