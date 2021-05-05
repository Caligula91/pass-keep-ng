import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import * as AuthActions from '../store/auth.actions';
import { Subscription } from 'rxjs';
import * as CustomValidators from '../../shared/custom-validators';
import { getAuthState } from '../store/auth.selector';
import { Alert } from 'src/app/shared/models/alert.model';


@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: ['./email-confirmation.component.css']
})
export class EmailConfirmationComponent implements OnInit, OnDestroy {

  pinForm!: FormGroup;
  isLoading: boolean = false;
  alert: Alert | null = null;
  finished: boolean = false;
  private storeSub!: Subscription;

  constructor(private store: Store<fromApp.AppState>, private route: ActivatedRoute) { }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
    this.store.dispatch(AuthActions.clearAlert());
  }

  ngOnInit(): void { 
    
    this.storeSub = this.store.select(getAuthState).subscribe(data => {
      this.isLoading = data.isLoading;
      this.alert = data.alert;
      this.finished = data.alert?.type === 'SUCCESS'
    })
    
    this.pinForm = new FormGroup({
      pin: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern(/^[0-9]*$/)]),
      pinConfirm: new FormControl(null, [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern(/^[0-9]*$/)])
    }, { validators:  CustomValidators.pinsMatch });
  }

  onSubmit(): void {
    const emailToken = this.route.snapshot.params['emailToken'];
    this.store.dispatch(AuthActions.confirmEmail({ emailToken, pinData: this.pinForm.value }));
  }

}
