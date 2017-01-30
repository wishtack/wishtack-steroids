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
import { ResourceDescription } from './resource-description';
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

    delete({resourceDescription, params, query}: {
        resourceDescription: ResourceDescription,
        params?: Params,
        query?: Query
    }): Observable<void> {

        return this._client.delete({
            path: resourceDescription.getDetailPath(),
            params: params,
            query: query
        });

    }

    get({resourceDescription, params, query}: {
        resourceDescription: ResourceDescription,
        params?: Params,
        query?: Query
    }): Observable<Resource> {

        let resourceKey = this._resourceKey({
            path: resourceDescription.getDetailPath(),
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
                        path: resourceDescription.getDetailPath(),
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

    getList({resourceDescription, params, query}: {
        resourceDescription: ResourceDescription,
        params?: Params,
        query?: Query
    }): Observable<ResourceListContainer> {

        let resourceKey = this._resourceKey({
            path: resourceDescription.getListPath(),
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
                        path: resourceDescription.getListPath(),
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

    patch({resourceDescription, data, params, query}: {
        resourceDescription: ResourceDescription,
        data: Data,
        params?: Params,
        query?: Query
    }): Observable<Resource> {

        return this._client
            .patch({
                path: resourceDescription.getDetailPath(),
                data: data,
                params: params,
                query: query
            })
            .map((data) => new Resource({
                data: data,
                isFromCache: false
            }));

    }

    post({resourceDescription, data, params, query}: {
        resourceDescription: ResourceDescription,
        data: Data,
        params?: Params,
        query?: Query
    }): Observable<Resource> {

        return this._client
            .post({
                path: resourceDescription.getDetailPath(),
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
