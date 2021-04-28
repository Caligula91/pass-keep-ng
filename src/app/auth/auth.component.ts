import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DatabaseService } from '../shared/services/database.service';
import { AuthService } from './auth.service';
import * as ServerAlert from '../shared/models/server-alert.model';
import * as CustomValidators from '../shared/custom-validators';
import { filter, finalize, take, tap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ForgotPasswordComponent } from '../shared/modals/forgot-password/forgot-password.component';

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
  error: string = '';
  emailSent: string = '';
  loggedIn: boolean = false;
  alertSub!: Subscription;
  deactivateDeleteMessage: string = '';

  constructor(
    private router: Router, 
    private route: ActivatedRoute, 
    private authService: AuthService, 
    private databaseService: DatabaseService,
    private modalService: NgbModal) { }

  ngOnDestroy(): void {
    this.alertSub.unsubscribe();
  }

  ngOnInit(): void {
    this.initForms();
    
    this.route.params.subscribe(params => {
      this.isLoginMode = params['mode'] === 'login';
      this.error = '';
      if (this.isLoginMode) this.signupForm.reset();
      else this.loginForm.reset();
    });

    this.alertSub = this.databaseService.serverAlert$.pipe(
      filter(alert => {
        return alert.action === 'LOGIN' || alert.action === 'SIGNUP' || alert.action === 'RESEND_EMAIL';
      }),
      tap(alert => {
        this.isLoading = alert.status === 'LOADING';
      }),
      tap(() => {
        this.error = '';
        this.emailSent = '';
        this.deactivateDeleteMessage = '';
      })).
      subscribe(alert => {
        if (alert.status === 'SUCCESS') {
          this.handleAuthSuccess(alert);
        } else if (alert.status === 'ERROR') {
          this.error = alert.message || 'unknown error';
        }
    })

    /**
     * CROSS COMPONENT ALERT
     */
    this.databaseService.crossComponentAlert$.pipe(
      take(1),
      finalize(() => this.databaseService.crossComponentAlert$.next(null))
    ).subscribe(alert => {
      if (alert && (alert.action === 'DEACTIVATE_USER' || alert?.action === 'DELETE_USER')) {
        this.deactivateDeleteMessage = alert.message || 'User deactivate/deleted';
      }
    })

  }

  private handleAuthSuccess(alert: ServerAlert.ServerAlert): void {
    const action = alert.action;
    if (action === 'LOGIN') {
      this.loggedIn = true;
      setTimeout(() => {
        this.router.navigate(['/accounts']);
      }, 500);
    } else if (action === 'SIGNUP') {
      this.authService.addStorageListener();
      this.authService.signedup$.next({ 
        email: this.signupForm.get('email')?.value,
        message: alert.message || 'Signeup successfully' });
      this.router.navigate(['/auth/signup/verification']);
    } else if (action === 'RESEND_EMAIL') {
      this.emailSent = alert.message || 'Email Sent again';
    }
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
      this.authService.login(this.loginForm.value);
    } else {
      const { name, email, passwordData: { password, passwordConfirm } } = this.signupForm.value;
      this.authService.signup({ name, email, password, passwordConfirm });      
    }
  }

  reSendEmail(): void {
    this.authService.reSendEmail(this.loginForm.get('email')?.value);
  }

  onForgotPassword(): void {
    this.modalService.open(ForgotPasswordComponent, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      
    }, (reason) => {
      
    });
  }
}

