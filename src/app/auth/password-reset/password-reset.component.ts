import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as AuthActions from '../store/auth.actions';
import * as fromApp from '../../store/app.reducer';
import { getAuthState } from '../store/auth.selector';
import * as CustomValidators from '../../shared/custom-validators';
import { Alert } from 'src/app/shared/models/alert.model';


@Component({
  selector: 'app-password-reset',
  templateUrl: './password-reset.component.html',
  styleUrls: ['./password-reset.component.css']
})
export class PasswordResetComponent implements OnInit, OnDestroy {

  resetForm!: FormGroup;
  private storeSub!: Subscription;
  isLoading: boolean = false;
  finished: boolean = false;
  alert: Alert | null = null;

  constructor(private route: ActivatedRoute, private store: Store<fromApp.AppState>) { }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
    this.store.dispatch(AuthActions.clearAlert());
  }

  ngOnInit(): void {

    this.resetForm = new FormGroup({
      password: new FormControl(null, [Validators.required, Validators.minLength(8)]),
      passwordConfirm: new FormControl(null, [Validators.required, Validators.minLength(8)]),
    }, { validators: CustomValidators.passwordsMatch } );

    this.storeSub = this.store.pipe(select(getAuthState)).subscribe(data => {
      this.isLoading = data.isLoading;
      this.alert = data.alert;
      this.finished = data.alert?.type === 'SUCCESS';
    })

  }

  onSubmit(): void {
    this.store.dispatch(AuthActions.resetPassword({ 
      passwordToken: this.route.snapshot.params['passwordToken'],
      passwordData: this.resetForm.value,
    }))
  }

}
