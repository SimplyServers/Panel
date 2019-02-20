import {Component, OnInit} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  login: boolean;
  username: string;
  currentUrl: string;
  shards: number;

  constructor(private auth: AuthService,
              private router: Router) {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.currentUrl = e.url;
        this.login = this.auth.checkLoggedIn();
        if (this.login) {
          this.username = this.auth.user.username;
          this.shards = this.auth.user.credits;
        }
      }
    });
  }

  ngOnInit() {
  }

}
