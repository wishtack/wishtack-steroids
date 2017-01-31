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

        if (skipCache === true) {
            return this._getFromClient(args);
        }

        return this._cache.get(args)

            /* Parse data from cache. */
            .map((data) => new Resource({
                data: data,
                isFromCache: true
            }))

            /* Refresh data using client. */
            .flatMap((resource) => {

                let observableList = [
                    Observable.from([resource])
                ];

                /* Refresh data using client if asked for. */
                if (refresh === true) {
                    observableList.push(this._getFromClient(args));
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
                return this._getFromClient(args);

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

        if (skipCache === true) {
            return this._getListFromClient(args);
        }

        return this._cache.getList(args)

            /* Parse data from cache. */
            .map((dataListContainer) => new ResourceListContainer({
                data: dataListContainer.data,
                meta: dataListContainer.meta,
                isFromCache: true
            }))

            /* Refresh data using client. */
            .flatMap((resourceListContainer) => {

                let observableList = [
                    Observable.from([resourceListContainer])
                ];

                /* Refresh data using client if asked for. */
                if (refresh === true) {
                    observableList.push(this._getListFromClient(args));
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
                return this._getListFromClient(args);

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
