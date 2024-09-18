import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent},
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path:'verify-account', component: VerifyEmailComponent },
  { path:'reset-password', component: ResetPasswordComponent  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)
    , FormsModule,
    ReactiveFormsModule
  ],
  exports: [RouterModule]
})
export class AuthRoutingModule {}
