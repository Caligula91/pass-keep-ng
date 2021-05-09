import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { catchError, map, mergeMap, switchMap } from "rxjs/operators";
import * as AccountsActions from './accounts.actions';
import * as AuthActions from '../../auth/store/auth.actions';
import * as ServerResponse from '../../shared/models/server-response.model';
import { environment } from "src/environments/environment";
import { Alert, AlertType, ActionType } from "src/app/shared/models/alert.model";
import getErrorMessage from '../../shared/error-message';
import { of } from "rxjs";
import { Account } from "src/app/shared/models/account.model";

@Injectable()
export class AccountsEffects {

    fetchAccounts$ = createEffect(() => this.actions$.pipe(
        ofType(AccountsActions.fetchAccounts),
        switchMap(() => {
            return this.http.get<ServerResponse.FetchAccounts>(`${environment.API_HOST}accounts`).pipe(
                map(res => res.accounts),
                map(accounts => this.castAccountsToArray(accounts)),
                map(accounts => AccountsActions.setAccounts({ accounts })),
                catchError(error => {
                    const alert = new Alert(AlertType.Error, getErrorMessage(error), { dismissible: false, action: ActionType.FetchAccounts });
                    return of(AccountsActions.fetchAccountsFail({ alert }));
                })
            )
        })
    ))

    addAccount$ = createEffect(() => this.actions$.pipe(
        ofType(AccountsActions.addAccount),
        switchMap(action => {
            const { newAccount } = action;
            const url = `${environment.API_HOST}accounts`;
            return this.http.put<ServerResponse.AddAccount>(url, newAccount).pipe(
                map(res => res.accounts),
                map(accounts => this.castAccountsToArray(accounts)),
                map(accounts => {
                    const alert = new Alert(AlertType.Success, 'New account created successfully.', { action: ActionType.ReturnToAccounts });
                    return AccountsActions.addAccountSuccess({ accounts, alert });
                }),
                catchError(error => {
                    const alert = new Alert(AlertType.Error, getErrorMessage(error));
                    return of(AccountsActions.addAccountFail({ alert }));
                })
            )
        })
    ))

    fetchPassword$ = createEffect(() => this.actions$.pipe(
        ofType(AccountsActions.fetchPassword),
        mergeMap(action => {
            const { accountId, pin } = action;
            const url = `${environment.API_HOST}accounts/${accountId}`;
            return this.http.post<ServerResponse.GetAccountPassword>(url, { pin }).pipe(
                map(res => res.account.password),
                map(password => AccountsActions.fetchPasswordSuccess({ password, accountId })),
                catchError(error => {
                    const alert = new Alert(AlertType.Error, getErrorMessage(error));
                    return of(AccountsActions.fetchPasswordFail({ alert, accountId }));
                })
            )
        })
    ))

    fetchPasswordSuccess$ = createEffect(() => this.actions$.pipe(
        ofType(AccountsActions.fetchPasswordSuccess),
        map(() => AccountsActions.clearPassword()),
    ))

    updateAccount$ = createEffect(() => this.actions$.pipe(
        ofType(AccountsActions.updateAccount),
        mergeMap(action => {
            const { accountId, updateFields } = action;
            const url = `${environment.API_HOST}accounts/${accountId}`;
            return this.http.patch<ServerResponse.UpdateAccount>(url, updateFields).pipe(
                map(res => this.castAccountsToArray(res.accounts)),
                map(accounts => {
                    const alert = new Alert(AlertType.Success, 'Account updated successfully.');
                    return AccountsActions.updateAccountSuccess({ alert, accounts });
                }),
                catchError(error => {
                    const alert = new Alert(AlertType.Error, getErrorMessage(error));
                    return of(AccountsActions.updateAccountFail({ alert, accountId }));
                })
            )
        })
    ))

    deleteAccount$ = createEffect(() => this.actions$.pipe(
        ofType(AccountsActions.deleteAccount),
        mergeMap(action => {
            const { accountId } = action;
            const url = `${environment.API_HOST}accounts/${accountId}`;
            return this.http.delete<null>(url).pipe(
                map(() => {
                    const alert = new Alert(AlertType.Success, 'Account deleted successfully.');
                    return AccountsActions.deleteAccountSuccess({ alert, accountId })
                }),
                catchError(error => {
                    const alert = new Alert(AlertType.Error, getErrorMessage(error));
                    return of(AccountsActions.deleteAccountFail({ alert, accountId }));
                })
            )
        })
    ))

    logout$ = createEffect(() => this.actions$.pipe(
        ofType(AuthActions.logout),
        map(() => AccountsActions.clearAccounts())
    ))

    constructor(
        private actions$: Actions,
        private http: HttpClient) {}

    private castAccountsToArray(accounts: ServerResponse.Accounts): Account[] {
        const accountsArray: Account[] = [];
        accounts.forEach(account => {
            accountsArray.push(new Account(account.name, account.modified, account.image, account._id, account.userEmail));
        })
        return accountsArray;
    }

}