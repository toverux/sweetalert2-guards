import { GuardOptions } from './decorator_options';
import { createGuardMethod, MaybeVariadicThunk, VariadicThunk } from './decorator_runtime';

export type SweetAlertDecorator =
    | ((options: MaybeVariadicThunk<GuardOptions>) => MethodDecorator)
    | ((title: string, text: string, options?: MaybeVariadicThunk<GuardOptions>) => MethodDecorator);

// tslint:disable-next-line:ban-types
export function makeDecorator(
    decorator: SweetAlertDecorator,
    options: VariadicThunk<GuardOptions>): MethodDecorator {

    return (target: object, propertyKey: string | symbol, descriptor: TypedPropertyDescriptor<any>) => {
        //=> Runtime check: if descriptor.value isn't set, then the decorator isn't being used on a method
        if (!descriptor || !descriptor.value) {
            const targetDesc = describeInvalidTarget(target, propertyKey, descriptor);
            throw new Error(`Cannot decorate ${targetDesc}: only methods can be decorated with @${decorator.name}()`);
        }

        //=> Wrap the original method implementation
        descriptor.value = createGuardMethod(descriptor.value, options);
    };
}

export function normalizeDecoratorArguments(
    args: IArguments | any[],
    defaults?: GuardOptions): VariadicThunk<GuardOptions> {

    if (args.length === 1) {
        const options = args[0];

        return (...runArgs) => ({ ...defaults, ...callIfFn(options, runArgs) });
    } else if (args.length === 2 || args.length === 3) {
        const title = args[0];
        const text = args[1];
        const options = args[2] || {};

        return (...runArgs) => ({ ...defaults, title, text, ...callIfFn(options, runArgs) });
    }

    throw new Error('A SweetAlert decorator expects arguments taking one of the following forms:\n' +
        ' - @Decorator(title, text)\n' +
        ' - @Decorator(title, text, options)\n' +
        ' - @Decorator(title, text, (...args) => options)\n' +
        ' - @Decorator(options)\n' +
        ' - @Decorator((...args) => options)\n');
}

function callIfFn<T>(value: MaybeVariadicThunk, args: any[]): T {
    return typeof value === 'function' ? value(...args) : value;
}

function describeInvalidTarget(target: any, propertyKey: any, descriptor: any): string {
    if (target && !propertyKey) {
        return `class ${target.name}`;
    } else if (target && propertyKey && descriptor == null) {
        return `property ${target.constructor.name}.${propertyKey}`;
    } else if (target && propertyKey && typeof descriptor === 'number') {
        return `parameter #${descriptor} of ${target.constructor.name}.${propertyKey}`;
    } else if (target && propertyKey && (descriptor.get || descriptor.set)) {
        return `setter or getter ${target.constructor.name}.${propertyKey}`;
    } else {
        return `[unknown target type]`;
    }
}
