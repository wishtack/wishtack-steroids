/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

module.exports = function serve(done) {

    var child_process = require('child_process');
    var gulp = require('gulp');
    var path = require('path');

    var loadenv = require('./lib/loadenv');

    var _runserver = function _runserver(done) {

        child_process.spawn(path.join('node_modules', '.bin', 'http-server'), [], {
            stdio: 'inherit'
        }).once('close', done);

    };

    return gulp.series(
        loadenv(),
        _runserver
    )(done);

};
