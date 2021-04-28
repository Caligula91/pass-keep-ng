import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter, takeWhile, tap } from 'rxjs/operators';
import { DatabaseService } from '../shared/services/database.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  error: string = '';
  private alertSub!: Subscription;

  constructor(private databaseService: DatabaseService) { }

  ngOnDestroy(): void {
    this.alertSub.unsubscribe();
  }

  ngOnInit(): void {

    // CROSS COMPONENT ALERT
    this.databaseService.crossComponentAlert$.pipe(
      filter(alert => alert?.action === 'FETCH_ACCOUNTS'),
      takeWhile(alert => { return alert?.status === 'LOADING' }, true),
      tap(alert => this.isLoading = alert?.status === 'LOADING'),
    ).subscribe(alert => {
      if (alert?.status === 'ERROR') {
        this.error = alert.message || 'unknwon error';
      }
    });

    // REGULAR ALERT
    this.alertSub = this.databaseService.serverAlert$.pipe(
      filter(alert => alert.action === 'FETCH_ACCOUNTS'),
      tap(() => this.error = ''),
      tap(alert => this.isLoading = alert.status === 'LOADING'),
    ).subscribe(alert => {
      if (alert.status === 'ERROR') {
        this.error = alert.message || 'unknown error';
      }
    })
  }

}
