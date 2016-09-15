/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

const path = require('path');

const WebpackConfigFactory = require('./webpack-config-factory').WebpackConfigFactory;


class KarmaConfigFactory {

    config({specBundleRelativeFilePath, srcRootPath}) {

        return {

            browsers: ['PhantomJS'],
            frameworks: ['jasmine'],
            reporters: ['progress'],

            files: [
                specBundleRelativeFilePath
            ],

            preprocessors: {
                [specBundleRelativeFilePath]: ['webpack', 'sourcemap']
            },

            webpack: new WebpackConfigFactory().testConfig({
                srcRootPath: srcRootPath
            })
        };

    }

}

module.exports.KarmaConfigFactory = KarmaConfigFactory;