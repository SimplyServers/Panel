import {EventEmitter, Injectable} from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {ConfigService} from '../../config.service';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SelectedServerService {

  private currentServer;
  public serverEmitter = new EventEmitter();
  public servers: object;

  constructor(private auth: AuthenticationService, private config: ConfigService, private http: HttpClient) {
  }

  getCurrentServer() {
    if (this.currentServer === undefined) {
      if(Object.keys(this.servers).length >= 1){
        this.currentServer = this.servers[0];
      }else {
      }
    }
    return this.currentServer;
  }

  setCurrentServer(server) {
    this.currentServer = server;
    this.serverEmitter.emit();
  }

  updateCache(callback) {
    this.http.get<any>(this.config.getAPIURL() + 'user/getServers', {headers: {Authorization: 'Token ' + this.auth.getUser().token}})
      .pipe(map(data => {
        return data.servers;
      })).subscribe(data => {
      this.servers = data;
      callback();
    });
  }

  getServers() {
    return this.servers;
  }
}
