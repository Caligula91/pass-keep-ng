import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { exhaustMap, take } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {

    return this.authService.user$.pipe(
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
