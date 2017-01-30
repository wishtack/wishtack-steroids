/**
 *
 * (c) 2013-2017 Wishtack
 *
 * $Id: $
 */

export class ResourceDescription {

    private _path: string;

    constructor({path}: { path: string }) {
        this._path = path;
    }

    getDetailPath() {
        return this._path;
    };

    getListPath() {
        return this._path.replace(/\/:[^/]+$/, '');
    }

}
