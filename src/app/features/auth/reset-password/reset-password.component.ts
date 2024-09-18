import { Component } from '@angular/core';
import { FormBuilder,Validators,FormGroup } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { passwordConfirmValidator } from '../../../core/validators/confirmPasswordValidator';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  resetForm: FormGroup;
  token: string | null = '';
  constructor(private authService:AuthService,fb: FormBuilder, private activeRoute: ActivatedRoute) {
    this.token = this.activeRoute.snapshot.queryParamMap.get('token');
    this.resetForm = fb.group(
      {
        token: [this.token, Validators.required],
        newPassword: ['', [Validators.required]],
        confirmPassword: ['', [Validators.required]],
      }
      ,{validators:[passwordConfirmValidator]}
    )


  }
  submit(){
    console.log(this.resetForm.value);
    if(this.resetForm.valid){
      this.authService.resetPassword(this.resetForm.value)
      .subscribe((res)=>{
        console.log(res);
      });
    }
  }
}
