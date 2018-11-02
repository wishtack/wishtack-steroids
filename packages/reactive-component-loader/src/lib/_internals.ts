/**
 *
 * (c) 2013-2018 Wishtack
 *
 * $Id: $
 */

import { InjectionToken } from '@angular/core';
import { ModuleInfo } from './module-info';


export const REACTIVE_COMPONENT_LOADER_MODULE_REGISTRY =
    new InjectionToken<ModuleInfo>('REACTIVE_COMPONENT_LOADER_MODULE_REGISTRY');
