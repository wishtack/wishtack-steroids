/**
 *
 * (c) 2013-2018 Wishtack
 *
 * $Id: $
 */

import { InjectionToken } from '@angular/core';
import { LoadChildrenCallback } from './load-children-callback';

export interface ModuleRegistryItem {
    moduleId: string;
    loadChildren: LoadChildrenCallback;
}

export const REACTIVE_COMPONENT_LOADER_MODULE_REGISTRY =
    new InjectionToken<ModuleRegistryItem>('REACTIVE_COMPONENT_LOADER_MODULE_REGISTRY');
