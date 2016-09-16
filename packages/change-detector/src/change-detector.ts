/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

import 'core-js';

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
        onChanges = ctrl.$onChanges;

        ctrl.$onChanges = (...args) => {

            this.markForCheck();

            if (onChanges != null) {
                onChanges(...args);
            }

        };

    }

    _restoreWatchers({scope}) {

        let watchers = this._watchersMap[scope.$id] || [];
        
        /* Merge current scope watchers with the saved ones. */
        scope['$$watchers'] = Array.from(new Set([...watchers, ...scope['$$watchers']]));
        
        /* Update watchers count. */
        scope['$$watchersCount'] = scope['$$watchers'].length;
        
        /* Reser watchers backup. */
        this._watchersMap[scope.$id] = [];

        this._applyToChildren({
            action: (scope) => this._restoreWatchers({scope: scope}),
            scope: scope
        });

    }

    _saveWatchers({scope}) {

        this._watchersMap[scope.$id] = scope.$$watchers;
        scope.$$watchers = [];
        scope.$$watchersCount = 0;

        this._applyToChildren({
            action: (scope) => this._saveWatchers({scope: scope}),
            scope: scope
        });

    }

}