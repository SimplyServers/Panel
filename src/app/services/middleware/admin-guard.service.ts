import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from '../auth.service';

@Injectable({
  providedIn: 'root'
})

export class AdminGuardService implements CanActivate {

  constructor(private auth: AuthService,
    private router: Router) {}

  canActivate() {
    if (!this.auth.checkLoggedIn() || (this.auth.user.group && this.auth.user.group.isAdmin)) {
      this.router.navigateByUrl('/');
    } else {
      return true;
    }
  }
}
