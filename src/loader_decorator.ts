import swal from 'sweetalert2';
import { makeDecorator, normalizeDecoratorArguments } from './decorator_factory';
import { GuardOptions } from './decorator_options';
import { MaybeVariadicThunk } from './decorator_runtime';

export function Loader(
    titleOrOptions: string | MaybeVariadicThunk<GuardOptions>,
    text?: string,
    typeOrOptions?: string | MaybeVariadicThunk<GuardOptions>): MethodDecorator {

    const options = normalizeDecoratorArguments(arguments, {
        showConfirmButton: false,
        showLoaderOnConfirm: true,
        allowOutsideClick: () => !swal.isLoading(),
        allowEscapeKey: () => !swal.isLoading(),
        onBeforeOpen: swal.clickConfirm
    });

    return makeDecorator(Loader, options);
}
