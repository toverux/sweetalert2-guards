import swal, { SweetAlertDismissReason } from 'sweetalert2';
import { GuardOptions, onDismiss, onInvoke } from './decorator_options';

export type VariadicThunk<TResult = any> = (...args: any[]) => TResult;

export type MaybeVariadicThunk<T = any> = T | VariadicThunk<T>;

export function createGuardMethod(
    wrappedMethod: VariadicThunk,
    optionsGetter: VariadicThunk<GuardOptions>): VariadicThunk<Promise<any>> {

    return async function(this: any, ...args: any[]) {
        //=> Build alert options
        const options: GuardOptions = {
            //=> Default Guard options
            [onInvoke]: onInvokePassOriginalArguments,
            [onDismiss]: onDismissReject,

            //=> Proposed default SweetAlert options
            showLoaderOnConfirm: true,

            //=> Merge with consumer options
            ...optionsGetter(...args),

            //=> Tuning preConfirm to run our wrapped method
            // using an arrow function to preserve current `this` scope
            // otherwise, `this` becomes the options object itself
            // tslint:disable-next-line:no-shadowed-variable
            preConfirm: async (value) => {
                //=> Call wrapped method
                const result = await wrappedMethod.apply(this, options[onInvoke]!(args, value));

                // Result can be undefined/false-ish for void/Promise<void> wrapped methods,
                // and SweetAlert will take `value` when preConfirm's returns nothing.
                // To avoid that and preserve our false-ish value, we wrap it into an object.
                return { result };
            }
        };

        //=> Show the alert
        const { value, dismiss } = await swal(options);

        return dismiss
            ? options[onDismiss]!(dismiss)
            : value.result;
    };
}

function onInvokePassOriginalArguments(originalArguments: any[]): any[] {
    return originalArguments;
}

function onDismissReject(dismiss: SweetAlertDismissReason): void {
    throw new Error(`SweetAlert2 Guard didn't execute method: modal was dismissed (${dismiss})`);
}
