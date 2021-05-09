import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../auth/store/auth.actions';
import * as AccountsActions from '../../../accounts/store/accounts.actions';
import * as UserActions from '../../../user/store/user.actions';
import * as fromApp from '../../../store/app.reducer';
import { Alert, ActionType } from '../../models/alert.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  @Input('alert') alert!: Alert;
  @Input('store') storeSource: string = '';

  constructor(private store: Store<fromApp.AppState>, private router: Router) { }

  ngOnInit(): void {
  }

  onClosed(): void {
    switch(this.storeSource) {
      case 'auth': {
        this.store.dispatch(AuthActions.clearAlert());
        break;
      }
      case 'accounts': {
        this.store.dispatch(AccountsActions.clearAlert());
        break;
      }
      case 'user': {
        this.store.dispatch(UserActions.clearAlert());
        break;
      }
      default: {
        break;
      }
    }
  }

  onAction(action: ActionType): void {
    switch(action) {
      case ActionType.ResendEmailConfirm: {
        // send email again
        
        break;
      }
      case ActionType.FetchUser: {
        this.store.dispatch(UserActions.fetchUser());
        break;
      }
      case ActionType.FetchAccounts: {
        this.store.dispatch(AccountsActions.fetchAccounts());
        break;
      }
      case ActionType.ReturnToAccounts: {
        this.router.navigate(['/accounts']);
        break;
      }
      default: {
        break;
      }
    }
  }

}
