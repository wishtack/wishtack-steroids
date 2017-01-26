/**
 *
 * (c) 2013-2017 Wishtack
 *
 * $Id: $
 */

import { Observable } from 'rxjs';

import { Client } from '../src/client/client';
import { RestCache } from '../src/rest-cache';

describe('RestCache', () => {

    let client: Client;

    beforeEach(() => {

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

});
