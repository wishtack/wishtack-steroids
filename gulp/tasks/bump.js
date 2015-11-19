/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

module.exports = function version() {

    var gulp = require('gulp');
    var minimist = require('minimist');
    var path = require('path');

    var plugins = require('../plugins');

    var options = minimist(process.argv.slice(2), {
        string: ['type']
    });

    return gulp.src(['bower.json', 'package.json'])
        .pipe(plugins.bump({type: options.type}))
        .pipe(gulp.dest('./'));

};
