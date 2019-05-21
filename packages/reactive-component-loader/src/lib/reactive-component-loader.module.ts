/**
 *
 * (c) 2013-2018 Wishtack
 *
 * $Id: $
 */

import { CommonModule } from '@angular/common';
import { ModuleWithProviders, NgModule, NgModuleFactoryLoader, SystemJsNgModuleLoader } from '@angular/core';
import { provideRoutes } from '@angular/router';
import { DynamicModule } from 'ng-dynamic-component';
import { REACTIVE_COMPONENT_LOADER_MODULE_REGISTRY } from './_internals';
import { LazyComponent } from './lazy/lazy.component';
import { ModuleInfo } from './module-info';

export function noMatch() {
    return null;
}

/**
 * @description
 *
 * This module enables module lazy loading outside of a routing context.
 *
 * This is useful for lazy loading components dynamically.
 *
 * 1. To enable the module, the root module should load `ReactiveComponentLoaderModule.forRoot()`.
 *
 * 2. Lazy loaded modules should be declared using `ReactiveComponentLoaderModule.withModule`:
 * ```
 * imports: [
 *     ReactiveComponentLoaderModule.withModule({
 *         moduleId: 'item-list',
 *         loadChildren: './+item-list/item-list.module#ItemListModule'
 *     })
 * ]
 * ```
 *
 * 3. The lazy loaded module should import `ReactiveComponentLoaderModule`
 * otherwise you might end up with an infinite loop in the router
 * when using `PreloadAllModules` preloading strategy.
 *
 */
@NgModule({
    declarations: [
        LazyComponent
    ],
    exports: [
        LazyComponent
    ],
    imports: [
        CommonModule,
        DynamicModule.withComponents([])
    ],
    providers: [
        /* @HACK: Add an empty array to ROUTE token.
         * Otherwise `PreloadAllModules` preloading strategy ends up in infinite loop. */
        provideRoutes([])
    ]
})
export class ReactiveComponentLoaderModule {

    static forRoot() {
        return {
            ngModule: ReactiveComponentLoaderModule,
            providers: [
                {
                    provide: NgModuleFactoryLoader,
                    useClass: SystemJsNgModuleLoader
                }
            ]
        };
    }

    static withModule(moduleInfo: ModuleInfo): ModuleWithProviders {
        return {
            ngModule: ReactiveComponentLoaderModule,
            providers: [
                provideRoutes([
                    {
                        loadChildren: moduleInfo.loadChildren,
                        matcher: noMatch
                    }
                ]),
                {
                    provide: REACTIVE_COMPONENT_LOADER_MODULE_REGISTRY,
                    useValue: moduleInfo,
                    multi: true
                }
            ]
        };
    }

}
