import { createReducer, on } from '@ngrx/store';
import { Alert } from 'src/app/shared/models/alert.model';
import { User } from '../user.model';
import * as AuthActions from './auth.actions';

/**
 * STATE
 */
export interface AuthState {
    user: User | null,
    isLoading: boolean,
    alert: Alert | null,
    signedupEmail: string | null,
    guardMode: boolean,
}

/**
 * REDUCER
 */
export const initState: AuthState = {
    user: null,
    isLoading: false,
    alert: null,
    signedupEmail: null,
    guardMode: false,
}

export const authReducer = createReducer(
    initState,
    on(AuthActions.loginStart, (state) => {
        return {
            ...state,
            isLoading: true,
            alert: null,
        }
    }),
    on(AuthActions.guardCodePending, (state, action) => {
        return {
            ...state,
            isLoading: false,
            alert: action.alert,
            guardMode: true,
        }
    }),
    on(AuthActions.authSuccess, (state, action) => {
        return {
            ...state,
            isLoading: false,
            user: action.user,
            alert: action.alert,
            signedupEmail: null,
            guardMode: false,
        }
    }),
    on(AuthActions.authFail, (state, action) => {
        return {
            ...state,
            isLoading: false,
            alert: action.alert,
        }
    }),
    on(AuthActions.signupStart, (state) => {
        return {
            ...state,
            isLoading: true,
            alert: null,
        }
    }),
    on(AuthActions.signupSuccess, (state, action) => {
        return {
            ...state,
            isLoading: false,
            signedupEmail: action.email,
            alert: action.alert,
        }
    }),
    on(AuthActions.clearSignedupEmail, (state) => {
        return {
            ...state,
            alert: null,
            signedupEmail: null,
        }
    }),
    on(AuthActions.ResendEmailConfirm, (state) => {
        return {
            ...state,
            isLoading: true,
            alert: null,
        }
    }),
    on(AuthActions.ResendEmailConfirmResult, (state, action) => {
        return {
            ...state,
            isLoading: false,
            alert: action.alert,
        }
    }),
    on(AuthActions.confirmEmail, (state) => {
        return {
            ...state,
            isLoading: true,
            alert: null,
        }
    }),
    on(AuthActions.confirmEmailFail, (state, action) => {
        return {
            ...state,
            isLoading: false,
            alert: action.alert,
        }
    }),
    on(AuthActions.clearAlert, (state) => {
        return {
            ...state,
            alert: null,
        }
    }),
    on(AuthActions.logout, (state, action) => {
        return {
            ...state,
            user: null,
            alert: action.alert,
        }
    }),
    on(AuthActions.forgotPassword, (state) => {
        return {
            ...state,
            isLoading: true,
            alert: null,
        }
    }),
    on(AuthActions.forgotPasswordResult, (state, action) => {
        return {
            ...state,
            isLoading: false,
            alert: action.alert,
        }
    }),
    on(AuthActions.resetPassword, (state) => {
        return {
            ...state,
            isLoading: true,
            alert: null,
        }
    }),
    on(AuthActions.resetPasswordResult, (state, action) => {
        return {
            ...state,
            isLoading: false,
            alert: action.alert,
        }
    }),
    on(AuthActions.setUpdatedUser, (state, action) => {
        return {
            ...state,
            user: action.user,
        }
    }),
    on(AuthActions.clearState, (state) => {
        return {
            ...state,
            isLoading: false,
            alert: null,
            guardMode: false,
            signedupEmail: null,
        }
    }),
    on(AuthActions.clearGuard, (state) => {
        return {
            ...state,
            alert: null,
            guardMode: false,
        }
    })
)
