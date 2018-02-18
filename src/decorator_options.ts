import { SweetAlertDismissReason, SweetAlertOptions } from 'sweetalert2';

export const onDismiss = Symbol('@sweetalert2/guards#onDismiss');

export interface GuardOptions extends SweetAlertOptions {
    [onDismiss]?: (dismiss: SweetAlertDismissReason) => any;
}
