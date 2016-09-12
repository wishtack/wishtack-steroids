/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

module.exports = function config() {

    var extend = require('node.extend');

    return extend(
        true /* Deep. */,
        {},
        require('./config-default')(),
        require('./config-app')()
    );

};
