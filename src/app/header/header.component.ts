import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import { User } from '../auth/user.model';
import { Account } from '../shared/models/account.model';
import { getUser } from '../auth/store/auth.selector';
import { getAccounts } from '../accounts/store/accounts.selector';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  accounts$!: Observable<Account[] | null>;
  userStoreSub!: Subscription;
  user: User | null = null

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnDestroy(): void {
    this.userStoreSub.unsubscribe();
  }

  ngOnInit(): void {

    this.userStoreSub = this.store.select(getUser).subscribe(user => this.user = user);

    this.accounts$ = this.store.select(getAccounts);
    
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

}
