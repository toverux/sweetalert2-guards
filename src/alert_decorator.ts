import { makeDecorator, normalizeDecoratorArguments } from './decorator_factory';
import { GuardOptions } from './decorator_options';
import { MaybeVariadicThunk } from './decorator_runtime';

export function Alert(
    titleOrOptions: string | MaybeVariadicThunk<GuardOptions>,
    text?: string,
    typeOrOptions?: string | MaybeVariadicThunk<GuardOptions>): MethodDecorator {

    const options = normalizeDecoratorArguments(arguments, {
        showLoaderOnConfirm: true
    });

    return makeDecorator(Alert, options);
}
