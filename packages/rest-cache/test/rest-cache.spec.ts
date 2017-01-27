/**
 *
 * (c) 2013-2017 Wishtack
 *
 * $Id: $
 */

import { Observable } from 'rxjs';

import { Cache } from '../src/cache/cache';
import { CacheMissError } from '../src/cache/cache-miss-error';
import { Resource } from '../src/cache/resource';
import { ResourceListContainer } from '../src/cache/resource-list-container';
import { Client } from '../src/client/client';
import { DataListContainer } from '../src/client/data-list-container';
import { RestCache } from '../src/rest-cache';

describe('RestCache', () => {

    let cache: Cache;
    let client: Client;

    beforeEach(() => {

        cache = jasmine.createSpyObj('cache', [
            'get',
            'set'
        ]);

        client = jasmine.createSpyObj('client', [
            'delete',
            'get',
            'getList',
            'patch',
            'post'
        ]);

    });

    it('should proxy call to client', () => {

        let observable = Observable.from([]);
        let restCache = new RestCache({
            client: client
        });

        ( <jasmine.Spy> client.delete ).and.returnValue(observable);

        expect(restCache.delete({path: '/'})).toBe(observable);

    });

    it('should get resource from client on cache miss', () => {

        let data;
        let error;
        let isComplete;
        let resultList = [];
        let restCache: RestCache;

        restCache = new RestCache({
            cache: cache,
            client: client
        });

        data = {
            id: 'BLOG_ID_1',
            title: 'BLOG_TITLE_1'
        };

        /* Mocking `client.get`. */
        ( <jasmine.Spy> client.get ).and.returnValue(Observable.from([data]));

        /* Mocking `cache.get` MISS. */
        ( <jasmine.Spy> cache.get ).and.returnValue(Observable.throw(new CacheMissError()));

        /* Mocking `cache.set`. */
        ( <jasmine.Spy> cache.set ).and.returnValue(Observable.from([undefined]));

        restCache.get({
            path: '/blogs/:blogId',
            params: {
                blogId: 'BLOG_ID_1'
            }
        })
            .subscribe(
                (resource) => resultList.push(resource),
                (_error) => error = _error,
                () => isComplete = true
            );

        expect(error).toBeUndefined();
        expect(isComplete).toBe(true);
        expect(resultList).toEqual([
            new Resource({
                isFromCache: false,
                data: data,
            })
        ]);

        /* Check that cache has been used. */
        expect(cache.get).toHaveBeenCalledTimes(1);
        expect(cache.get).toHaveBeenCalledWith({
            key: JSON.stringify({
                path: '/blogs/:blogId',
                params: {
                    blogId: 'BLOG_ID_1'
                }
            })
        });

        /* Check that data has been saved in cache. */
        expect(cache.set).toHaveBeenCalledTimes(1);
        expect(cache.set).toHaveBeenCalledWith({
            key: JSON.stringify({
                path: '/blogs/:blogId',
                params: {
                    blogId: 'BLOG_ID_1'
                }
            }),
            value: JSON.stringify(data)
        });

    });

    it('should get resource list from client on cache miss', () => {

        let dataListContainer;
        let error;
        let isComplete;
        let resultList = [];
        let restCache: RestCache;

        restCache = new RestCache({
            cache: cache,
            client: client
        });

        dataListContainer = new DataListContainer({
            data: [
                {
                    id: 'BLOG_ID_1',
                    title: 'BLOG_TITLE_1'
                },
                {
                    id: 'BLOG_ID_2',
                    title: 'BLOG_TITLE_2'
                }
            ],
            meta: {
                offset: 0,
                limit: 10
            }
        });

        /* Mocking `client.getList`. */
        ( <jasmine.Spy> client.getList ).and.returnValue(Observable.from([dataListContainer]));

        /* Mocking `cache.get` MISS. */
        ( <jasmine.Spy> cache.get ).and.returnValue(Observable.throw(new CacheMissError()));

        /* Mocking `cache.set`. */
        ( <jasmine.Spy> cache.set ).and.returnValue(Observable.from([undefined]));

        restCache.getList({
            path: '/blogs',
            query: {
                offset: 0,
                limit: 10
            }
        })
            .subscribe(
                (resourceListContainer) => resultList.push(resourceListContainer),
                (_error) => error = _error,
                () => isComplete = true
            );

        expect(error).toBeUndefined();
        expect(isComplete).toBe(true);
        expect(resultList).toEqual([
            new ResourceListContainer({
                isFromCache: false,
                data: dataListContainer.data,
                meta: dataListContainer.meta
            })
        ]);

        /* Check that cache has been used. */
        expect(cache.get).toHaveBeenCalledTimes(1);
        expect(cache.get).toHaveBeenCalledWith({
            key: JSON.stringify({
                path: '/blogs',
                query: {
                    offset: 0,
                    limit: 10
                }
            })
        });

        /* Check that data has been saved in cache. */
        expect(cache.set).toHaveBeenCalledTimes(1);
        expect(cache.set).toHaveBeenCalledWith({
            key: JSON.stringify({
                path: '/blogs',
                query: {
                    offset: 0,
                    limit: 10
                }
            }),
            value: JSON.stringify(dataListContainer)
        });

    });

    xit('should forbid missing params', () => {

    });

    xit('should forbid superfluous params', () => {

    });

});
