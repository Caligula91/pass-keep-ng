import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AccountsService } from '../accounts/accounts.service';
import { AuthService } from '../auth/auth.service';
import { Account } from '../shared/models/account.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  authSub!: Subscription;
  name: string | undefined;
  accountsObs!: Observable<Account[]>;

  constructor(private authService: AuthService, private accountsService: AccountsService) { }

  ngOnDestroy(): void {
    this.authSub.unsubscribe();
  }

  /**
   * LISTEN WHEN LOGGED IN/OUT AND UPDATE HEADER ACCORDINGLY
   */
  ngOnInit(): void {
    this.authSub = this.authService.user$.pipe(
      tap(user => {
        if (user) {
          this.name = user.name;
          this.accountsService.fetchAccounts();
        } else {
          this.name = '';
        }
      }),
    ).subscribe();

    this.accountsObs = this.accountsService.accounts$;
  }

  logout(): void {
    this.authService.logout();
  }

}
