import { NgComponentOutlet } from '@angular/common';
import {
    ComponentRef,
    Directive,
    forwardRef,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChange,
    SimpleChanges,
    ViewContainerRef
} from '@angular/core';
import { Scavenger } from '@wishtack/rx-scavenger';
import { ComponentInjector } from 'ng-dynamic-component';
import { COMPONENT_INJECTOR } from 'ng-dynamic-component/dynamic/component-injector';
import { ComponentLocation, ComponentRecipe, ReactiveComponentLoader } from '../reactive-component-loader.service';

/**
 * @deprecated work in progress.
 */
@Directive({
    selector: '[wtLazy]',
    providers: [
        {
            provide: COMPONENT_INJECTOR,
            useValue: forwardRef(() => LazyDirective)
        }
    ]
})
export class LazyDirective extends NgComponentOutlet implements ComponentInjector, OnChanges, OnDestroy {

    @Input('wtLazy') location: ComponentLocation;

    private _scavenger = new Scavenger(this);

    constructor(
        private _reactiveComponentLoader: ReactiveComponentLoader,
        viewContainerRef: ViewContainerRef
    ) {
        super(viewContainerRef);
    }

    get componentRef(): ComponentRef<any> {
        return this['_componentRef'];
    }

    ngOnChanges(changes: SimpleChanges) {

        if (changes.location) {
            this._onLocationChange(changes.location.isFirstChange());
        }

    }

    ngOnDestroy() {
    }

    private _onLocationChange(isFirstChange: boolean) {

        this._reactiveComponentLoader.getComponentRecipe(this.location)
            .pipe(this._scavenger.collectByKey('getComponentRecipe'))
            .subscribe(recipe => this._onRecipeChange({
                isFirstChange,
                recipe
            }));

    }

    private _onRecipeChange({isFirstChange, recipe}: { isFirstChange: boolean, recipe: ComponentRecipe<any> }) {

        const {componentType = null, ngModuleFactory = null} = recipe || {};

        const ngComponentOutletChanges = {
            ngComponentOutlet: new SimpleChange(
                this.ngComponentOutlet,
                this.ngComponentOutlet = componentType,
                isFirstChange
            ),
            ngComponentOutletNgModuleFactory: new SimpleChange(
                this.ngComponentOutletNgModuleFactory,
                this.ngComponentOutletNgModuleFactory = ngModuleFactory,
                isFirstChange
            )
        };

        super.ngOnChanges(ngComponentOutletChanges);

    }

}

