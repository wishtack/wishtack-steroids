import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { ComponentLocation, ComponentRecipe, ReactiveComponentLoader } from '../reactive-component-loader.service';
import { Inputs } from './inputs';
import { Outputs } from './outputs';

@Component({
    selector: 'wt-lazy',
    templateUrl: './lazy.component.html'
})
export class LazyComponent implements OnChanges {

    @Input() location: ComponentLocation;
    @Input() inputs: Inputs;
    @Input() outputs: Outputs;

    componentRecipe$: Observable<ComponentRecipe<any>>;

    constructor(private _dynamicComponentLoader: ReactiveComponentLoader) {
    }

    ngOnChanges(changes: SimpleChanges) {

        if (changes.location != null) {
            this.componentRecipe$ = this._dynamicComponentLoader.getComponentRecipe(this.location);
        }

    }

}
