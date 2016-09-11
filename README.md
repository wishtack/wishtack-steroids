# Setup

```shell
apt-get install npm

# Install gulp & Python dependencies globally. MUST BE RUN AS ROOT!
sudo ./setup.sh --global

# Install node dependencies and bower dependencies from scratch.
./setup.sh

gulp start
```

# Heroku setup.

```shell
heroku buildpacks:set https://github.com/ddollar/heroku-buildpack-multi.git
heroku config:set NODE_ENV=production
```

# Gulp tasks

```shell
gulp build # Build project with uglification.
gulp bump --type=patch|minor|major # Bump application version.
gulp start # Builds the app and then runs the server and watches for changes in parallel.
gulp test # Run all tests.
gulp test-karma [--watch] # Run karma tests. '--watch' keeps running tests after each file change.
gulp test-protractor [--test-protractor-path=PROTRACTOR_TEST_PATH] # Run protractor tests.
gulp watch [--debug] # Builds the project and watches for changes but disables uglification. Debug options enables source-map.
```

# Tricks.

## Load environment before running commands like './manage.py'.
```shell
. export_env.sh test|local|dev|prod
```
