import { Component,OnInit  } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.css'
})
export class VerifyEmailComponent implements OnInit  {

  token: string|null = '';
  constructor(private authServie:AuthService, private route:ActivatedRoute,private snackBar:MatSnackBar,private router:Router){}
  loading:boolean = true;

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token');
    console.log(this.token);
    this.authServie.verifyEmail(this.token).subscribe(
      (response: any) => {
        console.log(response);
        setTimeout(() => {
          this.loading = false;
          this.snackBar.open('Email verified successfully!', 'Dismiss', { duration: 3000 });
        },3000);
        setTimeout(() => {
          this.router.navigate(['/login']);
        },4000);


        //
      },
      (error) => {
        setTimeout(() => {
          this.loading = false;
          this.snackBar.open('Failed to verify email. Please try again!', 'Dismiss', { duration: 3000 });
        },3000);
        setTimeout(() => {
          this.router.navigate(['/error'], { queryParams: { message: 'Something went wrong! Email Verification failed!' } });
        },4000);



        //this.router.navigate(['/login']);
      }
    );
  }
}
