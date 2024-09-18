import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FormBuilder, FormGroup,Validators } from '@angular/forms';
import { passwordConfirmValidator } from '../../../core/validators/confirmPasswordValidator';
import { ExistEmailValidator } from '../../../core/validators/EmailExistValidator';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm:FormGroup;
  constructor(private authservice:AuthService, fb:FormBuilder,private snackBar: MatSnackBar) {
    this.registerForm = fb.group({
      email: ['',[Validators.required, Validators.email],[ExistEmailValidator.checkEmailTaken(authservice)]],
      fullname: ['',[Validators.required, Validators.minLength(3)]],
      password: ['',[Validators.required, Validators.minLength(3)]],
      confirmPassword: ['',[Validators.required, Validators.minLength(3)]]
    },{
      validators:passwordConfirmValidator('password','confirmPassword')
    });
  }
  onSubmit(){
    if(this.registerForm.valid){
      this.authservice.register(this.registerForm.value).subscribe(
        (res) => {
          console.log(res);
          if(res.status === 201){
            console.log(res.data);
            this.registerForm.reset();
            this.snackBar.open('Verification email has been sent. Please check your inbox.', 'Close', {
              duration: 5000,
            });
          }

        }
      );
    }
  }
}
