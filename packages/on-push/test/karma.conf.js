/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

const path = require('path');

const KarmaConfigFactory = require('../../../config/karma-config-factory').KarmaConfigFactory;

module.exports = (config) => {
    config.set(new KarmaConfigFactory().config({
        specBundleRelativeFilePath: path.join(__dirname, 'spec-bundle.js')
    }));
};