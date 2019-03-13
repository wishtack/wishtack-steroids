import { externalSchematic, Rule } from '@angular-devkit/schematics';
import { Schema } from '@schematics/angular/module/schema';

export function scam(options: Schema): Rule {
    return externalSchematic('@schematics/angular', 'module', options);
}
