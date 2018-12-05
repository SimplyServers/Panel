import { Injectable } from '@angular/core';
import {Router, CanActivate, ActivatedRoute, RoutesRecognized, RouterStateSnapshot, RouterEvent} from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable({
  providedIn: 'root'
})

export class AuthGuardService implements CanActivate{

  constructor(private auth: AuthenticationService, private router: Router, private activatedRoute: ActivatedRoute) { }

  canActivate() {
    if (!this.auth.isLoggedIn()) {

      //We're trying to get the route from outside the outlet, so things get really weird
      //https://stackoverflow.com/questions/45737375/angular-activatedroute-data-returns-an-empty-object
      let urlCheck = this.router.events.subscribe((data) => {
        urlCheck.unsubscribe(); //Unsubscrive so this wont fire again
        if (data instanceof RouterEvent) {
          this.router.navigateByUrl('/login?returnUrl=' + data.url);
          return false;
        }
        //Something strange happened.
        this.router.navigateByUrl('/login');
        return false;
      });
    }else {
      return true;
    }
  }
}
