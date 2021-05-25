import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as CustomValidators from '../../shared/custom-validators';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as fromApp from '../../store/app.reducer';
import { getAuthState } from '../store/auth.selector';
import * as AuthActions from '../store/auth.actions';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordComponent } from 'src/app/shared/modals/forgot-password/forgot-password.component';
import { Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../auth.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  private storeSub!: Subscription;
  loginForm!: FormGroup;
  guardForm!: FormGroup;
  guardMode: boolean = false;

  constructor(
    private store: Store<fromApp.AppState>, 
    private modalService: NgbModal,
    private authService: AuthService,
    private router: Router) { }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
    this.store.dispatch(AuthActions.clearAlert());
    if (this.guardMode) this.authService.loginData$.next(this.loginForm.value);
  }

  ngOnInit(): void {

    this.initForms();

    this.storeSub = this.store.select(getAuthState).subscribe(data => {
      this.guardMode = data.guardMode;
    });

    this.authService.loginData$.pipe(
      take(1),
    ).subscribe(data => {
      if (data) {
        this.loginForm.setValue({
          email: data.email,
          password: data.password,
        });
        this.authService.loginData$.next(null);
      }
    });
  }

  private initForms(): void {

    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, CustomValidators.validPassword]),
    });

    this.guardForm = new FormGroup({
      guardCode: new FormControl(null, Validators.required)
    });
  }

  onSubmit(): void {
    const loginData = {
      ...this.loginForm.value,
      ...this.guardForm.value,
    }

    this.store.dispatch(AuthActions.loginStart({ loginData }));

    // SAVE VALUE
    this.authService.loginData$.next(this.loginForm.value);
  }

  onForgotPassword(): void {
    this.modalService.open(ForgotPasswordComponent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.store.dispatch(AuthActions.forgotPassword(result));
    }, (reason) => {
      
    });
  }

  onSwitchMode(): void {
    this.router.navigate(['/auth/signup']);
  }

  onBackToLogin(): void {
    this.store.dispatch(AuthActions.clearGuard());
    this.authService.loginData$.next(null);
    this.router.navigate(['/auth/login']);
  }

}
