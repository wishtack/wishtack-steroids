
# Gulp tasks.

```shell
gulp build # Build project with uglification.
gulp build-and-watch # Builds the project and watches for changes but disables uglification.
gulp bump --type=patch|minor|major # Bump application version.
gulp runserver # Only runs the Django server.
gulp start # Builds the app and then runs the server and watches for changes in parallel.
```

# Tricks.

## Load environment before running commands like './manage.py'.
```shell
. export_env.sh test|local|dev|prod
```
