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

        return this._cache
            .get({key: resourceKey})

            /* Parse data from cache. */
            .map((dataString) => {

                let data = JSON.parse(dataString);

                return new Resource({
                    data: data,
                    isFromCache: true
                });

            })

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

                    /* Store data in cache, wait for it's success and return data. */
                    .flatMap((data) => this._cache
                        .set({
                            key: resourceKey,
                            value: JSON.stringify(data)
                        })
                        .map(() => data)
                    )

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

    private _resourceKey(args: { path: string, params?: Params, query?: Query }) {
        return JSON.stringify(args);
    }

}
