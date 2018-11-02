import { CommonModule } from '@angular/common';
import { Component, Input, NgModule } from '@angular/core';
import { ReactiveComponentLoaderModule } from '../lib';

@Component({
    selector: 'wt-greetings',
    template: `
        <div>Hello {{ name }}</div>`
})
export class GreetingsComponent {
    @Input() name: string;
}


@Component({
    selector: 'wt-bye',
    template: `
        <div>Bye {{ name }}</div>`
})
export class ByeComponent {
    @Input() name: string;
}

@NgModule({
    declarations: [
        ByeComponent,
        GreetingsComponent
    ],
    entryComponents: [
        ByeComponent,
        GreetingsComponent
    ],
    exports: [
        ByeComponent,
        GreetingsComponent
    ],
    imports: [
        CommonModule,
        ReactiveComponentLoaderModule
    ]
})
export class GreetingsModule {
}