import {AbstractControl} from '@angular/forms';

import * as zxcvbn from 'zxcvbn';

export class PasswordValidation {
  static MatchPassword(AC: AbstractControl) {
    const password = AC.get('password').value; // to get value in input tag
    if (password !== AC.get('confirmPassword').value) {
      AC.get('confirmPassword').setErrors({MatchPassword: true});
    }

    if (zxcvbn(password).score < 2) {
      AC.get('password').setErrors({PassTooWeak: true});
    }
    return null;
  }
}
