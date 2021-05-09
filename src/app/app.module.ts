import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AccountsComponent } from './accounts/accounts.component';
import { AccountsFilterComponent } from './accounts/accounts-list/accounts-filter/accounts-filter.component';
import { AccountsCardComponent } from './accounts/accounts-card/accounts-card.component';
import { AccountsListComponent } from './accounts/accounts-list/accounts-list.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IconsSelectorComponent } from './shared/modals/icons-selector/icons-selector.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DeleteConfirmComponent } from './shared/modals/delete-confirm/delete-confirm.component';
import { LoadingSpinnerComponent } from './shared/components/loading-spinner/loading-spinner.component';
import { AccountsFilterPipe } from './accounts/accounts-list/accounts-filter.pipe';
import { IconsFilterPipePipe } from './shared/modals/icons-selector/icons-filter-pipe.pipe';
import { AuthComponent } from './auth/auth.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { HomeComponent } from './home/home.component';
import { EmailConfirmationComponent } from './auth/email-confirmation/email-confirmation.component';
import { EmailConfirmationDeleteComponent } from './auth/email-confirmation-delete/email-confirmation-delete.component';
import { FirstWordPipe } from './header/first-word.pipe';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { PasswordVisibilityDirective } from './shared/directives/password-visibility.directive';
import { CardChoiceComponent } from './shared/modals/card-choice/card-choice.component';
import { CheckmarkComponent } from './shared/components/checkmark/checkmark.component';
import { SignedupComponent } from './auth/signedup/signedup.component';
import { ForgotPasswordComponent } from './shared/modals/forgot-password/forgot-password.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { UserComponent } from './user/user.component';
import { UserOptionsComponent } from './shared/modals/user-options/user-options.component';
import { PinEnterComponent } from './shared/modals/pin-enter/pin-enter.component';
import { LoadingDotsComponent } from './shared/components/loading-dots/loading-dots.component';

import { StoreModule } from "@ngrx/store";
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import * as fromApp from './store/app.reducer';
import { environment } from 'src/environments/environment';
import { AlertComponent } from './shared/components/alert/alert.component';
import { AlertActionMessagePipe } from './shared/components/alert/alert-action-message.pipe';
import { AuthEffects } from './auth/store/auth.effects';
import { AccountsEffects } from './accounts/store/accounts.effects';
import { UserEffects } from './user/store/user.effects';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AccountsComponent,
    AccountsFilterComponent,
    AccountsCardComponent,
    AccountsListComponent,
    CreateAccountComponent,
    IconsSelectorComponent,
    DeleteConfirmComponent,
    LoadingSpinnerComponent,
    AccountsFilterPipe,
    IconsFilterPipePipe,
    AuthComponent,
    ErrorPageComponent,
    HomeComponent,
    EmailConfirmationComponent,
    EmailConfirmationDeleteComponent,
    FirstWordPipe,
    PasswordResetComponent,
    PasswordVisibilityDirective,
    CardChoiceComponent,
    CheckmarkComponent,
    SignedupComponent,
    ForgotPasswordComponent,
    UserComponent,
    UserOptionsComponent,
    PinEnterComponent,
    LoadingDotsComponent,
    AlertComponent,
    AlertActionMessagePipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AngularSvgIconModule.forRoot(),
    StoreModule.forRoot(fromApp.appReducer),
    EffectsModule.forRoot([AuthEffects, AccountsEffects, UserEffects]),
    StoreDevtoolsModule.instrument({ logOnly: environment.production }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
