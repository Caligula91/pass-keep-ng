import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import * as CustomValidators from '../shared/custom-validators';
import { ForgotPasswordComponent } from '../shared/modals/forgot-password/forgot-password.component';
import * as fromApp from '../store/app.reducer';
import { getAuthState } from './store/auth.selector';
import * as AuthActions from './store/auth.actions';
import { Alert } from '../shared/models/alert.model';


@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit, OnDestroy {

  isLoginMode: boolean = true;
  loginForm!: FormGroup;
  signupForm!: FormGroup;
  isLoading: boolean = false;
  loggedIn: boolean = false;
  alert: Alert | null = null;
  storeSub!: Subscription;

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private modalService: NgbModal,
    private store: Store<fromApp.AppState>) { }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
    this.store.dispatch(AuthActions.clearAlert());
  }

  ngOnInit(): void {

    // init login and signup forms
    this.initForms();
    
    this.route.params.subscribe(params => {
      this.isLoginMode = params['mode'] === 'login';
      this.store.dispatch(AuthActions.clearAlert());
      if (this.isLoginMode) this.signupForm.reset();
      else this.loginForm.reset();
    });

    this.storeSub = this.store.select(getAuthState).subscribe(data => {
      this.alert = data.alert;
      this.isLoading = data.isLoading;

      // check if user is logged in or signed up
      this.loggedIn = !!data.user;
      if (this.loggedIn) {
        setTimeout(() => {
          this.router.navigate(['/accounts']);
        }, 500);
      } else if (data.signedupEmail && !this.isLoginMode) {
        this.router.navigate(['/auth/signup/verification']);
      }
    })

  }

  private initForms() {
    this.loginForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, CustomValidators.validPassword]),
    });
    this.signupForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      passwordData: new FormGroup({
        password: new FormControl(null, [Validators.required, Validators.minLength(8), CustomValidators.validPassword]),
        passwordConfirm: new FormControl(null, [Validators.required, Validators.minLength(8), CustomValidators.validPassword]),
      }, { validators: CustomValidators.passwordsMatch })
    }, { validators: CustomValidators.validCharacters })
  }

  onChangeState(): void {
    this.router.navigate(['/', 'auth', (this.isLoginMode)?'signup':'login']);
  }

  onSubmit(): void {
    if (this.isLoginMode) {
      this.store.dispatch(AuthActions.loginStart({ loginData: this.loginForm.value }));
    } else {
      const { name, email, passwordData: { password, passwordConfirm } } = this.signupForm.value;   
      this.store.dispatch(AuthActions.signupStart({ signupData: { name, email, password, passwordConfirm } }))
    }
  }

  onForgotPassword(): void {
    this.modalService.open(ForgotPasswordComponent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.store.dispatch(AuthActions.forgotPassword(result));
    }, (reason) => {
      
    });
  }
}

