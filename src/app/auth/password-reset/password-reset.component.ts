import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { DatabaseService } from 'src/app/shared/services/database.service';
import * as CustomValidators from '../../shared/custom-validators';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit, OnDestroy {

  resetForm!: FormGroup;
  error: string = '';
  success: string = '';
  isLoading: boolean = false;
  alertSub!: Subscription;
  private passwordToken: string = '';

  constructor(private databaseService: DatabaseService, private authService: AuthService, private route: ActivatedRoute) { }

  ngOnDestroy(): void {
    this.alertSub.unsubscribe();
  }

  ngOnInit(): void {
    this.passwordToken = this.route.snapshot.params['passwordToken'];

    this.resetForm = new FormGroup({
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      passwordConfirm: new FormControl(null, [Validators.required, Validators.minLength(8)]),
    }, { validators: CustomValidators.passwordsMatch } );

    this.alertSub = this.databaseService.serverAlert$.pipe(
      filter(alert => alert.action === 'RESET_PASSWORD'),
      tap(alert => this.isLoading = alert.status === 'LOADING'),
      tap(() => {
        this.error = '';
        this.success = '';
      }),
    ).subscribe(alert => {
      if (alert.status === 'SUCCESS') {
        this.success = alert.message || 'Password has been reset successfully';
        
      } else if (alert.status === 'ERROR') {
        this.error = alert.message || 'unknown error';
      }
    });
  }

  onSubmit(): void {
    this.authService.resetPassword(this.passwordToken, this.resetForm.value);
  }

}
