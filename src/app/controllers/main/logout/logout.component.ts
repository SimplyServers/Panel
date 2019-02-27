import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {CurrentServerService} from '../../../services/current-server.service';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

  constructor(private auth: AuthService,
              private router: Router,
              private currentServer: CurrentServerService) {
  }

  ngOnInit() {
    this.router.navigateByUrl('/login').then(() => {
      // remove user from local storage to log user out
      localStorage.removeItem('session');
      this.auth.user = undefined;

      // Make sure we clear the server on logout
      this.currentServer.serverList.next(undefined);
      this.currentServer.updateServer( undefined);
    });
  }
}
