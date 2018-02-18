import swal, { SweetAlertOptions } from 'sweetalert2';

export { SweetAlertOptions };

export type VariadicThunk<TResult = any> = (...args: any[]) => TResult;

export type MaybeVariadicThunk<T = any> = T | VariadicThunk<T>;

export function createGuardMethod(
    wrappedMethod: VariadicThunk,
    optionsGetter: VariadicThunk<SweetAlertOptions>): VariadicThunk<Promise<any>> {

    return async function(this: any, ...args: any[]) {
        const options = optionsGetter(...args);

        const guardOptions: SweetAlertOptions = {
            ...options,
            showLoaderOnConfirm: true,

            // using an arrow function to preserve current `this` scope
            // otherwise, `this` becomes the options object itself
            preConfirm: () => {
                return wrappedMethod.apply(this, args);
            }
        };

        const { value, dismiss } = await swal(guardOptions);

        if (dismiss) {
            throw new Error(`SweetAlert2 Guard didn't execute method: modal was dismissed (${dismiss})`);
        }

        return value;
    };
}
