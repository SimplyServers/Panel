import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {ConfigService} from "../../config.service";
import {TokenPayload} from "../models/token-payload";

@Injectable()
export class AuthenticationService{
  private user: any;

  constructor(private http: HttpClient, private config: ConfigService) { }

  login(token: TokenPayload) {
    return this.http.post<any>(this.config.getAPIURL() + "login", token)
      .pipe(map(user => {
        if (user && user.token) {
          console.log(user);
          localStorage.setItem('session', JSON.stringify(user));
        }
        return user;
      }));
  }

  getUser() {
    if (!this.user) { //Check to see if we already have a token in memory. If we don't, load it.
      this.user = localStorage.getItem('session');
    }
    return this.user;
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('session');
  }

  isLoggedIn(){ //Checks for session token. Then validates it.
    const user = this.getUser(); //Maybe a lil overkill
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }
}
