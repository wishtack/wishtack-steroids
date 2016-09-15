/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

const path = require('path');

const WebpackConfigFactory = require('../../config/webpack-config-factory').WebpackConfigFactory;

module.exports = new WebpackConfigFactory().buildConfig({
    entry: path.join(__dirname, 'src/change-detector.module.ts'),
    libraryName: 'change-detector',
    outputPath: path.join(__dirname, 'dist'),
    srcRootPath: path.join(__dirname, 'src')
});
