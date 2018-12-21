import {AbstractControl} from '@angular/forms';

import * as zxcvbn from 'zxcvbn';


export class PasswordValidation {
  static MatchPassword(AC: AbstractControl) {
    const password = AC.get('password').value; // to get value in input tag
    const confirmPassword = AC.get('confirmPassword').value; // to get value in input tag
    if(password != confirmPassword) {
      AC.get('confirmPassword').setErrors( {MatchPassword: true} )
    }

    const passResults = zxcvbn(password);
    if(passResults.score < 2){
      AC.get('password').setErrors( {PassTooWeak: true} )
    }
    return null;
  }
}
