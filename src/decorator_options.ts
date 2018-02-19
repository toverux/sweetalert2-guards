import { SweetAlertDismissReason, SweetAlertOptions } from 'sweetalert2';

export const onDismiss = Symbol('@sweetalert2/guards#onDismiss');
export const onInvoke = Symbol('@sweetalert2/guards#onInvoke');
export const onError = Symbol('@sweetalert2/guards#onError');

export interface GuardOptions extends SweetAlertOptions {
    [onDismiss]?: (dismiss: SweetAlertDismissReason) => any;
    [onInvoke]?: (originalArguments: any[], sweetAlertValue: any) => any[];
    [onError]?: (err: any) => void;
}
