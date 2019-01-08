import { NgComponentOutlet } from '@angular/common';
import {
    Directive,
    DoCheck,
    Injector,
    Input,
    OnChanges,
    OnDestroy,
    SimpleChange,
    SimpleChanges,
    ViewContainerRef
} from '@angular/core';
import { Scavenger } from '@wishtack/rx-scavenger';
import { DynamicComponent, DynamicDirective } from 'ng-dynamic-component';
import { IoService } from 'ng-dynamic-component/dynamic/io.service';
import { ComponentLocation, ComponentRecipe, ReactiveComponentLoader } from '../reactive-component-loader.service';
import { Inputs } from './inputs';
import { Outputs } from './outputs';

@Directive({
    selector: '[wtLazy]',
    providers: [
        IoService
    ]
})
export class LazyDirective implements DoCheck, OnChanges, OnDestroy {

    @Input('wtLazy') location: ComponentLocation;
    @Input() wtLazyInputs: Inputs;
    @Input() wtLazyOutputs: Outputs;

    private _dynamicDirective: DynamicDirective;
    private _ngComponentOutlet: NgComponentOutlet;
    private _scavenger = new Scavenger(this);

    constructor(
        private _reactiveComponentLoader: ReactiveComponentLoader,
        injector: Injector,
        viewContainerRef: ViewContainerRef
    ) {

        const ngComponentOutlet = this._ngComponentOutlet = new NgComponentOutlet(viewContainerRef);

        /* @HACK: This hack wraps `DynamicDirective` hacks.
         * Creating a fake `ComponentOutletInjectorDirective` that will allow
         * `DynamicDirective` to grab `componentRef` from `NgComponentOutlet`. */
        const componentOutletInjector: any = {
            get componentRef() {
                return ngComponentOutlet['_componentRef'];
            }
        };

        this._dynamicDirective = new DynamicDirective(
            injector,
            injector.get(IoService),
            DynamicComponent as any,
            componentOutletInjector
        );

    }

    ngOnChanges(changes: SimpleChanges) {

        if (changes.location) {
            this._onLocationChange(changes.location.isFirstChange());
        }

        if (changes.wtLazyInputs || changes.wtLazyOutputs) {
            this._onInputsAndOutputsChange(
                (changes.wtLazyInputs && changes.wtLazyInputs.isFirstChange())
                || (changes.wtLazyOutputs && changes.wtLazyOutputs.isFirstChange())
            );
        }

    }

    ngOnDestroy() {
        this._ngComponentOutlet.ngOnDestroy();
    }

    ngDoCheck() {
        this._dynamicDirective.ngDoCheck();
    }

    private _onLocationChange(isFirstChange: boolean) {

        this._reactiveComponentLoader.getComponentRecipe(this.location)
            .pipe(this._scavenger.collectByKey('getComponentRecipe'))
            .subscribe(recipe => this._onRecipeChange({
                isFirstChange,
                recipe
            }));

    }

    private _onInputsAndOutputsChange(isFirstChange: boolean) {

        this._dynamicDirective.ngOnChanges({
            ndcDynamicInputs: new SimpleChange(
                this._dynamicDirective.ndcDynamicInputs,
                this._dynamicDirective.ndcDynamicInputs = this.wtLazyInputs,
                isFirstChange
            ),
            ndcDynamicOutputs: new SimpleChange(
                this._dynamicDirective.ndcDynamicOutputs,
                this._dynamicDirective.ndcDynamicOutputs = this.wtLazyOutputs,
                isFirstChange
            )
        });

    }

    private _onRecipeChange({isFirstChange, recipe}: {isFirstChange: boolean, recipe: ComponentRecipe<any>}) {

        const {componentType = null, ngModuleFactory = null} = recipe || {};

        const ngComponentOutletChanges = {
            ngComponentOutlet: new SimpleChange(
                this._ngComponentOutlet.ngComponentOutlet,
                this._ngComponentOutlet.ngComponentOutlet = componentType,
                isFirstChange
            ),
            ngComponentOutletNgModuleFactory: new SimpleChange(
                this._ngComponentOutlet.ngComponentOutletNgModuleFactory,
                this._ngComponentOutlet.ngComponentOutletNgModuleFactory = ngModuleFactory,
                isFirstChange
            )
        };

        this._ngComponentOutlet.ngOnChanges(ngComponentOutletChanges);

    }

}
