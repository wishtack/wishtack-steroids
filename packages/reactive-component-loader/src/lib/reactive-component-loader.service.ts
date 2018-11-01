/**
 *
 * (c) 2013-2018 Wishtack
 *
 * $Id: $
 */

import {
    ComponentFactory,
    ComponentFactoryResolver,
    Inject,
    Injectable,
    Injector,
    NgModuleFactory,
    NgModuleFactoryLoader,
    Type
} from '@angular/core';
import { defer, Observable, of } from 'rxjs';
import { ModuleRegistryItem, REACTIVE_COMPONENT_LOADER_MODULE_REGISTRY } from './_internals';

export interface ComponentLocation {
    moduleId: string;
    selector: string;
}

export interface ComponentRecipe<T> {
    componentType: Type<T>;
    ngModuleFactory: NgModuleFactory<any>;
}

export function moduleNotFoundError(moduleId: string) {
    return new Error(`Module with id '${moduleId}' not found.`);
}

export function componentNotFoundError(selector: string) {
    return new Error(`Component '<${selector}>' not found.`);
}

@Injectable({
    providedIn: 'root'
})
export class ReactiveComponentLoader {

    constructor(
        @Inject(REACTIVE_COMPONENT_LOADER_MODULE_REGISTRY) private _moduleRegistry: ModuleRegistryItem[],
        private _injector: Injector,
        private _componentFactoryResolver: ComponentFactoryResolver,
        private _ngModuleFactoryLoader: NgModuleFactoryLoader
    ) {
    }

    /**
     * @param componentLocation The location of the component to load.
     * @return an `Observable` emitting the `ComponentRecipe` (`componentType` + `ngModuleFactory`)
     * that can be used with `*ngComponentOutlet`.
     */
    getComponentRecipe<T = any>(componentLocation: ComponentLocation): Observable<ComponentRecipe<T>> {

        if (componentLocation == null) {
            return of(null);
        }

        return defer(async () => {

            const {moduleId, selector} = componentLocation;

            /* @TODO: Trigger error if multiple modules with same id and different pathes. */
            const moduleRegistryItem = this._moduleRegistry
                .find(_moduleRegistryItem => _moduleRegistryItem.moduleId === moduleId);

            if (moduleRegistryItem == null) {
                throw moduleNotFoundError(moduleId);
            }

            const ngModuleFactory = await this._ngModuleFactoryLoader.load(moduleRegistryItem.modulePath);

            const moduleRef = ngModuleFactory.create(this._injector);

            const componentFactoryResolver = moduleRef.componentFactoryResolver;

            const componentFactory = Array.from(
                componentFactoryResolver['_factories'].values() as Array<ComponentFactory<any>>
            )
                .find(_componentFactory => _componentFactory.selector === selector);

            if (componentFactory == null) {
                throw componentNotFoundError(selector);
            }

            return {
                componentType: componentFactory.componentType,
                ngModuleFactory
            };

        });

    }

}
