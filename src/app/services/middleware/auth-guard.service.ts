import {Injectable} from '@angular/core';
import {ActivatedRoute, CanActivate, Router, RouterEvent} from '@angular/router';
import {AuthService} from '../auth.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuardService implements CanActivate {

  constructor(private auth: AuthService,
              private router: Router) {
  }

  canActivate() {
    if (!this.auth.checkLoggedIn()) {

      // We're trying to get the route from outside the outlet, so things get really weird
      // https://stackoverflow.com/questions/45737375/angular-activatedroute-data-returns-an-empty-object
      const urlCheck = this.router.events.subscribe((data) => {
        urlCheck.unsubscribe(); // Unsubscrive so this wont fire again
        if (data instanceof RouterEvent) {
          this.router.navigateByUrl('/login?returnUrl=' + data.url);
          return false;
        }
        // Something strange happened.
        this.router.navigateByUrl('/login');
        return false;
      });
    } else {
      return true;
    }
  }
}
