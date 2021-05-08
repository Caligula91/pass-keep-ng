import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { Alert } from '../shared/models/alert.model';
import * as fromApp from '../store/app.reducer';
import * as AccountsActions from './store/accounts.actions';
import { getAccountsState } from './store/accounts.selector';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  accountsFetched: boolean = false;
  alert: Alert | null = null;
  accountsStoreSub!: Subscription;
  //  beacuse of race condition, just in case :)
  reload: boolean = false;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnDestroy(): void {
    this.accountsStoreSub.unsubscribe();
    this.store.dispatch(AccountsActions.clearAlert());
  }

  ngOnInit(): void {
    this.accountsStoreSub = this.store.select(getAccountsState).subscribe(data => {
      this.accountsFetched = !!data.accounts;
      if (!data.focusedAccount) {
        this.alert = data.alert;
        this.isLoading = data.isLoading;
      } else {
        this.alert = null;
      }
      this.reload = !data.alert && !data.accounts;
    })
  }

  onReload(): void {
    this.store.dispatch(AccountsActions.fetchAccounts());
  }

}
