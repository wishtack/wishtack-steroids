/**
 *
 * (c) 2013-2018 Wishtack
 *
 * $Id: $
 */

import { Type } from '@angular/core';

export type ModuleLoaderCallback = () => Type<any> | Promise<Type<any>>;
