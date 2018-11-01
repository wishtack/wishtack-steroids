/**
 *
 * (c) 2013-2018 Wishtack
 *
 * $Id: $
 */

import { InjectionToken } from '@angular/core';

export interface ModuleRegistryItem {
    moduleId: string;
    modulePath: string;
}

export const REACTIVE_COMPONENT_LOADER_MODULE_REGISTRY =
    new InjectionToken<ModuleRegistryItem>('REACTIVE_COMPONENT_LOADER_MODULE_REGISTRY');
