import { makeDecorator, normalizeDecoratorArguments } from './decorator_factory';
import { MaybeVariadicThunk, SweetAlertOptions } from './decorator_runtime';

export function SweetAlert(
    titleOrOptions: string | MaybeVariadicThunk<SweetAlertOptions>,
    text: string,
    typeOrOptions?: string | MaybeVariadicThunk<SweetAlertOptions>): MethodDecorator {

    const options = normalizeDecoratorArguments(arguments);

    return makeDecorator(SweetAlert, options);
}
