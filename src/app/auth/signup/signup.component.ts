import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from '../../store/app.reducer';
import * as CustomValidators from '../../shared/custom-validators';
import { getAuthState } from '../store/auth.selector';
import * as AuthActions from '../store/auth.actions';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  signupForm!: FormGroup;
  private storeSub!: Subscription;
  signedupEmail: string  = '';
  message: string = '';

  constructor(
    private store: Store<fromApp.AppState>, 
    private router: Router,
    private authService: AuthService) { }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
    this.store.dispatch(AuthActions.clearAlert());
  }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      passwordData: new FormGroup({
        password: new FormControl(null, [Validators.required, Validators.minLength(8), CustomValidators.validPassword]),
        passwordConfirm: new FormControl(null, [Validators.required, Validators.minLength(8), CustomValidators.validPassword]),
      }, { validators: CustomValidators.passwordsMatch })
    }, { validators: CustomValidators.validCharacters });

    this.storeSub = this.store.select(getAuthState).subscribe(data => {
      this.signedupEmail = data.signedupEmail || '';
      this.message = data.alert?.message || '';
    });

    this.authService.signupData$.pipe(
      take(1)
    ).subscribe(data => {
      if (data) {
        this.signupForm.setValue({
          name: data.name,
          email: data.email,
          passwordData: {
            password: data.password,
            passwordConfirm: data.passwordConfirm,
          }
        });
        this.authService.signupData$.next(null);
      }
    });
  }

  onSubmit(): void {
    const { name, email, passwordData: { password, passwordConfirm } } = this.signupForm.value;   
    this.store.dispatch(AuthActions.signupStart({ signupData: { name, email, password, passwordConfirm } }));
    this.authService.signupData$.next({ name, email, password, passwordConfirm });
    
  }

  onSwitchMode(): void {
    this.router.navigate(['/auth/login']);
  }

  onBackToSignup(): void {
    this.store.dispatch(AuthActions.clearSignedupEmail());
    this.router.navigate(['/auth/signup']);
  }

}
