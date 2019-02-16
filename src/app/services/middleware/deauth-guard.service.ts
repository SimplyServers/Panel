import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class DeauthGuardService {

  constructor(private auth: AuthService,
              private router: Router) {
  }

  canActivate() {
    if (this.auth.checkLoggedIn()) {
      this.router.navigateByUrl('/');
      return false;
    }
    return true;
  }
}
