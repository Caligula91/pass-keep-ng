import { createAction, props } from '@ngrx/store';
import { Alert } from 'src/app/shared/models/alert.model';
import { User } from '../user.model';

export const loginStart = createAction(
    '[Auth] Login Start',
    props<{ loginData: { email: string, password: string } }>()
);

export const guardCodePending = createAction(
    '[Auth] Guard Code Pending',
    props<{ alert: Alert }>()
);

export const signupStart = createAction(
    '[Auth] Signup Start',
    props<{ signupData: { name: string, email: string, password: string, passwordConfirm: string } }>()
);

export const signupSuccess = createAction(
    '[Auth] Signup Success',
    props<{ alert: Alert, email: string }>()
);

export const ResendEmailConfirm = createAction(
    '[Auth] Resend Email Confirmation'
);

export const ResendEmailConfirmResult = createAction(
    '[Auth] Resend Email Confirmation Result',
    props<{ alert: Alert }>()
);

export const confirmEmail = createAction(
    '[Auth] Confirm Email',
    props<{ emailToken: string, pinData: { pin: string, pinConfirm: string } }>()
);

export const confirmEmailFail = createAction(
    '[Auth] Confirm Email Fail',
    props<{ alert: Alert }>()
)

export const authSuccess = createAction(
    '[Auth] Auth Success',
    props<{ user: User, alert: Alert | null }>()
);

export const authFail = createAction(
    '[Auth] Auth Fail',
    props<{ alert: Alert }>()
);

export const autoLogin = createAction(
    '[Auth] Auto Login',
    props<{ redirect: boolean }>()
);

export const logout = createAction(
    '[Auth] Logout',
    props<{ alert: Alert | null }>()
);

export const forgotPassword = createAction(
    '[Auth] Forgot Password',
    props<{ email: string }>()
);

export const forgotPasswordResult = createAction(
    '[Auth] Forgot Password Result',
    props<{ alert: Alert }>()
);

export const resetPassword = createAction(
    '[Auth] Reset Password',
    props<{ passwordToken: string, passwordData: { password: string, passwordConfirm: string } }>()
);

export const resetPasswordResult = createAction(
    '[Auth] ResetPasswordResult',
    props<{ alert: Alert }>()
);

export const setUpdatedUser = createAction(
    '[Auth/User] Set Updated User',
    props<{ user: User }>()
);

/**
 * CLEAR
 */
export const clearAlert = createAction(
    '[Auth] Clear Alert'
);

export const clearSignedupEmail = createAction(
    '[Auth] Clear SignedupEmail'
);

export const clearGuard = createAction(
    '[Auth] Clear Guard Data',
);

export const clearState = createAction(
    '[Auth] Clear State',
);
