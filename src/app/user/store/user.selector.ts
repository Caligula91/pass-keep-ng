import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromUser from './user.reducer';

export const USER_STATE_NAME = 'user';

export const getUserState = createFeatureSelector<fromUser.UserState>(USER_STATE_NAME);

export const getUser = createSelector(getUserState, (state) => state.user);