import { createAction, props } from '@ngrx/store';
import { Alert } from 'src/app/shared/models/alert.model';
import { Account } from "src/app/shared/models/account.model";

/**
 * FETCH ACCOUNTS
 */
export const fetchAccounts = createAction(
    '[Accounts] Fetch Accounts'
);

export const setAccounts = createAction(
    '[Accounts] Set Accounts',
    props<{ accounts: Account[] }>()
);

export const fetchAccountsFail = createAction(
    '[Accounts] Fetch Accounts Fail',
    props<{ alert: Alert }>()
);

/**
 * ADD ACCOUNT
 */
export const addAccount = createAction(
    '[Accounts] Add Account',
    props<{ newAccount: { name: string, userEmail?: string, password: string, image?: string } }>()
);

export const addAccountSuccess = createAction(
    '[Accounts] Add Account Success',
    props<{ accounts: Account[], alert: Alert }>()
);

export const addAccountFail = createAction(
    '[Accounts] Add Account Fail',
    props<{ alert: Alert }>()
);

/**
 * FETCH PASSWORD
 */
export const fetchPassword = createAction(
    '[Accounts] Fetch Password',
    props<{ accountId: string, pin: string }>()
);

export const fetchPasswordSuccess = createAction(
    '[Accounts] Fetch Password Success',
    props<{ password: string, accountId: string }>()
);

export const fetchPasswordFail = createAction(
    '[Accounts] Fetch Password Fail',
    props<{ alert: Alert, accountId: string }>()
);

export const clearPassword = createAction(
    '[Accounts] Clear Password',
);

/**
 * UPDATE ACCOUNT
 */
export const updateAccount = createAction(
    '[Accounts] Update Account',
    props<{ accountId: string, updateFields: { name?: string, userEmail?: string, password?: string, image?: string } }>()
);

export const updateAccountSuccess = createAction(
    '[Accounts] Update Account Success',
    props<{ alert: Alert, accounts: Account[] }>()
);

export const updateAccountFail = createAction(
    '[Accounts] Update Account Fail',
    props<{ alert: Alert, accountId: string }>()
);

/**
 * DELETE ACCOUNT
 */
export const deleteAccount = createAction(
    '[Accounts] Delete Account',
    props<{ accountId: string }>()
);

export const deleteAccountSuccess = createAction(
    '[Accounts] Delete Account Success',
    props<{ alert: Alert, accountId: string }>()
);

export const deleteAccountFail = createAction(
    '[Accounts] Delete Accoun Fail',
    props<{ alert: Alert, accountId: string }>()
);

/**
 * CLEAR
 */
export const clearAlert = createAction(
    '[Accounts] Clear Alert'
);

export const clearAccounts = createAction(
    '[Accounts/Auth] Clear Accounts'
)