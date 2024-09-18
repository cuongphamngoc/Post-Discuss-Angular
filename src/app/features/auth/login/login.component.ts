import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FormGroup } from '@angular/forms';
import { FormBuilder , Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotExistEmailValidator } from '../../../core/validators/EmailNotExistValidator';
import { Observable } from 'rxjs';
import { StorageService } from '../../../core/services/storage.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm!:FormGroup;
  hide =true;
  constructor(private authService:AuthService, fb: FormBuilder,private router: Router, private snackBar: MatSnackBar,
  private storageService: StorageService) {
    this.loginForm = fb.group(
      {
        email:['',[Validators.required, Validators.email],[NotExistEmailValidator.checkEmailTaken(authService)]],
        password:['',[Validators.required, Validators.minLength(3)]]
      });
   }


  login() {
    console.log(this.loginForm.value);
    if(this.loginForm.valid){
        this.authService.login(this.loginForm.value).subscribe(res => {
          console.log(res);
            if(res.status === 200){
              console.log(res.data.accessToken);
              this.storageService.setToStorage('access_token', res.data.accessToken);
              this.storageService.setToStorage('refresh_token', res.data.refreshToken);
              this.authService.isAuthenticated$.next(true);
              const userpayload = JSON.parse(atob(res.data.refreshToken.split('.')[1]));
              this.storageService.setToStorage('user_payload', JSON.stringify(userpayload));
              this.router.navigate(['/']);
            } else {
              this.snackBar.open('Invalid credentials', 'Close', {duration: 3000});
            }

        });

    }

     else {
      console.log('Form is invalid');
    }
  }
  LoginWithFacebook(){

  }
  LoginWithGoogle(){
  }
  LoginWithGithub(){
  }
}
