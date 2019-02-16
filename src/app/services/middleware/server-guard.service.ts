import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {CurrentServerService} from '../current-server.service';

@Injectable({
  providedIn: 'root'
})

export class ServerGuardService implements CanActivate {

  constructor(private currentServer: CurrentServerService,
              private router: Router) {
  }

  canActivate() {
    if (Object.keys(this.currentServer.servers).length < 1) {
      this.router.navigateByUrl('/panel/create');
      return false;
    }
    return true;
  }
}
