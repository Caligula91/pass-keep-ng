import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as AuthActions from './store/auth.actions';
import * as fromApp from '../store/app.reducer';
import { Alert, AlertType } from '../shared/models/alert.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenExpTimer: any;
  loginData$ = new BehaviorSubject<{ email: string, password: string } | null>(null);
  signupData$ = new BehaviorSubject<{ name: string, email: string, password: string, passwordConfirm: string } | null>(null);

  constructor(private store: Store<fromApp.AppState>) { }

  /**
   * STORAGE LISTENER
   */
  private storageHandler = () => {
    const user = window.localStorage.getItem('user');
    if (user) {
      this.store.dispatch(AuthActions.autoLogin({ redirect: true }));
    }   
  }

  addStorageListener(): void {
    window.addEventListener('storage', this.storageHandler);
  }

  removeStorageListener(): void {
    window.removeEventListener('storage', this.storageHandler);
  }

  /**
   * AUTO LOGOUT TIMER
   */
  autoLogoutUser(expDuration: number): void {

    // clear old timer if exists
    this.clearAutoLogoutTimer();

    // 2147483647 max value for setTimeout()
    if (expDuration > 2147483647) {
      this.tokenExpTimer = setTimeout(() => {
          this.autoLogoutUser(expDuration - 2147483647);
      }, 2147483647);
    } else {
      this.tokenExpTimer = setTimeout(() => {
        const alert = new Alert(AlertType.Warning, 'Token expired. User logged out. Please login again.');
        this.store.dispatch(AuthActions.logout({ alert }));
      }, expDuration);
    }
  }

  clearAutoLogoutTimer(): void {
    if (this.tokenExpTimer) {
      clearTimeout(this.tokenExpTimer);
      this.tokenExpTimer = null;   
    }
  }

  clearAuthData(): void {
    this.loginData$.next(null);
    this.signupData$.next(null);
  }

}