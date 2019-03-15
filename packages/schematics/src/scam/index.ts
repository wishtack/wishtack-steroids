import { chain, externalSchematic, Rule } from '@angular-devkit/schematics';
import { Schema as NgComponentOptions } from '@schematics/angular/component/schema';
import { findModuleFromOptions } from '@schematics/angular/utility/find-module';
import { buildDefaultPath, getProject } from '@schematics/angular/utility/project';

export interface ScamOptions extends NgComponentOptions {
    separateModule: boolean;
}

/**
 * A function that simply merges component and module, and removes useless imports.
 * @param componentContent
 * @param moduleContent
 * @private
 */
export function _mergeComponentAndModule(componentContent: string, moduleContent: string): string {
    throw new Error('😱 Not implemented yet!');
}

/**
 * Schematics rule factory that merges module into component.
 * @private
 */
export const _mergeModuleIntoComponentFile: (options: ScamOptions) => Rule = (options) => (tree, context) => {

    const project = getProject(tree, options.project);

    const modulePath = findModuleFromOptions(tree, {
        ...options,
        path: options.path || buildDefaultPath(project)
    });

    /* @hack: Well, that's a dirty way for guessing the component's path from the module. */
    const componentPath = modulePath.replace(/module.ts$/, 'component.ts');

    const moduleContent = tree.read(modulePath);
    const componentContent = tree.read(componentPath);

    tree.delete(modulePath);

    return tree;

};

export function scam(options: ScamOptions): Rule {

    let ruleList = [
        externalSchematic('@schematics/angular', 'module', options),
        externalSchematic('@schematics/angular', 'component', {
            ...options,
            export: true,
            module: options.name
        })
    ];

    if (!options.separateModule) {
        ruleList = [
            ...ruleList,
            _mergeModuleIntoComponentFile(options)
        ];
    }

    return chain(ruleList);

}
