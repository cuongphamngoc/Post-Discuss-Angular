import { Component, ViewChild } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { Observable } from 'rxjs';
import { MatMenuTrigger } from '@angular/material/menu';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  isLoggedIn$!: Observable<boolean>;

  userInfo$!: Observable<User>;



  constructor(private authService: AuthService) {
    this.isLoggedIn$ = authService.isLoggin();
    if(this.isLoggedIn$){
      this.userInfo$ = authService.getUserSubject();
    }

  }
  logout(){
    this.authService.logout();
    this.authService.isAuthenticated$.next(false);

  }

}
export interface User{
  email: string,
  name: string,
  avatarUrl: string
}
