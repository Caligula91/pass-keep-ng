import * as fromAuth from '../auth/store/auth.reducer';
import { ActionReducerMap } from '@ngrx/store';
import { AUTH_STATE_NAME } from '../auth/store/auth.selector';

export interface AppState {
    [AUTH_STATE_NAME]: fromAuth.AuthState,
}

export const appReducer: ActionReducerMap<AppState> = {
    [AUTH_STATE_NAME]: fromAuth.authReducer,
};