/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

import 'core-js';

import {ChangeDetectorProvider} from './change-detector-provider';

const module = angular.module('wishtack.steroids.changeDetector', []);

module.provider('ChangeDetector', ChangeDetectorProvider);
