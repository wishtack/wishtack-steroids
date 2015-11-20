/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

module.exports = function cacheManifest() {

    var config = require('../config')();
    var plugins = require('../plugins');
    var gulp = require('gulp');

    return gulp.src(
        [
            config.distAssetsPattern
        ],
        {
            base: 'dist'
        })
        .pipe(plugins.manifest({
            cache: [
                '/'
            ],
            hash: true,
            preferOnline: true,
            prefix: '/',
            network: ['*'],
            filename: 'cache.manifest',
            exclude: 'cache.manifest'
        }))
        .pipe(gulp.dest(config.distAssetsPath));

};
