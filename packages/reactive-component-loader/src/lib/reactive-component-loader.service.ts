/**
 *
 * (c) 2013-2018 Wishtack
 *
 * $Id: $
 */

import {
    ComponentFactory,
    Inject,
    Injectable,
    Injector,
    NgModuleFactory,
    NgModuleFactoryLoader,
    Type
} from '@angular/core';
import { defer, Observable, of } from 'rxjs';
import { REACTIVE_COMPONENT_LOADER_MODULE_REGISTRY } from './_internals';
import { ModuleInfo } from './module-info';

export interface ComponentLocation {
    moduleId: string;
    selector: string;
}

export interface ComponentRecipe<T> {
    componentType: Type<T>;
    ngModuleFactory: NgModuleFactory<any>;
}

export function componentNotFoundError(selector: string) {
    return new Error(`Component '<${selector}>' not found.`);
}

export function duplicateModuleDeclarationError(moduleId: string) {
    return new Error(`Module with id '${moduleId}' has been declared more than once with different locations.`);
}

export function moduleNotFoundError(moduleId: string) {
    return new Error(`Module with id '${moduleId}' not found.`);
}

@Injectable({
    providedIn: 'root'
})
export class ReactiveComponentLoader {

    constructor(
        private _injector: Injector,
        private _ngModuleFactoryLoader: NgModuleFactoryLoader,
        @Inject(REACTIVE_COMPONENT_LOADER_MODULE_REGISTRY) private _moduleRegistry: ModuleInfo[]
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

            /* Throws error if:
             * - module not found
             * - or if there's a duplicate module declaration with different locations. */
            const moduleInfo = this._findModuleInfo(moduleId);

            /* Get the module factory. */
            const ngModuleFactory = await this._getModuleFactory(moduleInfo);

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
    private async _getModuleFactory(moduleRegistryItem: ModuleInfo): Promise<NgModuleFactory<any>> {
        return this._ngModuleFactoryLoader.load(moduleRegistryItem.loadChildren);
    }

    private _findModuleInfo(moduleId: string) {

        const moduleInfoList = this._moduleRegistry
            .filter(_moduleInfo => _moduleInfo.moduleId === moduleId);

        const moduleInfo = moduleInfoList[0];

        if (moduleInfo == null) {
            throw moduleNotFoundError(moduleId);
        }

        /* Counting for duplicates but only if they have a different location. */
        const duplicateCount = moduleInfoList
            .filter(_moduleInfo => _moduleInfo.loadChildren !== moduleInfo.loadChildren)
            .length;

        if (duplicateCount > 0) {
            throw duplicateModuleDeclarationError(moduleInfo.moduleId);
        }

        return moduleInfo;

    }

}
