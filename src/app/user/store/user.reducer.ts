import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';
import { Alert } from 'src/app/shared/models/alert.model';
import * as ServerResponse from '../../shared/models/server-response.model';

export interface UserState {
    user: ServerResponse.User | null,
    isLoading: boolean,
    alert: Alert | null,
}

export const initState: UserState = {
    user: null,
    isLoading: false,
    alert: null,
}

export const userReducer = createReducer(
    initState,

    /**
     * FETCH USER
     */
    on(UserActions.fetchUser, (state) => {
        return {
            ...state,
            isLoading: true,
            alert: null,
        }
    }),
    on(UserActions.fetchUserSuccess, (state, action) => {
        return {
            ...state,
            isLoading: false,
            user: action.user,
            alert: null,
        }
    }),
    on(UserActions.fetchUserFail, (state, action) => {
        return {
            ...state,
            isLoading: false,
            user: null,
            alert: action.alert,
        }
    }),

    /**
     * UPDATE USER
     */
    on(UserActions.updateUser, (state) => {
        return {
            ...state,
            isLoading: true,
            alert: null,
        }
    }),
    on(UserActions.updateUserSuccess, (state, action) => {
        return {
            ...state,
            isLoading: false,
            alert: action.alert,
            user: action.user,
        }
    }),
    on(UserActions.updateUserFail, (state, action) => {
        return {
            ...state,
            isLoading: false,
            alert: action.alert,
        }
    }),

    /**
     * UPDATE PASSWORD
     */
    on(UserActions.updatePassword, (state) => {
        return {
            ...state,
            isLoading: true,
            alert: null,
        }
    }),
    on(UserActions.updatePasswordSuccess, (state, action) => {
        return {
            ...state,
            isLoading: false,
            alert: action.alert,
        }
    }),
    on(UserActions.updatePasswordFail, (state, action) => {
        return {
            ...state,
            isLoading: false,
            alert: action.alert,
        }
    }),

    /**
     * RESET PIN
     */
    on(UserActions.resetPin, (state) => {
        return {
            ...state,
            isLoading: true,
            alert: null,
        }
    }),
    on(UserActions.resetPinSuccess, (state, action) => {
        return {
            ...state,
            isLoading: false,
            alert: action.alert,
        }
    }),
    on(UserActions.resetPinFail, (state, action) => {
        return {
            ...state,
            isLoading: false,
            alert: action.alert,
        }
    }),

    /**
     * DEACTIVATE USER 
     */
    on(UserActions.deactivateUser, (state) => {
        return {
            ...state,
            isLoading: true,
            alert: null,
        }
    }),
    on(UserActions.deactivateUserFail, (state, action) => {
        return {
            ...state,
            isLoading: false,
            alert: action.alert,
        }
    }),

    /**
     * DELETE USER
     */
    on(UserActions.deleteUser, (state) => {
        return {
            ...state,
            isLoading: true,
            alert: null,
        }
    }),
    on(UserActions.deleteUserFail, (state, action) => {
        return {
            ...state,
            isLoading: false,
            alert: action.alert,
        }
    }),

    /**
     * CLEAR
     */
    on(UserActions.clearAlert, (state) => {
        return {
            ...state,
            alert: null,
        }
    }),
    on(UserActions.clearUser, (state) => {
        return {
            ...state,
            user: null,
            isLoading: false,
            alert: null,
        }
    })
)