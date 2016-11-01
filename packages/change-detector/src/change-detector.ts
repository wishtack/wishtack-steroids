/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

export class ChangeDetector {

    private _scope: angular.IScope;
    private _markedForCheck: boolean = false;
    private _watchersMap = {};

    constructor({scope}) {

        this._scope = scope;

        this._overrideController();

    }

    markForCheck() {

        if (this._markedForCheck) {
            return;
        }

        this._markedForCheck = true;

        this._restoreWatchers({scope: this._scope});

        this._scope['$$postDigest'](() => {
            this._saveWatchers({scope: this._scope});
            this._markedForCheck = false;
        });

    }

    private _applyToChildren({action, scope}) {

        scope = scope.$$childHead;

        while (scope != null) {

            /* Only save/restore scopes without controllers as they are not components but just some directive
             * scopes like ngRepeats' scopes. */
            if (!scope.hasOwnProperty('$ctrl')) {
                action(scope);
            }

            scope = scope.$$nextSibling;

        }

    }

    private _overrideController() {

        let ctrl;
        let onChanges;

        if (!this._scope.hasOwnProperty('$ctrl')) {
            return;
        }

        ctrl = this._scope['$ctrl'];

        if (ctrl.$onChanges != null) {
            onChanges = ctrl.$onChanges.bind(ctrl);
        }

        ctrl.$onChanges = (...args) => {

            this.markForCheck();

            if (onChanges != null) {
                onChanges(...args);
            }

        };

    }

    _restoreWatchers({scope}) {

        let watchers = this._watchersMap[scope.$id];

        /* Nothing to restore. */
        if (watchers != null) {

            /* Merge current scope watchers with the saved ones. */
            scope.$$watchers = Array.from(new Set([...scope.$$watchers, ...watchers]));

            /* Update watchers count. */
            scope.$$watchersCount = scope.$$watchers.length;

            /* Reset watchers backup. */
            this._watchersMap[scope.$id] = null;

        }

        this._applyToChildren({
            action: (scope) => this._restoreWatchers({scope: scope}),
            scope: scope
        });

    }

    _saveWatchers({scope}) {

        /* For some reason `scope.$$watchers` might be null. */
        if (scope.$$watchers != null) {

            this._watchersMap[scope.$id] = [...scope.$$watchers];

            scope.$$watchers = [];

            scope.$$watchersCount = scope.$$watchers.length;

        }

        this._applyToChildren({
            action: (scope) => this._saveWatchers({scope: scope}),
            scope: scope
        });

    }

}