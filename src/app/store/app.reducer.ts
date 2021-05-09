import { ActionReducerMap } from '@ngrx/store';
import * as fromAuth from '../auth/store/auth.reducer';
import { AUTH_STATE_NAME } from '../auth/store/auth.selector';
import * as fromAccounts from '../accounts/store/accounts.reducer';
import { ACCOUNTS_STATE_NAME } from '../accounts/store/accounts.selector';
import * as fromUser from '../user/store/user.reducer';
import { USER_STATE_NAME } from '../user/store/user.selector';

export interface AppState {
    [AUTH_STATE_NAME]: fromAuth.AuthState,
    [ACCOUNTS_STATE_NAME]: fromAccounts.AccountsState,
    [USER_STATE_NAME]: fromUser.UserState,
}

export const appReducer: ActionReducerMap<AppState> = {
    [AUTH_STATE_NAME]: fromAuth.authReducer,
    [ACCOUNTS_STATE_NAME]: fromAccounts.accountsReducer,
    [USER_STATE_NAME]: fromUser.userReducer,
};