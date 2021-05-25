import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from '../store/app.reducer';
import { getAuthState } from './store/auth.selector';
import * as AuthActions from './store/auth.actions';
import { Alert } from '../shared/models/alert.model';
import { AuthService } from './auth.service';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  alert: Alert | null = null;
  storeSub!: Subscription;

  constructor(
    private store: Store<fromApp.AppState>,
    private authService: AuthService) { }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
    this.store.dispatch(AuthActions.clearState());
    this.authService.clearAuthData();
  }

  ngOnInit(): void {
    this.storeSub = this.store.select(getAuthState).subscribe(data => {
      this.alert = data.alert;
      this.isLoading = data.isLoading;
    });

  }

}

