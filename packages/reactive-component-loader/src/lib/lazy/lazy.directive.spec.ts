/**
 *
 * (c) 2013-2018 Wishtack
 *
 * $Id: $
 */

import { Component, Input, NgModuleFactoryLoader } from '@angular/core';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule, SpyNgModuleFactoryLoader } from '@angular/router/testing';
import { GreetingsModule } from '../../fixtures/greetings.module';
import { ReactiveComponentLoaderModule } from '../reactive-component-loader.module';
import { ComponentLocation } from '../reactive-component-loader.service';
import { Inputs } from './inputs';
import { Outputs } from './outputs';

@Component({
    template: `
        <ng-container
            [wtLazy]="location"
            [ndcDynamicInputs]="inputs"
            [ndcDynamicOutputs]="outputs"></ng-container>
    `
})
export class TestContainerComponent {
    @Input() location: ComponentLocation;
    @Input() inputs: Inputs;
    @Input() outputs: Outputs;
}

xdescribe('[wtLazy] directive', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TestContainerComponent
            ],
            imports: [
                ReactiveComponentLoaderModule.withModule({
                    moduleId: 'greetings',
                    loadChildren: './path/to/greetings.module#GreetingsModule'
                }),
                RouterTestingModule
            ]
        })
            .compileComponents();
    }));

    let spyNgModuleFactoryLoader: SpyNgModuleFactoryLoader;
    beforeEach(() => spyNgModuleFactoryLoader = TestBed.get(NgModuleFactoryLoader));

    beforeEach(() => {
        /* Stubbing the lazy loaded module. */
        spyNgModuleFactoryLoader.stubbedModules = {
            './path/to/greetings.module#GreetingsModule': GreetingsModule
        };
    });

    let component: TestContainerComponent;
    let fixture: ComponentFixture<TestContainerComponent>;
    beforeEach(() => {
        fixture = TestBed.createComponent(TestContainerComponent);
        component = fixture.componentInstance;
        fixture.autoDetectChanges(true);
    });

    it('should lazy load component', fakeAsync(() => {

        component.inputs = {
            name: '@yjaaidi'
        };
        component.location = {
            moduleId: 'greetings',
            selector: 'wt-greetings'
        };

        /* Propagate inputs to `[wtLazy]`. */
        fixture.detectChanges();

        /* Trigger `ReactiveComponentLoader.getComponentRecipe`'s observer. */
        tick();

        expect(fixture.nativeElement.textContent).toEqual('Hello @yjaaidi');

    }));

    it('should reflect location changes', fakeAsync(() => {

        component.inputs = {
            name: '@yjaaidi'
        };
        component.location = {
            moduleId: 'greetings',
            selector: 'wt-greetings'
        };

        /* Propagate inputs to `[wtLazy]` and trigger `ReactiveComponentLoader.getComponentRecipe`'s observer. */
        fixture.detectChanges();
        tick();

        component.location = {
            moduleId: 'greetings',
            selector: 'wt-bye'
        };

        /* Propagate inputs to `[wtLazy]` and trigger `ReactiveComponentLoader.getComponentRecipe`'s observer. */
        fixture.detectChanges();
        tick();

        expect(fixture.nativeElement.textContent).toEqual('Bye @yjaaidi');

    }));

    it('should reflect input changes', fakeAsync(() => {


        component.inputs = {
            name: '@yjaaidi'
        };
        component.location = {
            moduleId: 'greetings',
            selector: 'wt-greetings'
        };

        /* Propagate inputs to `[wtLazy]` and trigger `ReactiveComponentLoader.getComponentRecipe`'s observer. */
        fixture.detectChanges();
        tick();

        component.inputs = {
            name: 'Wishtack.io'
        };

        fixture.detectChanges();

        expect(fixture.nativeElement.textContent).toEqual('Hello Wishtack.io');

    }));

});
