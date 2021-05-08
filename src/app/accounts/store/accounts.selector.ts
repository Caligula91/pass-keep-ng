import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAccounts from './accounts.reducer';

export const ACCOUNTS_STATE_NAME = 'accounts';

export const getAccountsState = createFeatureSelector<fromAccounts.AccountsState>(ACCOUNTS_STATE_NAME);

export const getAccounts = createSelector(getAccountsState, (state) => state.accounts);