import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { DatabaseService } from 'src/app/shared/services/database.service';
import { AuthService } from '../auth.service';
import * as CustomValidators from '../../shared/custom-validators';


@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.css']
})
export class EmailConfirmationComponent implements OnInit, OnDestroy {

  userEmail: string = '';
  pinForm!: FormGroup;
  alertSub!: Subscription;
  success: string = '';
  error: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private route: ActivatedRoute, private databaseService: DatabaseService) { }

  ngOnDestroy(): void {
    this.alertSub.unsubscribe();
  }

  ngOnInit(): void {    
    this.alertSub = this.databaseService.serverAlert$.pipe(
      filter(alert => alert.action === 'CONFIRM_EMAIL'),
      tap(alert => this.isLoading = alert.status === 'LOADING'),
      tap(() => {
        this.error = '';
        this.success = '';
      })
    ).subscribe(alert => {
      if (alert.status === 'SUCCESS') {
        this.success = alert.message || 'User verified';
      } else if (alert.status === 'ERROR') {
        this.error = alert.message || 'unknown error';
      }
    })


    this.pinForm = new FormGroup({
      pin: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern(/^[0-9]*$/)]),
      pinConfirm: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern(/^[0-9]*$/)])
    }, { validators:  CustomValidators.pinsMatch });
  }

  onSubmit(): void {
    const emailToken = this.route.snapshot.params['emailToken'];
    this.authService.confirmEmail(emailToken, this.pinForm.value).subscribe(email => this.userEmail = email);
  }

}
