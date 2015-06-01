#!/bin/bash

if [ "$1" == "--global" ]
then

    npm install -g gulpjs/gulp-cli#4.0 \
        && pip install -r requirements.txt -r requirements-dev.txt

else

    npm prune \
        && npm install \
        && bower prune \
        && bower install

fi
