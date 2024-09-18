
import { AbstractControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';


export class NotExistEmailValidator {
  static checkEmailTaken(authService: AuthService){
    return (control : AbstractControl) =>{
      return authService.isEmailTaken(control.value).pipe(
        map( (isTaken) =>

          {
            console.log(isTaken);
            return isTaken ?  null : { notExistmail: true };
          }


      ));
    }


  }
}
