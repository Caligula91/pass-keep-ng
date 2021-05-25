import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import * as ServerResponse from '../../shared/models/server-response.model';

/**
 * CHECK IF EMAIL TOKEN IS VALID
 */
@Injectable({
  providedIn: 'root'
})
export class EmailConfirmationGuard implements CanActivate {

  constructor(private http: HttpClient, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const url = `${environment.API_HOST}users/email-confirmation/${route.params['emailToken']}`;
      return this.http.get<ServerResponse.CheckEmailToken>(url).pipe(
        map(() => true),
        catchError(() => {
          return of(this.router.createUrlTree(['/not-found']));
        })
      )
  }
  
}
