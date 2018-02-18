import { SweetAlertDismissReason, SweetAlertOptions } from 'sweetalert2';

export const onInvoke = Symbol('@sweetalert2/guards#onInvoke');
export const onDismiss = Symbol('@sweetalert2/guards#onDismiss');

export interface GuardOptions extends SweetAlertOptions {
    [onInvoke]?: (originalArguments: any[], sweetAlertValue: any) => any[];
    [onDismiss]?: (dismiss: SweetAlertDismissReason) => any;
}
