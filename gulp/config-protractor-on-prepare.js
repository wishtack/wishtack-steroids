/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */

var dejavu = require('dejavu');


var ProtractorOnPrepare = dejavu.Class.declare({

    $name: 'ProtractorOnPrepare',

    run: function run() {

        var colors = require('colors/safe');

        var ConsoleReporter = require('../test/protractor/lib/console-reporter');

        /* Force colors. */
        colors.enabled = true;

        /* Enable custom console reporter. */
        jasmine.getEnv().addReporter(new ConsoleReporter());

    }

});

new ProtractorOnPrepare().run();
