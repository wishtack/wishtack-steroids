/**
 *
 * (c) 2013-2017 Wishtack
 *
 * $Id: $
 */

import { Observable } from 'rxjs';

import { Cache } from '../src/cache/cache';
import { CacheMissError } from '../src/cache-bridge/cache-miss-error';
import { Resource } from '../src/resource/resource';
import { ResourceListContainer } from '../src/resource/resource-list-container';
import { Client } from '../src/client/client';
import { DataListContainer } from '../src/client/data-list-container';
import { ResourceDescription } from '../src/resource/resource-description';
import { RestCache } from '../src/rest-cache';

describe('RestCache', () => {

    let cache: Cache;
    let client: Client;

    beforeEach(() => {

        cache = jasmine.createSpyObj('cache', [
            'get',
            'getList',
            'set',
            'setList'
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
        let resourceDescription: ResourceDescription;
        let restCache = new RestCache({
            client: client
        });

        resourceDescription = new ResourceDescription({path: '/blogs/:blogId'});

        ( <jasmine.Spy> client.delete ).and.returnValue(observable);

        expect(restCache.delete({resourceDescription: resourceDescription})).toBe(observable);

    });

    it('should get resource from client on cache miss', () => {

        let data;
        let error;
        let isComplete;
        let resourceDescription: ResourceDescription;
        let resultList = [];
        let restCache: RestCache;

        resourceDescription = new ResourceDescription({path: '/blogs/:blogId'});

        restCache = new RestCache({
            cache: cache,
            client: client
        });

        data = {
            id: 'BLOG_ID_1',
            title: 'BLOG_TITLE_1'
        };

        /* Mocking `cache.get` MISS. */
        ( <jasmine.Spy> cache.get ).and.returnValue(Observable.throw(new CacheMissError()));

        /* Mocking `client.get`. */
        ( <jasmine.Spy> client.get ).and.returnValue(Observable.from([data]));

        /* Mocking `cache.set`. */
        ( <jasmine.Spy> cache.set ).and.returnValue(Observable.from([undefined]));

        restCache.get({
            resourceDescription: resourceDescription,
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
        expect(cache.get).toHaveBeenCalledWith(jasmine.objectContaining({
            resourceDescription: resourceDescription,
            params: {
                blogId: 'BLOG_ID_1'
            }
        }));

        /* Client should be called. */
        expect(client.get).toHaveBeenCalledTimes(1);
        expect(client.get).toHaveBeenCalledWith(jasmine.objectContaining({
            path: '/blogs/:blogId',
            params: {
                blogId: 'BLOG_ID_1'
            }
        }));

        /* Check that data has been saved in cache. */
        expect(cache.set).toHaveBeenCalledTimes(1);
        expect(cache.set).toHaveBeenCalledWith(jasmine.objectContaining({
            resourceDescription: resourceDescription,
            data: data,
            params: {
                blogId: 'BLOG_ID_1'
            }
        }));

    });

    it('should get resource list from client on cache miss', () => {

        let dataListContainer;
        let error;
        let isComplete;
        let resourceDescription: ResourceDescription;
        let resultList = [];
        let restCache: RestCache;

        resourceDescription = new ResourceDescription({path: '/blogs/:blogId'});

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

        /* Mocking `cache.getList` MISS. */
        ( <jasmine.Spy> cache.getList ).and.returnValue(Observable.throw(new CacheMissError()));

        /* Mocking `client.getList`. */
        ( <jasmine.Spy> client.getList ).and.returnValue(Observable.from([dataListContainer]));

        /* Mocking `cache.set`. */
        ( <jasmine.Spy> cache.setList ).and.returnValue(Observable.from([undefined]));

        restCache.getList({
            resourceDescription: resourceDescription,
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
        expect(cache.getList).toHaveBeenCalledTimes(1);
        expect(cache.getList).toHaveBeenCalledWith(jasmine.objectContaining({
            resourceDescription: resourceDescription,
            query: {
                offset: 0,
                limit: 10
            }
        }));

        /* Client should be called. */
        expect(client.getList).toHaveBeenCalledTimes(1);
        expect(client.getList).toHaveBeenCalledWith(jasmine.objectContaining({
            path: '/blogs'
        }));

        /* Check that data has been saved in cache. */
        expect(cache.setList).toHaveBeenCalledTimes(1);
        expect(cache.setList).toHaveBeenCalledWith(jasmine.objectContaining({
            resourceDescription: resourceDescription,
            dataListContainer: dataListContainer,
            query: {
                offset: 0,
                limit: 10
            }
        }));

    });

    it('should not get resource from client on cache hit if refresh is false', () => {

        let data;
        let error;
        let isComplete;
        let resourceDescription: ResourceDescription;
        let resultList = [];
        let restCache: RestCache;

        resourceDescription = new ResourceDescription({path: '/blogs/:blogId'});

        restCache = new RestCache({
            cache: cache,
            client: client
        });

        data = {
            id: 'BLOG_ID_1',
            title: 'BLOG_TITLE_1'
        };

        /* Mocking `cache.get` HIT. */
        ( <jasmine.Spy> cache.get ).and.returnValue(Observable.from([data]));

        restCache.get({
            resourceDescription: resourceDescription,
            params: {
                blogId: 'BLOG_ID_1'
            },
            refresh: false
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
                isFromCache: true,
                data: data,
            })
        ]);

        /* Check that cache has been used. */
        expect(cache.get).toHaveBeenCalledTimes(1);
        expect(cache.get).toHaveBeenCalledWith(jasmine.objectContaining({
            resourceDescription: resourceDescription,
            params: {
                blogId: 'BLOG_ID_1'
            }
        }));

        /* Check that client has not been called. */
        expect(client.get).not.toHaveBeenCalled();

        /* Check that data has not been saved in cache. */
        expect(cache.set).not.toHaveBeenCalled();

    });

    it('should not get resource list from client on cache hit if refresh is false', () => {

        let dataListContainer;
        let error;
        let isComplete;
        let resourceDescription: ResourceDescription;
        let resultList = [];
        let restCache: RestCache;

        resourceDescription = new ResourceDescription({path: '/blogs/:blogId'});

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

        /* Mocking `cache.get` HIT. */
        ( <jasmine.Spy> cache.getList ).and.returnValue(Observable.from([dataListContainer]));

        restCache.getList({
            resourceDescription: resourceDescription,
            query: {
                offset: 0,
                limit: 10
            },
            refresh: false
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
                isFromCache: true,
                data: dataListContainer.data,
                meta: dataListContainer.meta
            })
        ]);

        /* Check that cache has been used. */
        expect(cache.getList).toHaveBeenCalledTimes(1);
        expect(cache.getList).toHaveBeenCalledWith(jasmine.objectContaining({
            resourceDescription: resourceDescription,
            query: {
                offset: 0,
                limit: 10
            }
        }));

        /* Check that client has not been called. */
        expect(client.getList).not.toHaveBeenCalled();

        /* Check that data has not been saved in cache. */
        expect(cache.setList).not.toHaveBeenCalled();

    });

    it('should get resource from client on cache hit if refresh is true', () => {

        let data;
        let dataRefreshed;
        let error;
        let isComplete;
        let resourceDescription: ResourceDescription;
        let resultList = [];
        let restCache: RestCache;

        resourceDescription = new ResourceDescription({path: '/blogs/:blogId'});

        restCache = new RestCache({
            cache: cache,
            client: client
        });

        data = {
            id: 'BLOG_ID_1',
            title: 'BLOG_TITLE_1'
        };

        dataRefreshed = {
            id: 'BLOG_ID_1',
            title: 'BLOG_TITLE_1_UPDATE'
        };

        /* Mocking `cache.get` HIT. */
        ( <jasmine.Spy> cache.get ).and.returnValue(Observable.from([data]));

        /* Mocking `client.get`. */
        ( <jasmine.Spy> client.get ).and.returnValue(Observable.from([dataRefreshed]));

        /* Mocking `cache.set`. */
        ( <jasmine.Spy> cache.set ).and.returnValue(Observable.from([undefined]));

        restCache.get({
            resourceDescription: resourceDescription,
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
                isFromCache: true,
                data: data,
            }),
            new Resource({
                isFromCache: false,
                data: dataRefreshed,
            })
        ]);

        /* Check that cache has been used. */
        expect(cache.get).toHaveBeenCalledTimes(1);
        expect(cache.get).toHaveBeenCalledWith(jasmine.objectContaining({
            resourceDescription: resourceDescription,
            params: {
                blogId: 'BLOG_ID_1'
            }
        }));

        /* Check that client has been called. */
        expect(client.get).toHaveBeenCalledTimes(1);
        expect(client.get).toHaveBeenCalledWith(jasmine.objectContaining({
            path: '/blogs/:blogId',
            params: {
                blogId: 'BLOG_ID_1'
            }
        }));

        /* Check that data has been saved in cache. */
        expect(cache.set).toHaveBeenCalledTimes(1);
        expect(cache.set).toHaveBeenCalledWith(jasmine.objectContaining({
            resourceDescription: resourceDescription,
            data: dataRefreshed,
            params: {
                blogId: 'BLOG_ID_1'
            }
        }));

    });

    it('should get resource list from client on cache hit if refresh is true', () => {

        let dataListContainer;
        let dataListContainerRefreshed;
        let error;
        let isComplete;
        let resourceDescription: ResourceDescription;
        let resultList = [];
        let restCache: RestCache;

        resourceDescription = new ResourceDescription({path: '/blogs/:blogId'});

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

        dataListContainerRefreshed = new DataListContainer({
            data: [
                {
                    id: 'BLOG_ID_1',
                    title: 'BLOG_TITLE_1_UPDATE'
                },
                {
                    id: 'BLOG_ID_2',
                    title: 'BLOG_TITLE_2_UPDATE'
                }
            ],
            meta: {
                offset: 0,
                limit: 10
            }
        });

        /* Mocking `cache.get` HIT. */
        ( <jasmine.Spy> cache.getList ).and.returnValue(Observable.from([dataListContainer]));

        /* Mocking `client.getList`. */
        ( <jasmine.Spy> client.getList ).and.returnValue(Observable.from([dataListContainerRefreshed]));

        /* Mocking `cache.set`. */
        ( <jasmine.Spy> cache.setList ).and.returnValue(Observable.from([undefined]));

        restCache.getList({
            resourceDescription: resourceDescription,
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
                isFromCache: true,
                data: dataListContainer.data,
                meta: dataListContainer.meta
            }),
            new ResourceListContainer({
                isFromCache: false,
                data: dataListContainerRefreshed.data,
                meta: dataListContainerRefreshed.meta
            })
        ]);

        /* Check that cache has been used. */
        expect(cache.getList).toHaveBeenCalledTimes(1);
        expect(cache.getList).toHaveBeenCalledWith(jasmine.objectContaining({
            resourceDescription: resourceDescription,
            query: {
                offset: 0,
                limit: 10
            }
        }));

        /* Check that client has been called. */
        expect(client.getList).toHaveBeenCalledTimes(1);
        expect(client.getList).toHaveBeenCalledWith(jasmine.objectContaining({
            path: '/blogs'
        }));

        /* Check that data has been saved in cache. */
        expect(cache.setList).toHaveBeenCalledTimes(1);
        expect(cache.setList).toHaveBeenCalledWith(jasmine.objectContaining({
            resourceDescription: resourceDescription,
            dataListContainer: dataListContainerRefreshed,
            query: {
                offset: 0,
                limit: 10
            }
        }));

    });

    it('should get resource from client if cache is skipped', () => {

        let data;
        let error;
        let isComplete;
        let resourceDescription: ResourceDescription;
        let resultList = [];
        let restCache: RestCache;

        resourceDescription = new ResourceDescription({path: '/blogs/:blogId'});

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

        /* Mocking `cache.set`. */
        ( <jasmine.Spy> cache.set ).and.returnValue(Observable.from([undefined]));

        restCache.get({
            resourceDescription: resourceDescription,
            params: {
                blogId: 'BLOG_ID_1'
            },
            skipCache: true
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
        expect(cache.get).not.toHaveBeenCalled();

        /* Client should be called. */
        expect(client.get).toHaveBeenCalledTimes(1);
        expect(client.get).toHaveBeenCalledWith(jasmine.objectContaining({
            path: '/blogs/:blogId',
            params: {
                blogId: 'BLOG_ID_1'
            }
        }));

        /* Check that data has been saved in cache. */
        expect(cache.set).toHaveBeenCalledTimes(1);
        expect(cache.set).toHaveBeenCalledWith(jasmine.objectContaining({
            resourceDescription: resourceDescription,
            data: data,
            params: {
                blogId: 'BLOG_ID_1'
            }
        }));

    });

    it('should get resource list from client if cache is skipped', () => {

        let dataListContainer;
        let error;
        let isComplete;
        let resourceDescription: ResourceDescription;
        let resultList = [];
        let restCache: RestCache;

        resourceDescription = new ResourceDescription({path: '/blogs/:blogId'});

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

        /* Mocking `cache.set`. */
        ( <jasmine.Spy> cache.setList ).and.returnValue(Observable.from([undefined]));

        restCache.getList({
            resourceDescription: resourceDescription,
            query: {
                offset: 0,
                limit: 10
            },
            skipCache: true
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
        expect(cache.getList).not.toHaveBeenCalled();

        /* Client should be called. */
        expect(client.getList).toHaveBeenCalledTimes(1);
        expect(client.getList).toHaveBeenCalledWith(jasmine.objectContaining({
            path: '/blogs'
        }));

        /* Check that data has been saved in cache. */
        expect(cache.setList).toHaveBeenCalledTimes(1);
        expect(cache.setList).toHaveBeenCalledWith(jasmine.objectContaining({
            resourceDescription: resourceDescription,
            dataListContainer: dataListContainer,
            query: {
                offset: 0,
                limit: 10
            }
        }));

    });

    it('should update cache when resource is updated', () => {

        let data;
        let error;
        let isComplete;
        let resourceDescription: ResourceDescription;
        let resultList = [];
        let restCache: RestCache;

        resourceDescription = new ResourceDescription({path: '/blogs/:blogId'});

        restCache = new RestCache({
            cache: cache,
            client: client
        });

        data = {
            id: 'BLOG_ID_1',
            title: 'BLOG_TITLE_1'
        };

        /* Mocking `client.patch`. */
        ( <jasmine.Spy> client.patch ).and.returnValue(Observable.from([data]));

        /* Mocking `cache.set`. */
        ( <jasmine.Spy> cache.set ).and.returnValue(Observable.from([undefined]));

        restCache.patch({
            resourceDescription: resourceDescription,
            data: {
                title: 'BLOG_TITLE_1'
            },
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
        expect(cache.get).not.toHaveBeenCalled();

        /* Client should be called. */
        expect(client.patch).toHaveBeenCalledTimes(1);
        expect(client.patch).toHaveBeenCalledWith(jasmine.objectContaining({
            path: '/blogs/:blogId',
            data: {
                title: 'BLOG_TITLE_1'
            },
            params: {
                blogId: 'BLOG_ID_1'
            }
        }));

        /* Check that data has been saved in cache. */
        expect(cache.set).toHaveBeenCalledTimes(1);
        expect(cache.set).toHaveBeenCalledWith(jasmine.objectContaining({
            resourceDescription: resourceDescription,
            data: data,
            params: {
                blogId: 'BLOG_ID_1'
            }
        }));

    });

    it('should add resource to cache when resource is added', () => {

        let data;
        let error;
        let isComplete;
        let resourceDescription: ResourceDescription;
        let resultList = [];
        let restCache: RestCache;

        resourceDescription = new ResourceDescription({path: '/blogs/:blogId'});

        restCache = new RestCache({
            cache: cache,
            client: client
        });

        data = {
            id: 'BLOG_ID_1',
            title: 'BLOG_TITLE_1'
        };

        /* Mocking `client.patch`. */
        ( <jasmine.Spy> client.post ).and.returnValue(Observable.from([data]));

        /* Mocking `cache.set`. */
        ( <jasmine.Spy> cache.set ).and.returnValue(Observable.from([undefined]));

        restCache.post({
            resourceDescription: resourceDescription,
            data: {
                title: 'BLOG_TITLE_1'
            },
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
        expect(cache.get).not.toHaveBeenCalled();

        /* Client should be called. */
        expect(client.post).toHaveBeenCalledTimes(1);
        expect(client.post).toHaveBeenCalledWith(jasmine.objectContaining({
            path: '/blogs/:blogId',
            data: {
                title: 'BLOG_TITLE_1'
            },
            params: {
                blogId: 'BLOG_ID_1'
            }
        }));

        /* Check that data has been saved in cache. */
        expect(cache.set).toHaveBeenCalledTimes(1);
        expect(cache.set).toHaveBeenCalledWith(jasmine.objectContaining({
            resourceDescription: resourceDescription,
            data: data,
            params: {
                blogId: 'BLOG_ID_1'
            }
        }));

    });

});
