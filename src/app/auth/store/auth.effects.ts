import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, switchMap, tap } from "rxjs/operators";
import * as fromApp from '../../store/app.reducer';
import * as AccountsActions from '../../accounts/store/accounts.actions';
import { AuthService } from "../auth.service";
import * as AuthActions from './auth.actions';
import * as ServerResponse from '../../shared/models/server-response.model';
import { environment } from "src/environments/environment";
import { User } from "../user.model";
import { Alert, AlertType } from "src/app/shared/models/alert.model";
import getErrorMessage from '../../shared/error-message';
import { of } from "rxjs";
import { Router } from "@angular/router";

@Injectable()
export class AuthEffects {

    signup$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.signupStart),
        switchMap(action => {
            const url = `${environment.API_HOST}users/signup`;
            return  this.http.post<ServerResponse.Signup>(url, action.signupData).pipe(
                tap(() => this.authService.addStorageListener()),
                map(res => {
                    const alert = new Alert(AlertType.Primary, res.message);
                    return AuthActions.signupSuccess({ alert, email: action.signupData.email });
                }),
                catchError(error => {
                    const alert = new Alert(AlertType.Error, getErrorMessage(error));
                    return of(AuthActions.authFail({ alert }));
                })
            )
        })
    ))

    resendEmailConfirm$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.ResendEmailConfirm),
        switchMap(action => {
            const url = `${environment.API_HOST}users/resend-email-confirm`;
            return this.http.post<ServerResponse.ReSendEmail>(url, { email: action.email }).pipe(
                map(res => {
                    const alert = new Alert(AlertType.Primary, res.message);
                    return AuthActions.ResendEmailConfirmResult({ alert });
                }),
                catchError(error => {
                    const alert = new Alert(AlertType.Error, getErrorMessage(error));
                    return of(AuthActions.ResendEmailConfirmResult({ alert }));
                })
            )
        })
    ))

    confirmEmail$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.confirmEmail),
        switchMap(action => {
            const { emailToken, pinData } = action;
            const url = `${environment.API_HOST}users/email-confirmation/${emailToken}`;
             return this.http.post<ServerResponse.EmailConfirmation>(url, pinData).pipe(
                 map(res => {
                    const { token, tokenExpires, user: { _id, name, email } } = res;
                    return new User(_id, email, name, token, tokenExpires);
                 }),
                 map(user => {
                    const message = 'Your email address has been verified. You can safely close this tab now.'
                    const alert = new Alert(AlertType.Success, message, { dismissible: false });
                    return this.handleAuth(user, { alert, redirect: false });
                 }),
                 catchError(error => {
                    const alert = new Alert(AlertType.Error, getErrorMessage(error));
                    return of(AuthActions.confirmEmailFail({ alert }));
                 }),
             )
        })
    ))

    login$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.loginStart),
        switchMap(action => {
            const url = `${environment.API_HOST}users/login`
            return this.http.post<ServerResponse.Login>(url, action.loginData).pipe(
                map(res => {
                    const { token, tokenExpires, user: { _id, name, email } } = res;
                    return new User(_id, email, name, token, tokenExpires);
                }),
                map(user => {
                    return this.handleAuth(user, { redirect: true });
                }),
                catchError(error => {
                    const alert = new Alert(AlertType.Error, getErrorMessage(error));
                    return of(AuthActions.authFail({ alert }));
                })
                
            )
        })
    ))

    autoLogin$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.autoLogin),
        map(action => {
            const userData = localStorage.getItem('user');
            if (!userData) return { type: 'DUMMY' };
            let user = JSON.parse(userData);
            try {
                user = new User(user._id, user.email, user.name, user.token, user.tokenExpires);
                if (user.isTokenValid()) return this.handleAuth(user, { redirect: action.redirect });
                else {
                    localStorage.removeItem('user');
                    return { type: 'DUMMY' };
                }
            } catch (error) {
                localStorage.removeItem('user');
                return { type: 'DUMMY' };
            }
        })
    ))

    authSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.authSuccess),
        tap(() => this.store.dispatch(AccountsActions.fetchAccounts()))
    ), { dispatch: false })

    logout$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
            localStorage.removeItem('user');
            this.authService.clearAutoLogoutTimer();
            this.authService.removeStorageListener();
            this.router.navigate(['/', 'auth', 'login']);
        })
    ), { dispatch: false })

    forgotPassword$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.forgotPassword),
        switchMap(action => {
            const { email } = action;
            const url = `${environment.API_HOST}users/forgot-password`
            return this.http.post<ServerResponse.RequestPasswordResetEmail>(url, { email }).pipe(
                map(res => {
                    const alert = new Alert(AlertType.Success, res.message);
                    return AuthActions.forgotPasswordResult({ alert });
                }),
                catchError(error => {
                    const alert = new Alert(AlertType.Error, getErrorMessage(error));
                    return of(AuthActions.forgotPasswordResult({ alert }))
                })
            )
        })
    ))

    resetPassword$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.resetPassword),
        switchMap(action => {
            const { passwordToken, passwordData } = action;
            const url = `${environment.API_HOST}users/reset-password/${passwordToken}`;
            return this.http.patch<ServerResponse.ResetPassword>(url, passwordData).pipe(
                map(res => {
                    const message = res.message.concat(' You can safely close this tab now.');
                    const alert = new Alert(AlertType.Success, message, { dismissible: false });
                    return AuthActions.forgotPasswordResult({ alert });
                }),
                catchError(error => {
                    const alert = new Alert(AlertType.Error, getErrorMessage(error));
                    return of(AuthActions.resetPasswordResult({ alert }))
                })
            )
        }) 
    ))

    constructor(
        private actions$: Actions,
        private http: HttpClient,
        private authService: AuthService,
        private router: Router,
        private store: Store<fromApp.AppState>
    ) {}



    private handleAuth(user: User, options?: { alert?: Alert, redirect?: boolean }): any {
        const alert = options?.alert || null;
        localStorage.setItem('user', JSON.stringify(user));
        this.authService.autoLogoutUser(user.tokenExpires.getTime() - Date.now());
        this.authService.removeStorageListener();
        if (options?.redirect) this.router.navigate(['/accounts']);
        return AuthActions.authSuccess({ user, alert });
    }
}


