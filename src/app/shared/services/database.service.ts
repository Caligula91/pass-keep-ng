import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import * as ServerResponse from '../models/server-response.model';
import * as ServerAlert from '../models/server-alert.model';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  serverAlert$ = new Subject<ServerAlert.ServerAlert>();

  crossComponentAlert$ = new BehaviorSubject<ServerAlert.ServerAlert | null>(null)

  constructor(private http: HttpClient) { }

  /**
   * ICONS HTTP
   */
  fetchIcons(): Observable<string[]> {
    return this.http.get<ServerResponse.GetImages>(`${environment.API_DOMAIN}img`).pipe(
      map(res => res.images)
    )
  }

  /**
   * SERVER ALERT
   */
  emmitLoading(action: ServerAlert.ActionTypes, message?: string, payload?: string | number) {
    this.serverAlert$.next({ status: ServerAlert.Status.Loading, action, message, payload });
  }

  emmitSuccess(action: ServerAlert.ActionTypes, message?: string, payload?: string | number) {
    this.serverAlert$.next({ status: ServerAlert.Status.Success, action, message, payload });
  }

  emmitError(action: ServerAlert.ActionTypes, message?: string, payload?: string | number) {
    this.serverAlert$.next({ status: ServerAlert.Status.Error, action, message, payload });
  }

}
