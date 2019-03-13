import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import moduleSchematic from '@schematics/angular/module';
import { Schema } from '@schematics/angular/module/schema';

export function scam(options: Schema): Rule {
    return (tree: Tree, context: SchematicContext) => {
        return moduleSchematic(options)(tree, context);
    };
}
