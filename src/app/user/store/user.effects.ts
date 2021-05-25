import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Actions, concatLatestFrom, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import * as fromApp from '../../store/app.reducer';
import * as UserActions from './user.actions';
import * as AuthActions from '../../auth/store/auth.actions';
import { catchError, exhaustMap, map } from "rxjs/operators";
import getErrorMessage from "src/app/shared/error-message";
import { Alert, AlertType, ActionType } from "src/app/shared/models/alert.model";
import { of } from "rxjs";
import { environment } from "src/environments/environment";
import * as ServerResponse from '../../shared/models/server-response.model';
import { getUserState } from "./user.selector";

@Injectable()
export class UserEffects {

    fetchUser$ = createEffect(() => this.actions$.pipe(
        ofType(UserActions.fetchUser),
        exhaustMap(() => {
            const url = `${environment.API_HOST}users/me`;
            return this.http.get<ServerResponse.GetMe>(url).pipe(
                map(res => {
                    return {
                        currentDevice: res.currentDevice,
                        user: {
                            ...res.user,
                            accounts: undefined,
                        }
                    }
                }),
                map(data => UserActions.fetchUserSuccess({ user: data.user, currentDevice: data.currentDevice })),
                catchError(error => {
                    const alert = new Alert(AlertType.Error, getErrorMessage(error), { dismissible: false, action: ActionType.FetchUser });
                    return of(UserActions.fetchUserFail({ alert }))
                })
            )
        })
    ))

    updateUser$ = createEffect(() => this.actions$.pipe(
        ofType(UserActions.updateUser),
        exhaustMap(action => {
            const { updateData } = action;
            const url = `${environment.API_HOST}users/me`;
            return this.http.patch<ServerResponse.UpdateUser>(url, updateData).pipe(
                map(res => res.user),
                map(user => {
                    const alert = new Alert(AlertType.Success, 'User updated successfully.');
                    return UserActions.updateUserSuccess({ alert, user });
                }),
                catchError(error => {
                    const alert = new Alert(AlertType.Error, getErrorMessage(error));
                    return of(UserActions.updateUserFail({ alert }));
                })
            )
        })
    ))

    updatePassword$ = createEffect(() => this.actions$.pipe(
        ofType(UserActions.updatePassword),
        exhaustMap(action => {
            const { passwordData } = action;
            const url = `${environment.API_HOST}users/me/update-password`;
            return this.http.patch<ServerResponse.UpdatePassword>(url, passwordData).pipe(
                map(res => {
                    return {
                        token: res.token,
                        tokenExpires: res.tokenExpires,
                    }
                }),
                map(tokenData => {
                    const alert = new Alert(AlertType.Success, 'Password updated successfully.');
                    return UserActions.updatePasswordSuccess({ alert, tokenData });
                }),
                catchError(error => {
                    const alert = new Alert(AlertType.Error, getErrorMessage(error));
                    return of(UserActions.updatePasswordFail({ alert }));
                })
            )
        })
    ))

    resetPin$ = createEffect(() => this.actions$.pipe(
        ofType(UserActions.resetPin),
        exhaustMap(action => {
            const { pinData } = action;
            const url = `${environment.API_HOST}users/me/reset-pin`;
            return this.http.patch<ServerResponse.ResetPin>(url, pinData).pipe(
                map(res => {
                    const alert = new Alert(AlertType.Success, res.message);
                    return UserActions.resetPinSuccess({ alert });
                }),
                catchError(error => {
                    const alert = new Alert(AlertType.Error, getErrorMessage(error));
                    return of(UserActions.resetPinFail({ alert }))
                })
            )
        })
    ))

    deactivateUser$ = createEffect(() => this.actions$.pipe(
        ofType(UserActions.deactivateUser),
        exhaustMap(() => {
            const url = `${environment.API_HOST}users/me/deactivate`;
            return this.http.patch<ServerResponse.DeactivateUser>(url, {}).pipe(
                map(res => {
                    const alert = new Alert(AlertType.Warning, res.message);
                    return AuthActions.logout({ alert });
                }),
                catchError(error => {
                    const alert = new Alert(AlertType.Error, getErrorMessage(error));
                    return of(UserActions.deactivateUserFail({ alert }));
                })
            )
        })
    ))

    deleteUser$ = createEffect(() => this.actions$.pipe(
        ofType(UserActions.deleteUser),
        exhaustMap(action => {
            const { password } = action;
            const url = `${environment.API_HOST}users/me/delete`;
            return this.http.post<ServerResponse.DeactivateUser>(url, { password }).pipe(
                map(res => {
                    const alert = new Alert(AlertType.Warning, res.message);
                    return AuthActions.logout({ alert });
                }),
                catchError(error => {
                    const alert = new Alert(AlertType.Error, getErrorMessage(error));
                    return of(UserActions.deleteUserFail({ alert }));
                })
            )
        })
    ))

    deleteLoggedDevice$ = createEffect(() => this.actions$.pipe(
        ofType(UserActions.deleteLoggedDevice),
        concatLatestFrom(() => this.store.select(getUserState)),
        exhaustMap(([action, userState]) => {
            const { deviceId } = action;
            const url = `${environment.API_HOST}users/me/remove-device/${deviceId}`; 
            return this.http.patch<ServerResponse.deleteLoggedDevice>(url, {}).pipe(
                map(res => {
                    return {
                        ...res,
                        user: {
                            ...res.user,
                            accounts: undefined,
                        }
                    }
                }),
                map(res => {
                    if (userState.currentDevice?._id === action.deviceId ) {
                        const alert = new Alert(AlertType.Success, res.message + ' You have been logged out.');
                        return AuthActions.logout({ alert });
                    } else {
                        const alert = new Alert(AlertType.Success, res.message);
                        return UserActions.deleteLoggedDeviceSuccess({ alert, user: res.user, currentDevice: res.currentDevice });
                    }
                }),
                catchError(error => {
                    const alert = new Alert(AlertType.Error, getErrorMessage(error));
                    return of(UserActions.deleteLoggedDeviceFail({ alert }));
                })
            )
        })
    ))

    logout$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.logout),
        map(() => UserActions.clearUser())
    ))
    
    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private store: Store<fromApp.AppState>
    ) {}

}