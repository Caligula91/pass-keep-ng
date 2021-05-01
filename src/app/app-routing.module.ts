import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './accounts/accounts.component';
import { AuthRouteGuard } from './auth/auth-route.guard';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { EmailConfirmationDeleteComponent } from './auth/email-confirmation-delete/email-confirmation-delete.component';
import { EmailConfirmationComponent } from './auth/email-confirmation/email-confirmation.component';
import { PasswordResetComponent } from './auth/password-reset/password-reset.component';
import { SignedupGuard } from './auth/signedup/signedup.guard';
import { SignedupComponent } from './auth/signedup/signedup.component';
import { CreateAccountComponent } from './create-account/create-account.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { HomeComponent } from './home/home.component';
import { UserComponent } from './user/user.component';
import { EmailConfirmationGuard } from './auth/email-confirmation/email-confirmation.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'accounts', canActivate: [AuthGuard], component: AccountsComponent },
  { path: 'create-account', canActivate: [AuthGuard], component: CreateAccountComponent }, 
  { path: 'user',canActivate: [AuthGuard], component: UserComponent},
  
  { path: 'auth', redirectTo: 'auth/login' },
  { path: 'auth/:mode', canActivate: [AuthRouteGuard], component: AuthComponent },
  { path: 'auth/signup/verification', canActivate: [SignedupGuard], component: SignedupComponent },
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
