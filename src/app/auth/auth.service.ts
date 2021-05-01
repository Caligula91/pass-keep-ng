import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { DatabaseService } from '../shared/services/database.service';
import * as ServerResponse from '../shared/models/server-response.model';
import * as ServerAlert from '../shared/models/server-alert.model';
import { User } from './user.model';
import getErrorMessage from '../shared/error-message';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user$ = new BehaviorSubject<User | null>(null);
  signedup$ = new BehaviorSubject<{ email: string, message: string } | null>(null);
  private tokenExpTimer: any;

  constructor(private http: HttpClient, private databaseService: DatabaseService, private router: Router) { }

  /**
   * LOGIN
   */
  login(authData: { email: string, password: string }) {
    const action = ServerAlert.ActionTypes.Login;
    this.databaseService.emmitLoading(action);
    const url = `${environment.API_HOST}users/login`
    this.http.post<ServerResponse.Login>(url, authData).pipe(
      map(res => {
        const { 
          token, 
          tokenExpires, 
          user: { _id, name, email } } = res
        return new User(_id, email, name, token, tokenExpires);
      })
    ).subscribe(user => {
      this.handleAuthentication(user);
      this.databaseService.emmitSuccess(action, 'Logged in successfully');
    }, error => {
      this.databaseService.emmitError(action, getErrorMessage(error));
    })
  }

  /**
   * SIGNUP
   */
  signup(authData: { name: string, email: string, password: string, passwordConfirm: string }) {
    const action = ServerAlert.ActionTypes.Signup;
    this.databaseService.emmitLoading(action);
    const url = `${environment.API_HOST}users/signup`;
    this.http.post<ServerResponse.Signup>(url, authData).subscribe(res => {
      this.databaseService.emmitSuccess(action, res.message);
      this.addStorageListener();
    }, error => {
      this.databaseService.emmitError(action, getErrorMessage(error));
    })
  }

  /**
   * RESEND EMAIL CONFIRMATION
   */
  reSendEmail(email: string): void {
    const url = `${environment.API_HOST}users/resend-email-confirm`;
    const action = ServerAlert.ActionTypes.ReSendEmail;
    this.databaseService.emmitLoading(action);
    this.http.post<ServerResponse.ReSendEmail>(url, { email }).subscribe(res => {
      this.databaseService.emmitSuccess(action, res.message);
    }, error => {
      this.databaseService.emmitError(action, getErrorMessage(error));
    })
  }

  /**
   * STORAGE LISTENER
   */
  private storageHandler = () => {
    const user = window.localStorage.getItem('user');
    if (user) {
      this.autoLogin();
    }   
  }

  addStorageListener(): void {
    window.addEventListener('storage', this.storageHandler);
  }

  /**
   * AUTO LOGIN
   */
  autoLogin(): void {
    const userData = localStorage.getItem('user');
    if (!userData) return;
    const user = JSON.parse(userData);
    try {
      const userObj = new User(user._id, user.email, user.name, user.token, user.tokenExpires);
      if (userObj.isTokenValid()) {
        this.handleAuthentication(userObj);
      }
      else localStorage.removeItem('user');
    } catch (error) {
      localStorage.removeItem('user');
    }
  }

  /**
   * LOGOUT
   */
  logout(): void {
    this.user$.next(null);
    localStorage.removeItem('user');
    if (this.tokenExpTimer) {
      clearTimeout(this.tokenExpTimer);
    }
    window.removeEventListener('storage', this.storageHandler);
    this.tokenExpTimer = null;
    this.router.navigate(['/', 'auth', 'login']);
  }

  /**
   * AUTO LOGOUT TIMER
   */
  private autoLogoutUser(expDuration: number): void {
    // 2147483647 max value for setTimeout()
    if (expDuration > 2147483647) {
      this.tokenExpTimer = setTimeout(() => {
          this.autoLogoutUser(expDuration - 2147483647);
      }, 2147483647);
    } else {
      this.tokenExpTimer = setTimeout(() => {
        this.logout();
      }, expDuration);
    }
  }

  /**
   * HANDLE NEW USER DATA
   */
  handleAuthentication(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
    this.autoLogoutUser(user.tokenExpires.getTime() - Date.now());
    this.user$.next(user);
    this.signedup$.pipe(
      take(1),
    ).subscribe(data => {
      if (data) {
        this.router.navigate(['/', 'accounts']);
        this.signedup$.next(null);
      }    
    });
    window.removeEventListener('storage', this.storageHandler);
  }

  /**
   * EMAIL CONFIRMATION
   */
  confirmEmail(emailToken: string, pinData: { pin: string, pinConfirm: string }): Observable<string> {
    const url = `${environment.API_HOST}users/email-confirmation/${emailToken}`;
    const action = ServerAlert.ActionTypes.ConfirmEmail;
    this.databaseService.emmitLoading(action);
    return this.http.post<ServerResponse.EmailConfirmation>(url, pinData).pipe(
      tap(res => this.databaseService.emmitSuccess(action, 'You have verified your email')),
      map(res => {
        const { 
          token, 
          tokenExpires, 
          user: { _id, name, email } } = res;
        return new User(_id, email, name, token, tokenExpires);
      }),
      tap(user => this.handleAuthentication(user)),
      map(user => user.email),
      catchError(error => {
         this.databaseService.emmitError(action, getErrorMessage(error));
         return throwError(error)
      })
    );
  }

  deletePendingAccount(emailToken: string) : Observable<null> {
    const url = `${environment.API_HOST}users/email-confirmation/${emailToken}`;
    return this.http.delete<null>(url);
  }

  checkEmailToken(emailToken: string): Observable<boolean> {
    const url = `${environment.API_HOST}users/email-confirmation/${emailToken}`;
    return this.http.get<ServerResponse.CheckEmailToken>(url).pipe(
      map(() => true),
      catchError(error => of(false))
    );
  }

  /**
   * RESET PASSWORD
   */
  resetPassword(passwordToken: string, passwordData: { password: string, passwordConfirm: string }) {
    const url = `${environment.API_HOST}users/reset-password/${passwordToken}`;
    const action = ServerAlert.ActionTypes.ResetPassword;
    this.databaseService.emmitLoading(action);
    this.http.patch<ServerResponse.ResetPassword>(url, passwordData).subscribe(res => {
      this.databaseService.emmitSuccess(action, res.message);
    }, error => {
      this.databaseService.emmitError(action, getErrorMessage(error));
    })
  }

  /**
   * REQUEST RESET PASSWORD EMAIL
   */
  forgotPassword(email: string): void {
    const url = `${environment.API_HOST}users/forgot-password`
    const action = ServerAlert.ActionTypes.ForgotPassword;
    this.databaseService.emmitLoading(action);
    this.http.post<ServerResponse.RequestPasswordResetEmail>(url, { email }).subscribe(res => {
      this.databaseService.emmitSuccess(action, res.message);
    }, error => {
      this.databaseService.emmitError(action, getErrorMessage(error));
    });
  }

}