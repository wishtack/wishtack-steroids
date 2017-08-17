
import 'core-js/es6/array';
import 'core-js/es6/set';

import 'angular';
import 'angular-mocks';

const context = require.context(__dirname, true, /\.spec\.ts$/);
context.keys().forEach(context);
