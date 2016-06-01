/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

/*
 * When testing with webpack and ES6, we have to do some extra
 * things get testing to work right. Because we are gonna write test
 * in ES6 to, we have to compile those as well. That's handled in
 * karma.conf.js with the karma-webpack plugin. This is the entry
 * file for webpack test. Just like webpack will create a bundle.js
 * file for our client, when we run test, it well compile and bundle them
 * all here! Crazy huh. So we need to do some setup
 */
Error.stackTraceLimit = Infinity;


import 'core-js/es6';
import 'core-js/es7/reflect';
import 'zone.js/dist/zone';
import '@angular/platform-browser-dynamic';
import '@angular/core';
import '@angular/common';
import '@angular/http';
import 'rxjs/add/operator/map';

import 'phantomjs-polyfill';

import testing from '@angular/core/testing';
import browser from '@angular/platform-browser-dynamic/testing';

testing.setBaseTestProviders(
    browser.TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
    browser.TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS
);

/*
 Ok, this is kinda crazy. We can use the the context method on
 require that webpack created in order to tell webpack
 what files we actually want to require or import.
 Below, context will be an function/object with file names as keys.
 using that regex we are saying look in ./src/app and ./test then find
 any file that ends with spec.js and get its path. By passing in true
 we say do this recursively
 */
var testContext = require.context('.', true, /\.spec\.ts/);

// get all the files, for each file, call the context function
// that will require the file and load it up here. Context will
// loop and require those spec files here
testContext.keys().forEach(testContext);
