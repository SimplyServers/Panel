import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {ConfigService} from "../../config.service";
import {UserDetails} from "../models/user-details";
import {TokenPayload} from "../models/token-payload";
import {Observable} from "rxjs";
import {map, filter, catchError, mergeMap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private token: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    private config: ConfigService
  ) { }

  private saveToken(token: string): void { //Save token to local storage.
    localStorage.setItem('session-token', token);
    this.token = token; //Set cached copy.
  }

  private getToken(): string {
    if (!this.token) { //Check to see if we already have a token in memory. If we don't, load it.
      this.token = localStorage.getItem('session-token');
    }
    return this.token;
  }

  public getUserDetails(): UserDetails {
    const token = this.getToken();
    let payload;
    if (token) {
      payload = token.split('.')[1]; //Get the data out of the stored JWT payload and read it.
      payload = window.atob(payload);
      return JSON.parse(payload); //Its JSON btw
    } else {
      return null; //Why would I call this without auth smh
    }
  }

  public isLoggedIn(): boolean { //Checks for session token. Then validates it.
    const user = this.getUserDetails(); //Maybe a lil overkill
    if (user) {
      return user.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }

  private request(method: 'post' | 'get', path: 'login' | 'register', user?: TokenPayload): Observable<any>{
      let base;
      if(method === 'post' && path === 'login'){
        base = this.http.post(this.config.getAPIURL() + path, user);
      }else if(method === 'post' && path === 'register'){
        base = this.http.post(this.config.getAPIURL() + path, user);
      }
    const request = base.pipe(
      map((data: any) => { //We could have a lot of data coming in. So I set this to any. Might be a mistake.
        if (path === 'login') { //Verify we called login.
          if (data.token) { //Looks like we're being returned an auth token. Store it!
            this.saveToken(data.token);
          }
        }
        return data; //Deal with possible errors in login.ts.
      })
    );
    return request;
  }


}
