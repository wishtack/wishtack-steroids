/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

var colors = require('colors/safe');
var dejavu = require('dejavu');

var ConsoleReporter = dejavu.Class.declare({

    $name: 'ConsoleReporter',

    $constants: {
        _STATUS_COLOR_DICT: {
            passed: 'green',
            failed: 'red'
        }
    },

    specDone: function specDone(result) {

        var color = this.$static._STATUS_COLOR_DICT[result.status];

        colors.enabled = true;

        if (color !== undefined) {
            console.log(colors[color]('\n' + result.fullName));
        }

    }

});

module.exports = ConsoleReporter;
