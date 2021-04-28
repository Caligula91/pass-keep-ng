import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/auth.service';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {

  resetForm!: FormGroup;
  alertSub!: Subscription;
  isLoading: boolean = false;
  error: string = '';
  success: string = '';

  constructor(
    public activeModal: NgbActiveModal, 
    private databaseService: DatabaseService,
    private authService: AuthService) { }

  ngOnDestroy(): void {
    this.alertSub.unsubscribe();
  }

  ngOnInit(): void {

    this.resetForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email])
    });

    this.alertSub = this.databaseService.serverAlert$.pipe(
      filter(alert => alert.action === 'FORGOT_PASSWORD'),
      tap(alert => this.isLoading = alert.status === 'LOADING'),
      tap(() => {
        this.error = '';
        this.success = '';
      })
    ).subscribe(alert => {
      if (alert.status === 'ERROR') {
        this.error = alert.message || 'unknown error';
      } else if (alert.status === 'SUCCESS') {
        this.success = alert.message || 'email sent';
        this.resetForm.reset();
      }
    });
  }

  onSubmit(): void {
    this.authService.forgotPassword(this.resetForm.get('email')?.value);
  }

}
