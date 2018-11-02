/**
 *
 * (c) 2013-2018 Wishtack
 *
 * $Id: $
 */

import { NgModuleFactoryLoader } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule, SpyNgModuleFactoryLoader } from '@angular/router/testing';
import { GreetingsComponent, GreetingsModule } from '../fixtures/greetings.module';
import { ReactiveComponentLoaderModule } from './reactive-component-loader.module';
import { ReactiveComponentLoader } from './reactive-component-loader.service';
import Spy = jasmine.Spy;


describe('ReactiveComponentLoader', () => {

    let error: Spy;
    let next: Spy;

    beforeEach(() => {
        error = jasmine.createSpy('error');
        next = jasmine.createSpy('next');
    });

    describe('with one module', () => {

        beforeEach(() => TestBed.configureTestingModule({
            imports: [
                ReactiveComponentLoaderModule.withModule({
                    moduleId: 'greetings',
                    loadChildren: './path/to/greetings.module#GreetingsModule'
                }),
                RouterTestingModule
            ]
        }));

        let reactiveComponentLoader: ReactiveComponentLoader;
        beforeEach(() => reactiveComponentLoader = TestBed.get(ReactiveComponentLoader));

        let spyNgModuleFactoryLoader: SpyNgModuleFactoryLoader;
        beforeEach(() => spyNgModuleFactoryLoader = TestBed.get(NgModuleFactoryLoader));

        beforeEach(() => {
            /* Stubbing the lazy loaded module. */
            spyNgModuleFactoryLoader.stubbedModules = {
                './path/to/greetings.module#GreetingsModule': GreetingsModule
            };
        });

        it('should retrieve component recipe', async () => {

            /* Retrieving the component's recipe using its location. */
            const recipe = await reactiveComponentLoader.getComponentRecipe({
                moduleId: 'greetings',
                selector: 'wt-greetings'
            }).toPromise();

            /* Check that we retrieved the right component type. */
            expect(recipe.componentType).toBe(GreetingsComponent);

            /* Create the component... */
            const fixture = TestBed.createComponent(recipe.componentType);

            /* ... and see if it works. */
            fixture.componentInstance.name = '@yjaaidi';
            fixture.detectChanges();
            expect(fixture.nativeElement.textContent).toEqual('Hello @yjaaidi');

        });

        it('should throw an error if module is not found', fakeAsync(() => {

            reactiveComponentLoader.getComponentRecipe({
                moduleId: 'unknown-module-id',
                selector: 'wt-greetings'
            })
                .subscribe({next, error});

            tick();

            expect(next).not.toHaveBeenCalled();
            expect(error).toHaveBeenCalledWith(new Error(`Module with id 'unknown-module-id' not found.`));

        }));

        it('should throw an error if component is not found', fakeAsync(() => {

            reactiveComponentLoader.getComponentRecipe({
                moduleId: 'greetings',
                selector: 'wt-unknown-component'
            })
                .subscribe({next, error});

            tick();

            expect(next).not.toHaveBeenCalled();
            expect(error).toHaveBeenCalledWith(new Error(`Component '<wt-unknown-component>' not found.`));

        }));

    });

    describe('with duplicate modules', () => {

        beforeEach(() => TestBed.configureTestingModule({
            imports: [
                ReactiveComponentLoaderModule.withModule({
                    moduleId: 'greetings',
                    loadChildren: './path/to/greetings-1.module#GreetingsModule'
                }),
                ReactiveComponentLoaderModule.withModule({
                    moduleId: 'greetings',
                    loadChildren: './path/to/greetings-2.module#GreetingsModule'
                }),
                RouterTestingModule
            ]
        }));

        let reactiveComponentLoader: ReactiveComponentLoader;
        beforeEach(() => reactiveComponentLoader = TestBed.get(ReactiveComponentLoader));

        let spyNgModuleFactoryLoader: SpyNgModuleFactoryLoader;
        beforeEach(() => spyNgModuleFactoryLoader = TestBed.get(NgModuleFactoryLoader));

        beforeEach(() => {
            /* Stubbing the lazy loaded module. */
            spyNgModuleFactoryLoader.stubbedModules = {
                './path/to/greetings-1.module#GreetingsModule': GreetingsModule,
                './path/to/greetings-2.module#GreetingsModule': GreetingsModule
            };
        });

        it('should throw an error if module is declared with different locations', fakeAsync(() => {

            reactiveComponentLoader.getComponentRecipe({
                moduleId: 'greetings',
                selector: 'wt-greetings'
            })
                .subscribe({next, error});

            tick();

            expect(next).not.toHaveBeenCalled();
            expect(error).toHaveBeenCalledWith(new Error(
                `Module with id 'greetings' has been declared more than once with different locations.`
            ));

        }));

    });

});
