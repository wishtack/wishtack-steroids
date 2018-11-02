import { NgComponentOutlet } from '@angular/common';
import { Directive, Input, OnChanges, OnDestroy, SimpleChange, SimpleChanges, ViewContainerRef } from '@angular/core';
import { Scavenger } from '@wishtack/rx-scavenger';
import { ComponentLocation, ComponentRecipe, ReactiveComponentLoader } from '../reactive-component-loader.service';
import { Inputs } from './inputs';
import { Outputs } from './outputs';

@Directive({
    selector: '[wtLazy]'
})
export class LazyDirective implements OnChanges, OnDestroy {

    @Input('wtLazy') location: ComponentLocation;
    @Input() wtLazyInputs: Inputs;
    @Input() wtLazyOutputs: Outputs;

    private _ngComponentOutlet: NgComponentOutlet;
    private _scavenger = new Scavenger(this);

    constructor(
        private _reactiveComponentLoader: ReactiveComponentLoader,
        private _viewContainerRef: ViewContainerRef
    ) {
        this._ngComponentOutlet = new NgComponentOutlet(this._viewContainerRef);
    }

    ngOnChanges(changes: SimpleChanges) {

        if (changes.location) {
            this._onLocationChange();
        }

    }

    ngOnDestroy() {
        this._ngComponentOutlet.ngOnDestroy();
    }

    private _onLocationChange() {

        this._reactiveComponentLoader.getComponentRecipe(this.location)
            .pipe(this._scavenger.collectByKey('getComponentRecipe'))
            .subscribe(recipe => this._onRecipeChange(recipe));

    }

    private _onRecipeChange(recipe: ComponentRecipe<any>) {

        const {componentType = null, ngModuleFactory = null} = recipe || {};

        const ngComponentOutletChanges = {
            ngComponentOutlet: new SimpleChange(
                this._ngComponentOutlet.ngComponentOutlet,
                this._ngComponentOutlet.ngComponentOutlet = componentType,
                false
            ),
            ngComponentOutletNgModuleFactory: new SimpleChange(
                this._ngComponentOutlet.ngComponentOutletNgModuleFactory,
                this._ngComponentOutlet.ngComponentOutletNgModuleFactory = ngModuleFactory,
                false
            )
        };
        this._ngComponentOutlet.ngOnChanges(ngComponentOutletChanges);

    }

}
