import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './accounts/accounts.component';
import { AuthRouteGuard } from './auth/auth-route.guard';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { EmailConfirmationDeleteComponent } from './auth/email-confirmation-delete/email-confirmation-delete.component';
import { EmailConfirmationComponent } from './auth/email-confirmation/email-confirmation.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { EmailConfirmationGuard } from './auth/email-confirmation/email-confirmation.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'accounts', canActivate: [AuthGuard], component: AccountsComponent },
  { path: 'create-account', canActivate: [AuthGuard], component: CreateAccountComponent }, 
  { path: 'user',canActivate: [AuthGuard], component: UserComponent},
  
  { path: 'auth', component: AuthComponent, canActivate: [AuthRouteGuard], children: [
    { path: '', pathMatch: 'full', redirectTo: 'login'},
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignupComponent },
  ] },

  { path: 'email-confirmation/:emailToken', canActivate: [EmailConfirmationGuard], component: EmailConfirmationComponent },
  { path: 'email-confirmation/:emailToken/delete', component:  EmailConfirmationDeleteComponent},
  { path: 'reset-password/:passwordToken', component: PasswordResetComponent },

  { path: 'not-found', component: ErrorPageComponent },
  { path: '**', redirectTo: 'not-found' }  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
