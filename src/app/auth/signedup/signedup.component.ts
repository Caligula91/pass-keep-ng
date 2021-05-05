import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import * as AuthActions from '../store/auth.actions';
import * as fromApp from '../../store/app.reducer';
import { getAuthState } from '../store/auth.selector';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signedup',
  templateUrl: './signedup.component.html',
  styleUrls: ['./signedup.component.css']
})
export class SignedupComponent implements OnInit, OnDestroy {

  isLoading: boolean = false;
  message: string = '';
  email: string = '';
  private storeSub!: Subscription;
  
  constructor(private store: Store<fromApp.AppState>, private router: Router) { }

  ngOnDestroy(): void {
    this.storeSub.unsubscribe();
    this.store.dispatch(AuthActions.clearSignedupEmail());
  }

  ngOnInit(): void {

    this.storeSub = this.store.select(getAuthState).subscribe(data => {
      this.email = data.signedupEmail || '';
      this.message = data.alert?.message || '';
      this.isLoading = data.isLoading;
    })

  }

  reSendEmail(): void {
    this.store.dispatch(AuthActions.ResendEmailConfirm({ email: this.email }));
  }

  onBackToSignup(): void {
    this.store.dispatch(AuthActions.clearSignedupEmail());
    this.router.navigate(['/auth/signup']);
  }

}
