import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthenticationService} from '../authentication.service';

@Injectable({
  providedIn: 'root'
})

export class AdminGuardService implements CanActivate {

  constructor(private auth: AuthenticationService, private router: Router) {
  }

  canActivate() {
    if (!this.auth.isLoggedIn() || (this.auth.getUser().group && this.auth.getUser().group.isAdmin)) {
      this.router.navigateByUrl('/');
    } else {
      return true;
    }
  }
}
