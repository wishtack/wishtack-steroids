import { chain, externalSchematic, Rule } from '@angular-devkit/schematics';
import { Schema } from '@schematics/angular/module/schema';

export function scam(options: Schema): Rule {
    return chain([
        externalSchematic('@schematics/angular', 'module', {
            ...options,
            export asdfadsf
        }),
        externalSchematic('@schematics/angular', 'component', {
            ...options,
            module: options.name
        }),
    ]);
}
