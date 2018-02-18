import { makeDecorator, normalizeDecoratorArguments } from './decorator_factory';
import { MaybeVariadicThunk, SweetAlertOptions } from './decorator_runtime';

export function Confirm(
    titleOrOptions: string | MaybeVariadicThunk<SweetAlertOptions>,
    text: string,
    typeOrOptions?: string | MaybeVariadicThunk<SweetAlertOptions>): MethodDecorator {

    const options = normalizeDecoratorArguments(arguments, {
        type: 'question',
        showCancelButton: true
    });

    return makeDecorator(Confirm, options);
}
