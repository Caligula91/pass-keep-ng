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
}

/**
 * REDUCER
 */
export const initState: AuthState = {
    user: null,
    isLoading: false,
    alert: null,
    signedupEmail: null,
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
    on(AuthActions.authSuccess, (state, action) => {
        return {
            ...state,
            isLoading: false,
            user: action.user,
            alert: action.alert,
            signedupEmail: null,
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
    on(AuthActions.logout, (state) => {
        return {
            ...state,
            user: null,
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
    })
)
