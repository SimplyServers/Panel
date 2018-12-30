import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {SelectedServerService} from './selected-server.service';

@Injectable({
  providedIn: 'root'
})

export class ServerGuardService implements CanActivate {

  constructor(private selectedServer: SelectedServerService, private router: Router) {
  }

  canActivate() {
    if (Object.keys(this.selectedServer.servers).length < 1) {
      this.router.navigateByUrl('/panel/create');
      return false;
    }
    return true;
  }
}
