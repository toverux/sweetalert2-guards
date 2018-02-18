import swal, { SweetAlertDismissReason } from 'sweetalert2';
import { GuardOptions, onDismiss } from './decorator_options';

export type VariadicThunk<TResult = any> = (...args: any[]) => TResult;

export type MaybeVariadicThunk<T = any> = T | VariadicThunk<T>;

export function createGuardMethod(
    wrappedMethod: VariadicThunk,
    optionsGetter: VariadicThunk<GuardOptions>): VariadicThunk<Promise<any>> {

    return async function(this: any, ...args: any[]) {
        //=> Build alert options
        const options: GuardOptions = {
            //=> Default Guard options
            [onDismiss]: defaultOnDismissHandler,

            //=> Proposed default SweetAlert options
            showLoaderOnConfirm: true,

            //=> Merge with consumer options
            ...optionsGetter(...args),

            // using an arrow function to preserve current `this` scope
            // otherwise, `this` becomes the options object itself
            preConfirm: () => {
                return wrappedMethod.apply(this, args);
            }
        };

        //=> Show the alert
        const { value, dismiss } = await swal(options);

        return dismiss
            ? options[onDismiss]!(dismiss)
            : value;
    };
}

function defaultOnDismissHandler(dismiss: SweetAlertDismissReason): void {
    throw new Error(`SweetAlert2 Guard didn't execute method: modal was dismissed (${dismiss})`);
}
