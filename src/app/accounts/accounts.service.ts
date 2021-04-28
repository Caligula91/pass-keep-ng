import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Account } from '../shared/models/account.model';
import { DatabaseService } from '../shared/services/database.service';
import { ClickTargets } from './accounts-card/click-targets.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteConfirmComponent } from '../shared/modals/delete-confirm/delete-confirm.component';
import * as ServerAlert from '../shared/models/server-alert.model';
import { map } from 'rxjs/operators';
import * as ServerResponse from '../shared/models/server-response.model';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import getErrorMessage from '../shared/error-message';

@Injectable({
  providedIn: 'root'
})
export class AccountsService {

  private accounts: Account[] = [];

  accounts$ = new BehaviorSubject<Account[]>(this.accounts.slice());
  accountAction$ = new Subject<{
    type: ClickTargets,
    accountId: string,
    payload?: string,
  }>();
  accountsFilter$ = new BehaviorSubject<{ sortBy: string, order: string, search: string }>({ 
    sortBy: 'name',
    order: 'ASC',
    search: '',
  });

  constructor(private databaseService: DatabaseService, private modalService: NgbModal, private http: HttpClient) { }

  setAccounts(accounts: Account[]): void {
    this.accounts = accounts;
    this.accounts$.next(this.accounts.slice());
  }

  fetchAccounts(): void {
    const action = ServerAlert.ActionTypes.FetchAccounts ;
    this.databaseService.emmitLoading(action);
    this.databaseService.crossComponentAlert$.next({
      action: ServerAlert.ActionTypes.FetchAccounts, 
      status: ServerAlert.Status.Loading,
    })
    this.http.get<ServerResponse.GetMe>(`${environment.API_HOST}users/me`).pipe(
      map(res => res.user.accounts),
      map(accounts => this.castAccountsToArray(accounts))
    ).subscribe(acccounts => {
      this.setAccounts(acccounts);
      this.databaseService.emmitSuccess(action, 'Accounts successfully fetched.');
      this.databaseService.crossComponentAlert$.next({ action: ServerAlert.ActionTypes.FetchAccounts, status: ServerAlert.Status.Success })
    }, error => {
      this.setAccounts([]);
      this.databaseService.emmitError(action, getErrorMessage(error), error.status);
      this.databaseService.crossComponentAlert$.next({ 
        action: ServerAlert.ActionTypes.FetchAccounts, 
        status: ServerAlert.Status.Error, 
        message: getErrorMessage(error) 
      })
    });
  }

  addAccount(newAccount: { name: string, userEmail?: string, password: string, image?: string }) {
    const action = ServerAlert.ActionTypes.AddAccount;
    this.databaseService.emmitLoading(action);
    const url = `${environment.API_HOST}users/account`;
    this.http.put<ServerResponse.AddAccount>(url, newAccount).pipe(
      map(res => res.accounts),
      map(accounts => this.castAccountsToArray(accounts))
    ).subscribe(acccounts => {
      this.setAccounts(acccounts);
      this.databaseService.emmitSuccess(action, 'New account created successfully.');
    }, error => {
      this.databaseService.emmitError(action, getErrorMessage(error), error.status);
    });
  }

  updateAccount(accountId: string, updateFields: { name?: string, userEmail?: string, password?: string, image?: string }) {
    const action = ServerAlert.ActionTypes.UpdateAccount;
    this.databaseService.emmitLoading(action);
    const url = `${environment.API_HOST}users/account/${accountId}`;
    this.http.patch<ServerResponse.UpdateAccount>(url, updateFields).pipe(
      map(res => res.accounts),
      map(accounts => this.castAccountsToArray(accounts))
    ).subscribe(accounts => {
      // UPDATE ACCOUNT, NOT SETTING NEW ACCOUNTS, BECAUSE OF PIPE
      this.updateAccounts(accountId, updateFields);
      this.databaseService.emmitSuccess(action, 'Account updated successfully.');
    }, error => {
      this.databaseService.emmitError(action, getErrorMessage(error), error.status);
    });
  }

  /**
   * ACCOUNT ACTIONS
   */
  getAccountPassword(accountId: string): void {
    const action = ServerAlert.ActionTypes.GetAccountPassword;
    const url = `${environment.API_HOST}users/account/${accountId}`;
    this.http.get<ServerResponse.GetAccountPassword>(url).pipe(
      map(res => res.account.password),
    ).subscribe(password => {
      this.accountAction$.next({ type: ClickTargets.ShowPassword, accountId, payload: password });
      this.databaseService.emmitSuccess(action);
    }, error => {
      this.databaseService.emmitError(action, getErrorMessage(error), error.status);
    })
  }

  startEdit(accountId: string): void {
    this.accountAction$.next({ type: ClickTargets.StartEdit, accountId });
  }

  endEdit(accountId: string): void {
    this.accountAction$.next({ type: ClickTargets.EndEdit, accountId });
  }

  deleteAccount(accountId: string): void {
    const action = ServerAlert.ActionTypes.DeleteAccount;
    this.databaseService.emmitLoading(action);
    this.modalService.open(DeleteConfirmComponent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    const url = `${environment.API_HOST}users/account/${accountId}`;
    this.http.delete<null>(url).subscribe(() => {
        this.setAccounts(this.accounts.filter(acc => acc.id !== accountId));
        this.databaseService.emmitSuccess(action, 'Account deleted successfully.');
        this.accountAction$.next({ type: ClickTargets.DeleteAccount, accountId });
      }, (error) => {
        this.databaseService.emmitError(action, getErrorMessage(error), error.status);
      });
    }, (reason) => {
    })
  }

  addImage(accountId: string): void {
    this.accountAction$.next({ type: ClickTargets.AddImage, accountId });
  }

  togglePasswordVisibility(accountId: string): void {
    this.accountAction$.next({ type: ClickTargets.PasswordVisibility, accountId });
  }

  private castAccountsToArray(accounts: ServerResponse.Accounts): Account[] {
    const accountsArray: Account[] = [];
    accounts.forEach(account => {
      accountsArray.push(new Account(account.name, account.modified, account.image, account._id, account.userEmail));
    }) 
    return accountsArray;
  }

  private updateAccounts(accountId: string, updateFields: { name?: string, userEmail?: string, password?: string, image?: string }) {
    const index = this.accounts.findIndex(acc => acc.id === accountId);
    this.accounts[index].name = updateFields.name || this.accounts[index].name;
    this.accounts[index].userEmail = updateFields.userEmail || this.accounts[index].userEmail;
    this.accounts[index].image = updateFields.image || this.accounts[index].image;
  }

}
