import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {ConfigService} from '../../config.service';
import {TokenPayload} from '../models/token-payload';
import {ServerPayload} from '../models/server-payload';

@Injectable()
export class AuthenticationService {
  private user: any;

  constructor(private http: HttpClient, private config: ConfigService) {
  }

  login(token: TokenPayload) {
    return this.http.post<any>(this.config.getAPIURL() + "auth/login", token)
      .pipe(map(data => {
        if (data && data.user.token) {
          localStorage.setItem('session', JSON.stringify(data.user));
        }
        return data.user;
      }));
  }

  register(newUser: TokenPayload) {
    return this.http.post<any>(this.config.getAPIURL() + 'auth/register', newUser)
      .pipe(map(data => {
        return data.user;
      }));
  }

  getPresets() {
    return this.http.get<any>(this.config.getAPIURL() + 'user/getPresets', {headers: {Authorization: 'Token ' + this.getUser().token}})
      .pipe(map(data => {
        return data.presets;
      }));
  }

  createServer(server: ServerPayload) {
    return this.http.post<any>(this.config.getAPIURL() + 'server/create', server, {headers: {Authorization: 'Token ' + this.getUser().token}})
      .pipe(map(data => {
        return data.server;
      }));
  }

  removeServer(server: string) {
    return this.http.get<any>(this.config.getAPIURL() + 'server/' + server + '/remove', {headers: {Authorization: 'Token ' + this.getUser().token}})
      .pipe(map(data => {
        return data;
      }));
  }

  submitCommand(server: string, command: string) {
    return this.http.post<any>(this.config.getAPIURL() + 'server/' + server + '/control/command', {command: command}, {headers: {Authorization: 'Token ' + this.getUser().token}})
      .pipe(map(data => {
        return data;
      }));
  }

  changePreset(server: string, preset: string) {
    return this.http.post<any>(this.config.getAPIURL() + 'server/' + server + '/changePreset', {preset: preset}, {headers: {Authorization: 'Token ' + this.getUser().token}})
      .pipe(map(data => {
        return data;
      }));
  }

  killServer(server: string) {
    return this.http.get<any>(this.config.getAPIURL() + 'server/' + server + '/power/kill', {headers: {Authorization: 'Token ' + this.getUser().token}})
      .pipe(map(data => {
        return data;
      }));
  }

  startServer(server: string) {
    return this.http.get<any>(this.config.getAPIURL() + 'server/' + server + '/power/on', {headers: {Authorization: 'Token ' + this.getUser().token}})
      .pipe(map(data => {
        return data;
      }));
  }

  getServer(server: string) {
    return this.http.get<any>(this.config.getAPIURL() + 'server/' + server + '/', {headers: {Authorization: 'Token ' + this.getUser().token}})
      .pipe(map(data => {
        return data.server;
      }));
  }

  stopServer(server: string) {
    return this.http.get<any>(this.config.getAPIURL() + 'server/' + server + '/power/off', {headers: {Authorization: 'Token ' + this.getUser().token}})
      .pipe(map(data => {
        return data;
      }));
  }

  installServer(server: string) {
    return this.http.get<any>(this.config.getAPIURL() + 'server/' + server + '/control/install', {headers: {Authorization: 'Token ' + this.getUser().token}})
      .pipe(map(data => {
        return data;
      }));
  }

  addSubuser(server: string, email: string) {
    return this.http.post<any>(this.config.getAPIURL() + 'server/' + server + '/addSubuser', {email: email}, {headers: {Authorization: 'Token ' + this.getUser().token}})
      .pipe(map(data => {
        return data;
      }));
  }

  removeSubuser(server: string, id: string) {
    return this.http.post<any>(this.config.getAPIURL() + 'server/' + server + '/removeSubuser', {id: id}, {headers: {Authorization: 'Token ' + this.getUser().token}})
      .pipe(map(data => {
        return data;
      }));
  }

  reinstallServer(server: string) {
    return this.http.get<any>(this.config.getAPIURL() + 'server/' + server + '/control/reinstall', {headers: {Authorization: 'Token ' + this.getUser().token}})
      .pipe(map(data => {
        return data;
      }));
  }

  getUser() {
    if (!this.user) { //Check to see if we already have a token in memory. If we don't, load it.
      this.user = localStorage.getItem('session');
    }
    return JSON.parse(this.user);
  }

  clearUser() {
    this.user = undefined;
  }

  isLoggedIn() { //Checks for session token. Then validates it.
    const user = this.getUser(); //Maybe a lil overkill
    if (user) {
      let payload = user.token.split('.')[1]; //Get the data out of the stored JWT payload and read it.
      payload = JSON.parse(window.atob(payload));
      return payload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  }
}


