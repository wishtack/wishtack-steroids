/**
 *
 * (c) 2013-2017 Wishtack
 *
 * $Id: $
 */

import { Observable } from 'rxjs';

import { CacheMissError } from './cache-bridge/cache-miss-error';
import { Cache } from './cache/cache';
import { Client } from './client/client';
import { Data } from './client/data';
import { Params } from './client/params';
import { Query } from './client/query';
import { Resource } from './resource/resource';
import { ResourceDescription } from './resource/resource-description';
import { ResourceListContainer } from './resource/resource-list-container';

export class RestCache {

    private _cache: Cache;
    private _client: Client;

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

    get({resourceDescription, params, query, refresh = true, skipCache = false}: {
        resourceDescription: ResourceDescription,
        params?: Params,
        query?: Query,
        refresh?: boolean,
        skipCache?: boolean
    }): Observable<Resource> {

        let args = {resourceDescription, params, query, refresh, skipCache};

        /* Cache logic is in `_getResourceOrList` but the way to retrieve data from cache and client are in
         * `getFromCache` and `getFromClient`. */
        return this._getResourceOrList<Resource>({
            getFromCache: () => this._cache.get(args).map((data) => new Resource({
                data: data,
                isFromCache: true
            })),
            getFromClient: () => this._getFromClient(args),
            refresh: refresh,
            skipCache: skipCache
        });

    }

    getList({resourceDescription, params, query, refresh = true, skipCache = false}: {
        resourceDescription: ResourceDescription,
        params?: Params,
        query?: Query,
        refresh?: boolean,
        skipCache?: boolean
    }): Observable<ResourceListContainer> {

        let args = {resourceDescription, params, query, refresh, skipCache};

        /* Cache logic is in `_getResourceOrList` but the way to retrieve data from cache and client are in
         * `getFromCache` and `getFromClient`. */
        return this._getResourceOrList<ResourceListContainer>({
            getFromCache: () => this._cache.getList(args).map((dataListContainer) => new ResourceListContainer({
                data: dataListContainer.data,
                meta: dataListContainer.meta,
                isFromCache: true
            })),
            getFromClient: () => this._getListFromClient(args),
            refresh: refresh,
            skipCache: skipCache
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
            /* Store data in cache. */
            .flatMap((data) => this._cache
                .set({
                    resourceDescription: resourceDescription,
                    data: data,
                    params: params,
                    query: query
                })
                /* Observable should emit the received data. */
                .map(() => data)
            )
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
            /* Store data in cache. */
            .flatMap((data) => this._cache
                .set({
                    resourceDescription: resourceDescription,
                    data: data,
                    params: params,
                    query: query
                })
                /* Observable should emit the received data. */
                .map(() => data)
            )
            .map((data) => new Resource({
                data: data,
                isFromCache: false
            }));

    }

    /**
     *
     * This private method contains all the common logic of `RestCache.get` and `RestCache.getList`.
     * 1 - If `skipCache` is true, return resource or resource list from client.
     * 2 - Get resource or resource list from cache.
     * 3 - If `refresh` is true and on cache HIT, the observable will emit two values, the one from the cache
     * then the one from the client.
     * 4 - On cache miss, emit resource or resource list from client.
     *
     * @param getFromCache: A callable that returns a resource or resource list observable from cache.
     * @param getFromClient: A callable that returns a resource or resource list observable from client.
     * @param refresh
     * @param skipCache
     */
    private _getResourceOrList<T>({
        getFromCache,
        getFromClient,
        refresh,
        skipCache
    }: {
        getFromCache: () => Observable<T>,
        getFromClient: () => Observable<T>,
        refresh: boolean,
        skipCache: boolean
    }): Observable<T> {

        if (skipCache === true) {
            return getFromClient();
        }

        return getFromCache()

            /* Refresh data using client. */
            .flatMap((resource) => {

                let observableList = [
                    Observable.from([resource])
                ];

                /* Refresh data using client if asked for. */
                if (refresh === true) {
                    observableList.push(getFromClient());
                }

                return Observable.concat(...observableList);

            })
            /* Handle cache MISS. */
            .catch((error) => {

                /* Let other errors pass through. */
                if (!(error instanceof CacheMissError)) {
                    throw error;
                }

                /* Get data using client. */
                return getFromClient();

            });

    }

    private _getFromClient({resourceDescription, params, query}: {
        resourceDescription: ResourceDescription,
        params: Params,
        query: Query
    }): Observable<Resource> {

        return this._client
            .get({
                path: resourceDescription.getDetailPath(),
                params: params,
                query: query
            })

            /* Store data in cache. */
            .flatMap((data) => {

                return this._cache
                    .set({
                        resourceDescription: resourceDescription,
                        data: data,
                        params: params,
                        query: query
                    })

                    /* Map `Data` to `Resource`. */
                    .map(() => new Resource({
                        data: data,
                        isFromCache: false
                    }));

            });

    }

    private _getListFromClient({resourceDescription, params, query}: {
        resourceDescription: ResourceDescription,
        params: Params,
        query: Query
    }): Observable<ResourceListContainer> {

        return this._client
            .getList({
                path: resourceDescription.getListPath(),
                params: params,
                query: query
            })

            /* Store data in cache. */
            .flatMap((dataListContainer) => {

                return this._cache
                    .setList({
                        resourceDescription: resourceDescription,
                        dataListContainer: dataListContainer,
                        params: params,
                        query: query
                    })

                    /* Map `DataListContainer` to `ResourceListContainer`. */
                    .map(() => new ResourceListContainer({
                        data: dataListContainer.data,
                        meta: dataListContainer.meta,
                        isFromCache: false
                    }));

            });

    }

}
