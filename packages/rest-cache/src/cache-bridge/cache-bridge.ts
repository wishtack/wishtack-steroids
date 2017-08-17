/**
 *
 * (c) 2013-2017 Wishtack
 *
 * $Id: $
 */

import { Observable } from 'rxjs/Observable';

export interface CacheBridge {

    get(args: {key: string}): Observable<string>;
    set(args: {key: string, value: string}): Observable<void>;

}
