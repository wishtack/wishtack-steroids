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

/**
 * @description
 *
 * This module enables module lazy loading outside of a routing context.
 *
 * This is useful for lazy loading components dynamically.
 *
 * 1. To enable the module, the root module should load `DynamicComponentLoaderModule.forRoot()`.
 *
 * 2. Lazy loaded modules should be declared using `DynamicComponentLoaderModule.declareModule`:
 * ```
 * imports: [
 *     DynamicComponentLoaderModule.declareModule({
 *         moduleId: 'item-list',
 *         modulePath: './+item-list/item-list.module#ItemListModule'
 *     })
 * ]
 * ```
 *
 * 3. The lazy loaded module should import `DynamicComponentLoaderModule` otherwise you might end up with an infinite loop in the router
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

    static forRoot(): ModuleWithProviders {
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

    /**
     * @param args.id a unique id for the module.
     * @param args.path the module's path (e.g.: '../path/to/my-module.module#MyModule').
     */
    static declareModule(args: { moduleId: string, modulePath: string }): ModuleWithProviders {

        return {
            ngModule: ReactiveComponentLoaderModule,
            providers: [
                provideRoutes([{
                    path: args.modulePath,
                    loadChildren: args.modulePath
                }]),
                {
                    provide: REACTIVE_COMPONENT_LOADER_MODULE_REGISTRY,
                    useValue: args,
                    multi: true
                }
            ]
        };
    }

}
