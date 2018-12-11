import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../core/services/authentication.service";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  login: boolean;
  username: string;
  currentUrl: string;

  constructor(private auth: AuthenticationService, private router: Router) {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.currentUrl = e.url;
        this.login = this.auth.isLoggedIn();
        this.username = this.auth.getUser().username;
      }
    });
  }

  ngOnInit() {
  }

}
