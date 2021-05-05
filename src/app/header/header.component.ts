import { Component, OnDestroy, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import * as fromApp from '../store/app.reducer';
import * as AuthActions from '../auth/store/auth.actions';
import { AccountsService } from '../accounts/accounts.service';
import { User } from '../auth/user.model';
import { Account } from '../shared/models/account.model';
import { getUser } from '../auth/store/auth.selector';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  storeSub!: Subscription;
  user: User | null = null
  accountsObs!: Observable<Account[]>;

  constructor(private accountsService: AccountsService, private store: Store<fromApp.AppState>) { }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
  }

  ngOnInit(): void {

    this.storeSub = this.store.pipe(select(getUser)).subscribe(user => this.user = user);

    this.accountsObs = this.accountsService.accounts$;
    
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }

}
