import { SweetAlertDismissReason, SweetAlertOptions } from 'sweetalert2';

export const invokeStrategy = Symbol('@sweetalert2/guards#invokeStrategy');
export const errorStrategy = Symbol('@sweetalert2/guards#errorStrategy');
export const onDismiss = Symbol('@sweetalert2/guards#onDismiss');
export const onError = Symbol('@sweetalert2/guards#onError');
export const onSuccess = Symbol('@sweetalert2/guards#onSuccess');

export interface GuardOptions extends SweetAlertOptions {
    [invokeStrategy]?: (originalArguments: any[], sweetAlertValue: any) => any[];
    [errorStrategy]?: (err: any) => void | Promise<void>;

    [onDismiss]?: (dismiss: SweetAlertDismissReason) => any | Promise<any>;
    [onError]?: (err: any) => void | Promise<void>;
    [onSuccess]?: (value: any) => void | Promise<void>;
}
