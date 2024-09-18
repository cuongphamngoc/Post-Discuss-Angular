import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FormControl,Validators,FormBuilder, FormGroup } from '@angular/forms';
import { NotExistEmailValidator } from '../../../core/validators/EmailNotExistValidator';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  resetForm: FormGroup;
  constructor(private authService:AuthService,fb: FormBuilder,private snackBar: MatSnackBar) {
    this.resetForm = fb.group(
      {
        email: ['', [Validators.required, Validators.email],[NotExistEmailValidator.checkEmailTaken(authService)]],
      }
    )

  }
  submit(){
    this.authService.forgotPassword(this.resetForm.get('email')?.value)
    .subscribe(()=>
      this.snackBar.open('Reset password email sent', 'Close', {duration: 3000})
    );
  }
}
