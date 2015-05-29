/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

var _ = require('underscore');
var gulp = require('gulp');
var requireDir = require('require-dir');

_.forEach(requireDir('./gulp/tasks'), function (task, taskName) {

    gulp.task(taskName, task);

});
