
import { AbstractControl } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';


export class ExistEmailValidator {
  static checkEmailTaken(authService: AuthService){
    return (control : AbstractControl) =>{
      return authService.isEmailTaken(control.value).pipe(
        map( (isTaken) =>

          {
            console.log(isTaken);
            return !isTaken ?  null : { uniqueEmail: true };
          }


      ));
    }


  }
}
