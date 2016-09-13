/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

const path = require('path')

class KarmaConfigFactory {

    config({specBundleRelativeFilePath}) {

        return {

            browsers: ['PhantomJS'],
            frameworks: ['jasmine'],
            reporters: ['progress'],

            files: [
                'spec-bundle.js'
            ],

            preprocessors: {
                'spec-bundle.js': ['webpack', 'sourcemap']
            },

            webpack: {
                devtool: 'inline-source-map',
                module: {
                    loaders: [
                        {test: /\.ts$/, loader: 'babel!ts'}
                    ]
                }
            }
        };

    }

}

module.exports = function (config) {

    config.set({

        browsers: ['PhantomJS'],
        frameworks: ['jasmine'],
        reporters: ['progress'],

        files: [
            'spec-bundle.js'
        ],

        preprocessors: {
            'spec-bundle.js': ['webpack', 'sourcemap']
        },

        webpack: {
            devtool: 'inline-source-map',
            module: {
                loaders: [
                    {test: /\.ts$/, loader: 'babel!ts-loader'}
                ]
            }
        }
    });

}

module.exports.KarmaConfigFactory = KarmaConfigFactory;