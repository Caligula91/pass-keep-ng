import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';
import * as fromApp from '../store/app.reducer';
import { getUser } from './store/auth.selector';

/**
 * ONLY NOT AUTHENTICATED USER CAN ACCESS THIS ROUTE
 */
@Injectable({
  providedIn: 'root'
})
export class AuthRouteGuard implements CanActivate {

  constructor(private store: Store<fromApp.AppState>, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.pipe(
      select(getUser),
      take(1),
      map(user => {
        if (!user) return true;
        return this.router.createUrlTree(['/']);
      })
    )
  }
  
}
