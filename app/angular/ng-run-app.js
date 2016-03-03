/**
 *
 * (c) 2013-2015 Wishtack
 *
 * $Id: $
 */


import User from './user';

let angular = require('angular');

angular.module('app').run(function () {

    new User().name();

});
