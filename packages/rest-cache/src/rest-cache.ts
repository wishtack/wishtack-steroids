/**
 *
 * (c) 2013-2017 Wishtack
 *
 * $Id: $
 */

import { Observable } from 'rxjs';

import { Client } from './client/client';
import { Data } from './client/data';
import { Params } from './client/params';
import { Query } from './client/query';
import { Resource } from './cache/resource';
import { ResourceListContainer } from './cache/resource-list-container';

export class RestCache {

    private _client: Client;

    constructor({client}: { client: Client }) {
        this._client = client;
    }

    delete({path, params, query}: { path: string, params?: Params, query?: Query }): Observable<void> {

        return this._client.delete({
            path: path,
            params: params,
            query: query
        });

    }

    get({path, params, query}: { path: string, params?: Params, query?: Query }): Observable<Resource> {

        return this._client
            .get({
                path: path,
                params: params,
                query: query
            })
            .map((data) => new Resource({
                data: data,
                isFromCache: false
            }));

    }

    getList({path, params, query}: {
        path: string,
        params?: Params,
        query?: Query
    }): Observable<ResourceListContainer> {

        return this._client
            .getList({
                path: path,
                params: params,
                query: query
            })
            .map((dataListContainer) => new ResourceListContainer({
                data: dataListContainer.data,
                meta: dataListContainer.meta,
                isFromCache: false
            }));

    }

    patch({path, data, params, query}: {
        path: string,
        data: Data,
        params?: Params,
        query?: Query
    }): Observable<Resource> {

        return this._client
            .patch({
                path: path,
                data: data,
                params: params,
                query: query
            })
            .map((data) => new Resource({
                data: data,
                isFromCache: false
            }));

    }

    post({path, data, params, query}: {
        path: string,
        data: Data,
        params?: Params,
        query?: Query
    }): Observable<Resource> {

        return this._client
            .post({
                path: path,
                data: data,
                params: params,
                query: query
            })
            .map((data) => new Resource({
                data: data,
                isFromCache: false
            }));

    }

}
