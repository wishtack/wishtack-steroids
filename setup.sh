#!/bin/bash

if [ "$1" == "--global" ]
then

    npm install -g gulpjs/gulp#4.0

else

    npm prune && npm install

fi
