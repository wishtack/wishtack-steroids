import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import moduleSchematic from '@schematics/angular/module';
import { Schema } from '@schematics/angular/module/schema';

export function scam(options: Schema): Rule {
    return (tree: Tree, context: SchematicContext) => {
        return chain([
            moduleSchematic(options)
        ])(tree, context);
    };
}
