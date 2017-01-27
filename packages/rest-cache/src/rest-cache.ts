/**
 *
 * (c) 2013-2017 Wishtack
 *
 * $Id: $
 */

import { Observable } from 'rxjs';

import { Cache } from './cache/cache';
import { Client } from './client/client';
import { Data } from './client/data';
import { Params } from './client/params';
import { Query } from './client/query';
import { Resource } from './cache/resource';
import { ResourceListContainer } from './cache/resource-list-container';
import { CacheMissError } from './cache/cache-miss-error';

export class RestCache {

    private _cache: Cache;
    private _client: Client;
    private _id: string = '';

    constructor({client, cache}: { client: Client, cache?: Cache }) {
        this._cache = cache;
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

        let resourceKey = this._resourceKey({
            path: path,
            params: params,
            query: query
        });

        return this._cacheGet({key: resourceKey})

            /* Parse data from cache. */
            .map((data) => new Resource({
                data: data,
                isFromCache: true
            }))

            /* Handle cache MISS. */
            .catch((error) => {

                /* Let other errors pass through. */
                if (!(error instanceof CacheMissError)) {
                    throw error;
                }

                /* Get data using client. */
                return this._client
                    .get({
                        path: path,
                        params: params,
                        query: query
                    })

                    /* Store data in cache. */
                    .flatMap((data) => this._cacheSet({key: resourceKey, data: data}))

                    /* Map data to `Resource`. */
                    .map((data) => new Resource({
                        data: data,
                        isFromCache: false
                    }));

            });

    }

    getList({path, params, query}: {
        path: string,
        params?: Params,
        query?: Query
    }): Observable<ResourceListContainer> {

        let resourceKey = this._resourceKey({
            path: path,
            params: params,
            query: query
        });

        return this._cacheGet({key: resourceKey})

        /* Parse data from cache. */
            .map((dataListContainer) => new ResourceListContainer({
                data: dataListContainer.data,
                meta: dataListContainer.meta,
                isFromCache: true
            }))

            /* Handle cache MISS. */
            .catch((error) => {

                /* Let other errors pass through. */
                if (!(error instanceof CacheMissError)) {
                    throw error;
                }

                /* Get data using client. */
                return this._client
                    .getList({
                        path: path,
                        params: params,
                        query: query
                    })

                    /* Store data in cache. */
                    .flatMap((dataListContainer) => this._cacheSet({key: resourceKey, data: dataListContainer}))

                    /* Map data to `Resource`. */
                    .map((dataListContainer) => new ResourceListContainer({
                        data: dataListContainer.data,
                        meta: dataListContainer.meta,
                        isFromCache: false
                    }));

            });

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

    private _cacheGet({key}: { key: string }): any {
        return this._cache
            .get({key: key})
            .map((dataString) => this._deserialize({dataString: dataString}));
    }

    private _cacheSet({key, data}: { key: string, data: any }): Observable<any> {
        return this._cache
            .set({key: key, value: this._serialize({data: data})})
            /* For practicality concerns, we return an observable that emits the stored data. */
            .map(() => data);
    }

    private _deserialize({dataString}: { dataString: string }): any {
        return JSON.parse(dataString);
    }

    private _serialize({data}: { data: any }): string {
        return JSON.stringify(data);
    }

    private _resourceKey(args: { path: string, params?: Params, query?: Query }) {
        return JSON.stringify(args);
    }

}
