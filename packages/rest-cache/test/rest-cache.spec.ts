/**
 *
 * (c) 2013-2016 Wishtack
 *
 * $Id: $
 */

import { RestCache } from '../src/rest-cache';

describe('RestCache', function () {

    it('should proxy client', () => {

        expect(new RestCache()).not.toBeUndefined();

    });

});
