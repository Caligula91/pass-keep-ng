import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';
import * as fromApp from '../store/app.reducer';
import { getUser } from './store/auth.selector';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private store: Store<fromApp.AppState>) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return this.store.pipe(
      select(getUser),
      take(1),
      exhaustMap(user => {
        if (user) {
          return next.handle(request.clone({ headers: request.headers.set("Authorization", "Bearer " + user.token) }));
        }
        return next.handle(request);
      })
    )
  }
}
