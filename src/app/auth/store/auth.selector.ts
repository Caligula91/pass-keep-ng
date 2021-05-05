import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAuth from './auth.reducer';

export const AUTH_STATE_NAME = 'auth';

export const getAuthState = createFeatureSelector<fromAuth.AuthState>(AUTH_STATE_NAME);

export const getUser = createSelector(getAuthState, (state) => state.user);