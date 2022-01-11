/**
 *  Objects of this type get passed to the navigate function of svelte-routing
 *  when navigating to the InvalidCredential page. It needs to extend the type
 *  expected by the state parameter when calling navigate.
 */
export interface IInvalidCredentialPageState extends Record<string | number, unknown> {
    message?: string;
    detail?: string;
}
