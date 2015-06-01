#!/bin/bash

ENV=$1

if [ $# -lt 1 ]
then
    echo "Usage: $0 test|local|wishtack-dev|wishtack"
    exit 1
fi

if [[ "test local" =~ "${ENV}" ]]
then

    echo "Loading ${ENV} environment."

    $(cat ".env-common" ".env-${ENV}" ".env-${ENV}-secret" \
    | sed 's|^|export |')

    echo "Loaded ${ENV} environment."

else

    echo "Loading heroku app ${ENV} environment."

    $(heroku config --app="${ENV}" \
    | grep -v '^===' \
    | sed 's|: *|=|' \
    | sed 's|^|export |')

    echo "Loaded heroku app ${ENV} environment."

fi

