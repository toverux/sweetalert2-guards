import { makeDecorator, normalizeDecoratorArguments } from './decorator_factory';
import { GuardOptions } from './decorator_options';
import { MaybeVariadicThunk } from './decorator_runtime';

export function Confirm(
    titleOrOptions: string | MaybeVariadicThunk<GuardOptions>,
    text?: string,
    typeOrOptions?: string | MaybeVariadicThunk<GuardOptions>): MethodDecorator {

    const options = normalizeDecoratorArguments(arguments, {
        type: 'question',
        showCancelButton: true,
        showLoaderOnConfirm: true
    });

    return makeDecorator(Confirm, options);
}
