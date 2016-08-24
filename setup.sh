#!/bin/bash

if [ "$1" == "--global" ]
then

    npm install -g gulpjs/gulp-cli#4.0

else

    npm prune \
        && npm install \
        && bower prune \
        && bower install

fi
