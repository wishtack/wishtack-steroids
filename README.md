# Setup

```shell
apt-get install mongodb npm

# Install gulp & Python dependencies globally. MUST BE RUN AS ROOT!
sudo ./setup.sh --global

# Install node dependencies and bower dependencies from scratch.
./setup.sh
```

# Gulp tasks

```shell
gulp build # Build project with uglification.
gulp build-and-watch # Builds the project and watches for changes but disables uglification.
gulp bump --type=patch|minor|major # Bump application version.
gulp runserver # Only runs the Django server.
gulp start # Builds the app and then runs the server and watches for changes in parallel.
gulp test # Run all tests.
gulp test-karma [--watch] # Run karma tests. '--watch' keeps running tests after each file change.
gulp test-protractor [--test-protractor-path=PROTRACTOR_TEST_PATH] # Run protractor tests.
gulp test-py # Run all python tests.
gulp test-py-integration # Run python integration tests.
gulp test-py-unit # Run python unit tests.
gulp test-unit # Run karma and python unit tests.
```

# Tricks.

## Load environment before running commands like './manage.py'.
```shell
. export_env.sh test|local|dev|prod
```
