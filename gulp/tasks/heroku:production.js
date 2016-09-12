/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

module.exports = function herokuProduction(done) {

    var gulp = require('gulp');

    gulp.series('build')(done);

};
