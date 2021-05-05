import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { DatabaseService } from '../shared/services/database.service';
import * as ServerResponse from '../shared/models/server-response.model';
import * as ServerAlert from '../shared/models/server-alert.model';
import getErrorMessage from '../shared/error-message';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private databaseService: DatabaseService, private authService: AuthService) { }

  fetchUserInfo(): Observable<ServerResponse.User> {
    const url = `${environment.API_HOST}users/me`;
    const action = ServerAlert.ActionTypes.GetMe;
    this.databaseService.emmitLoading(action);
    return this.http.get<ServerResponse.GetMe>(url).pipe(
      map(res => res.user),
      catchError(error => {
        this.databaseService.emmitError(action, getErrorMessage(error), error.status);
        return throwError(error);
      }),
      tap(() => this.databaseService.emmitSuccess(action, 'User fetched'))
    );
  }

  // private handleUpdateName(res: ServerResponse.UpdateUser): void {
  //   const { user: { _id, email, name,  } } = res;
  //   this.authService.user$.pipe(
  //     take(1),
  //     tap(user => {
  //       if (user) {
  //         const userObj = new User(_id, email, name, user.token, String(user.tokenExpires));
  //         // this.authService.handleAuthentication(userObj);
  //       }
  //     })
  //   ).subscribe();
  // }

  updateName(updateData: { name: string }): Observable<ServerResponse.User> {
    const url = `${environment.API_HOST}users/me`;
    const action = ServerAlert.ActionTypes.UpdateName;
    this.databaseService.emmitLoading(action);
    return this.http.patch<ServerResponse.UpdateUser>(url, updateData).pipe(
      catchError(error => {
        this.databaseService.emmitError(action, getErrorMessage(error), error.status);
        return throwError(error);
      }),
      tap(() => this.databaseService.emmitSuccess(action, 'User name updated')),
      //tap(user => this.handleUpdateName(user)),
      map(res => res.user),
    );
  }

  private handleUpdatePassword(res: ServerResponse.UpdatePassword) {
    const { token, tokenExpires, user: { _id, email, name,  } } = res;
    const userObj = new User(_id, email, name, token, tokenExpires);
    // this.authService.handleAuthentication(userObj);
  }

  updatePassword(passwordData: { passwordCurrent: string, password: string, passwordConfirm: string }): Observable<ServerResponse.User> {
    const url = `${environment.API_HOST}users/me/update-password`;
    const action = ServerAlert.ActionTypes.UpdatePassword;
    this.databaseService.emmitLoading(action);
    return this.http.patch<ServerResponse.UpdatePassword>(url, passwordData).pipe(
      catchError(error => {
        this.databaseService.emmitError(action, getErrorMessage(error), error.status);
        return throwError(error);
      }),
      tap(() => this.databaseService.emmitSuccess(action, 'Password updated')),
      tap(res => this.handleUpdatePassword(res)),
      map(res => res.user),
    );
  }

  deactivateUser() {
    const url = `${environment.API_HOST}users/me/deactivate`;
    const action = ServerAlert.ActionTypes.DeactivateUser;
    this.databaseService.emmitLoading(action);
    this.http.patch<ServerResponse.DeactivateUser>(url, {}).pipe(
      catchError(error => {
        this.databaseService.emmitError(action, getErrorMessage(error), error.status);
        return throwError(error);
      }),
      tap(res => this.databaseService.crossComponentAlert$.next({ status: ServerAlert.Status.Success, action, message: res.message })),
      // tap(() => this.authService.logout())
    ).subscribe()
  }

  deleteUser(password: string) {
    const url = `${environment.API_HOST}users/me/delete`;
    const action = ServerAlert.ActionTypes.DeleteUser;
    this.databaseService.emmitLoading(action);
    this.http.post<ServerResponse.DeactivateUser>(url, { password }).pipe(
      catchError(error => {
        this.databaseService.emmitError(action, getErrorMessage(error), error.status);
        return throwError(error);
      }),
      tap(res => 
        this.databaseService.crossComponentAlert$.next({ status: ServerAlert.Status.Success, action, message: res.message })),
     // tap(() => this.authService.logout())
    ).subscribe()
  }

  resetPin(pinData: { password: string, pin: string, pinConfirm: string }): void {
    const url = `${environment.API_HOST}users/me/reset-pin`;
    const action = ServerAlert.ActionTypes.ResetPin;
    this.databaseService.emmitLoading(action);
    this.http.patch<ServerResponse.ResetPin>(url, pinData).pipe(
      catchError(error => {
        this.databaseService.emmitError(action, getErrorMessage(error), error.status);
        return throwError(error);
      }),
      tap(res => this.databaseService.emmitSuccess(action, res.message))
    ).subscribe()
  }
}
