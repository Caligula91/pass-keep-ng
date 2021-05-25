import { createAction, props } from '@ngrx/store';
import { Alert } from 'src/app/shared/models/alert.model';
import * as ServerResponse from '../../shared/models/server-response.model';

/**
 * FETCH USER
 */
export const fetchUser = createAction(
    '[User] Fetch User'
);

export const fetchUserSuccess = createAction(
    '[User] Fetch User Success',
    props<{ user: ServerResponse.User, currentDevice: ServerResponse.Device }>()
);

export const fetchUserFail = createAction(
    '[User] Fetch User Fail',
    props<{ alert: Alert }>()
);

/**
 * UPDATE USER
 */
export const updateUser = createAction(
    '[User] Update User',
    props<{ updateData: { name: string } }>()
);

export const updateUserSuccess = createAction(
    '[User] Update User Success',
    props<{ alert: Alert, user: ServerResponse.User }>()
);

export const updateUserFail = createAction(
    '[User] Update User Fail',
    props<{ alert: Alert }>()
);

/**
 * UPDATE PASSWORD
 */
export const updatePassword = createAction(
    '[User] Update Password',
    props<{ passwordData: { passwordCurrent: string, password: string, passwordConfirm: string } }>()
);

export const updatePasswordSuccess = createAction(
    '[User] Update Password Success',
    props<{ alert: Alert, tokenData: { token: string, tokenExpires: string } }>()
);

export const updatePasswordFail = createAction(
    '[User] Password Update Fail',
    props<{ alert: Alert }>()
);

/**
 * RESET PIN
 */
export const resetPin = createAction(
    '[User] Reset Pin',
    props<{ pinData: { password: string, pin: string, pinConfirm: string } }>()
);

export const resetPinSuccess = createAction(
    '[User] Reset Pin Success',
    props<{ alert: Alert }>()
);

export const resetPinFail = createAction(
    '[User] Reset Pin Fail',
    props<{ alert: Alert }>()
);

/**
 * DEACTIVATE USER
 */
export const deactivateUser = createAction(
    '[User] Deactivate User',
);

export const deactivateUserFail = createAction(
    '[User] Deactivate User Fail',
    props<{ alert: Alert }>()
);

/**
 * DELETE USER
 */
export const deleteUser = createAction(
    '[User] Delete User',
    props<{ password: string }>()
);

export const deleteUserFail = createAction(
    '[User] Delete User Fail',
    props<{ alert: Alert }>()
);

/**
 * DELETE LOGGED DEVICE
 */
export const deleteLoggedDevice = createAction(
    '[User] Delete Logged Device',
    props<{ deviceId: string }>()
);

export const deleteLoggedDeviceSuccess = createAction(
    '[User] Delete Logged Device Success',
    props<{ alert: Alert, user: ServerResponse.User, currentDevice: ServerResponse.Device}>()
);

export const deleteLoggedDeviceFail = createAction(
    '[User] Delete Logged Device Fail',
    props<{ alert: Alert }>()
);

/**
 * CLEAR
 */
export const clearAlert = createAction(
    '[User] Clear Alert'
);

export const clearUser = createAction(
    '[User] Clear User',
);