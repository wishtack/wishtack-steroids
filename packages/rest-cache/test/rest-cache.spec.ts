/**
 *
 * (c) 2013-2017 Wishtack
 *
 * $Id: $
 */

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

});
