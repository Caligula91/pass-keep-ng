import { createReducer, on } from '@ngrx/store';
import * as AccountsActions from './accounts.actions';
import { Account } from "src/app/shared/models/account.model";
import { Alert } from "src/app/shared/models/alert.model";

export interface AccountsState {
    accounts: Account[] | null,
    isLoading: boolean,
    alert: Alert | null,
    focusedAccount: string | null,
    fetchingPassword: boolean,
    password: string | null,
}

export const initState: AccountsState = {
    accounts: null,
    isLoading: false,
    alert: null,
    focusedAccount: null,
    fetchingPassword: false,
    password: null,
}

export const accountsReducer = createReducer(
    initState,
    /**
     * FETCH ACCOUNTS
     */
    on(AccountsActions.fetchAccounts, (state) => {
        return {
            ...state,
            isLoading: true,
            alert: null,
            focusedAccount: null,
            accounts: null,
        }
    }),
    on(AccountsActions.setAccounts, (state, action) => {
        return {
            ...state,
            isLoading: false,
            alert: null,
            accounts: action.accounts,
        }
    }),
    on(AccountsActions.fetchAccountsFail, (state, action) => {
        return {
            ...state,
            isLoading: false,
            alert: action.alert,
            accounts: null,
        }
    }),

    /**
     * ADD ACCOUNT
     */
    on(AccountsActions.addAccount, (state) => {
        return {
            ...state,
            isLoading: true,
            alert: null,
        }
    }),
    on(AccountsActions.addAccountSuccess, (state, action) => {
        return {
            ...state,
            isLoading: false,
            alert: action.alert,
            accounts: action.accounts,
        }
    }),
    on(AccountsActions.addAccountFail, (state, action) => {
        return {
            ...state,
            isLoading: false,
            alert: action.alert,
        }
    }),

    /**
     * FETCH PASSWORD
     */
    on(AccountsActions.fetchPassword, (state, action) => {
        return {
            ...state,
            fetchingPassword: true,
            focusedAccount: action.accountId,
            alert: null,
        }
    }),
    on(AccountsActions.fetchPasswordSuccess, (state, action) => {
        return {
            ...state,
            fetchingPassword: false,
            focusedAccount: action.accountId,
            password: action.password,
            alert: null,
        }
    }),
    on(AccountsActions.fetchPasswordFail, (state, action) => {
        return {
            ...state,
            fetchingPassword: false,
            focusedAccount: action.accountId,
            alert: action.alert,
        }
    }),
    on(AccountsActions.clearPassword, (state) => {
        return {
            ...state,
            password: null,
        }
    }),

    /**
     * UPDATE ACCOUNT
     */
    on(AccountsActions.updateAccount, (state, action) => {
        return {
            ...state,
            isLoading: true,
            focusedAccount: action.accountId,
            alert: null,
        }
    }),
    on(AccountsActions.updateAccountSuccess, (state, action) => {
        return {
            ...state,
            isLoading: false,
            focusedAccount: null,
            accounts: action.accounts,
            alert: action.alert,
        }
    }),
    on(AccountsActions.updateAccountFail, (state, action) => {
        return {
            ...state,
            isLoading: false,
            focusedAccount: action.accountId,
            alert: action.alert,
        }
    }),

    /**
     * DELETE ACCOUNT
     */
    on(AccountsActions.deleteAccount, (state, action) => {
        return {
            ...state,
            isLoading: true,
            focusedAccount: action.accountId,
            alert: null,
        }
    }),
    on(AccountsActions.deleteAccountSuccess, (state, action) => {
        return {
            ...state,
            isLoading: false,
            focusedAccount: null,
            accounts: state?.accounts?.filter(acc => acc.id !== action.accountId) || null,
            alert: action.alert,
        }
    }),
    on(AccountsActions.deleteAccountFail, (state, action) => {
        return {
            ...state,
            isLoading: false,
            focusedAccount: action.accountId,
            alert: action.alert,
        }
    }),
    
    /**
     * CLEAR
     */
    on(AccountsActions.clearAlert, (state) => {
        return {
            ...state,
            alert: null,
        }
    }),
    on(AccountsActions.clearAccounts, (state) => {
        return {
            ...state,
            accounts: null,
            isLoading: false,
            alert: null,
            focusedAccount: null,
            fetchingPassword: false,
            password: null,
        }
    })
)