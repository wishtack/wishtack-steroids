/**
 *
 * (c) 2013-2018 Wishtack
 *
 * $Id: $
 */

import {
    Compiler,
    ComponentFactory,
    Inject,
    Injectable,
    Injector,
    NgModuleFactory,
    Optional,
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
        @Optional() private _compiler: Compiler,
        private _injector: Injector,
        @Inject(REACTIVE_COMPONENT_LOADER_MODULE_REGISTRY) private _moduleRegistry: ModuleRegistryItem[]
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

            /* Get the module factory. */
            const ngModuleFactory = await this._getModuleFactory(moduleRegistryItem);

            /* Create the module. */
            const moduleRef = ngModuleFactory.create(this._injector);

            /* Get the component type. */
            const componentType = this._tryGetComponentType(moduleRef, selector);

            return {
                componentType,
                ngModuleFactory
            };

        });

    }

    /**
     * Try to find component factory with the right selector.
     * @throws error if component not found.
     */
    private _tryGetComponentType(moduleRef, selector: string) {

        const componentFactoryResolver = moduleRef.componentFactoryResolver;

        const componentFactory = Array.from(
            componentFactoryResolver['_factories'].values() as Array<ComponentFactory<any>>
        )
            .find(_componentFactory => _componentFactory.selector === selector);

        if (componentFactory == null) {
            throw componentNotFoundError(selector);
        }

        return componentFactory.componentType;

    }

    /**
     * Compile module or grab compiled module if AOT.
     */
    private async _getModuleFactory(moduleRegistryItem: ModuleRegistryItem): Promise<NgModuleFactory<any>> {

        const moduleTypeOrFactory = await moduleRegistryItem.loadChildren() as any;

        return this._compiler != null ? await this._compiler.compileModuleAsync(moduleTypeOrFactory) : moduleTypeOrFactory;

    }

}
