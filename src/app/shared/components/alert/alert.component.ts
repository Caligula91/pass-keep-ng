import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from '../../../auth/store/auth.actions';
import * as fromApp from '../../../store/app.reducer';
import { Alert, ActionType } from '../../models/alert.model';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {

  @Input('alert') alert!: Alert;

  constructor(private store: Store<fromApp.AppState>) { }

  ngOnInit(): void {
  }

  onClosed(): void {
    this.store.dispatch(AuthActions.clearAlert());
  }

  onAction(action: ActionType): void {
    switch(action) {
      case ActionType.ResendEmailConfirm: {
        console.log('send email again')
        // send email again
        break;
      }
      case ActionType.FetchUser: {
        console.log('send getMe http request again');
        // send getMe http request again
        break;
      }
      case ActionType.FetchAccounts: {
        console.log('fetch accounts via http again');
        // fetch accounts via http again
        break;
      }
      default: {
        break;
      }
    }
  }

}
