/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

var webpackMerge = require('webpack-merge');

/*
 * Config
 */
module.exports = webpackMerge.smart(
    require('./webpack.build-dev.config'),
    require('./webpack.common-debug.config')
);
