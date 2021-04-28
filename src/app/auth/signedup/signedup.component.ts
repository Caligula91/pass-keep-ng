import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { filter, take, tap } from 'rxjs/operators';
import { DatabaseService } from 'src/app/shared/services/database.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signedup',
  templateUrl: './signedup.component.html',
  styleUrls: ['./signedup.component.css']
})
export class SignedupComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  message: string = '';
  private alertSub!: Subscription;
  
  constructor(private databaseService: DatabaseService, private authService: AuthService) { }

  ngOnDestroy(): void {
    this.alertSub.unsubscribe();
  }

  ngOnInit(): void {
    this.alertSub = this.databaseService.serverAlert$.pipe(
      filter(alert => {
        return alert.action === 'RESEND_EMAIL';
      }),
      tap(alert => this.isLoading = alert.status === 'LOADING'),
      filter(alert => alert.status !== 'LOADING')
    ).subscribe(alert => {
      this.message = alert.message || 'something happened';
    })

  }

  reSendEmail(): void {
    this.authService.signedup$.pipe(
      take(1),
      tap(data => {
        if (data) {
          this.authService.reSendEmail(data?.email);
          this.message = data.message;
        }
      })
    ).subscribe();
  }

}
