import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../core/services/legacy/authentication.service';
import {Router} from '@angular/router';
import {SelectedServerService} from '../../../core/services/legacy/selected-server.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private auth: AuthenticationService, private router: Router, private selectedServer: SelectedServerService) {
  }

  ngOnInit() {

    this.router.navigateByUrl('/login').then(() => {
      // remove user from local storage to log user out
      localStorage.removeItem('session');
      this.auth.clearUser();

      // Make sure we clear the server on logout
      this.selectedServer.servers = undefined;
      this.selectedServer.setCurrentServer(undefined, false);
    });
  }

}
