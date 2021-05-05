import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import * as fromApp from '../../store/app.reducer';
import { getAuthState } from '../store/auth.selector';

@Injectable({
  providedIn: 'root'
})
export class SignedupGuard implements CanActivate {

  constructor(private store: Store<fromApp.AppState>, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.store.pipe(
      select(getAuthState),
      take(1),
      map(data => {
        if (data.signedupEmail) return true;
        return this.router.createUrlTree(['/auth/login']);
      })
    )
  }
  
}
