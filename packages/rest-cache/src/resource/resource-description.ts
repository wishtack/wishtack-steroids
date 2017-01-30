/**
 *
 * (c) 2013-2017 Wishtack
 *
 * $Id: $
 */

import { Params } from '../client/params';
import { BaseError } from '../errors/base-error';

export class InvalidResourcePathError extends BaseError {

    constructor({path}: {path: string}) {
        super(`Invalid resource path: '${path}'.`);
    }

}

export class ResourcePath {
    detailPath: string;
    listPath: string;
    paramKey: string;
}

export class ResourceDescription {

    private static _PATH_PARAM_REGEX = /\/:([^/]+)$/;

    private _path: string;
    private _resourcePath: ResourcePath;

    constructor({path}: { path: string }) {
        this._path = path;
    }

    getDetailPath() {
        return this._getResourcePath().detailPath;
    };

    getListPath() {
        return this._getResourcePath().listPath;
    }

    getParamKey(): string {
        return this._getResourcePath().paramKey;
    }

    interpolateDetailPath({params}: { params: Params }) {

        let paramKey = this.getParamKey();

        return this.getDetailPath().replace(`:${paramKey}`, params[paramKey]);

    }

    interpolateListPath({params}: { params: Params }) {
        return this.getListPath();
    }

    private _getResourcePath(): ResourcePath {

        let resourcePath;
        let match;

        if (this._resourcePath != null) {
            return this._resourcePath;
        }

        resourcePath = new ResourcePath();
        match = this._path.match(ResourceDescription._PATH_PARAM_REGEX);

        if (match == null) {
            throw new InvalidResourcePathError({path: this._path});
        }

        resourcePath.detailPath = this._path;
        resourcePath.listPath = this._path.replace(ResourceDescription._PATH_PARAM_REGEX, '');
        resourcePath.paramKey = match[1];

        return this._resourcePath = resourcePath;

    }
}
