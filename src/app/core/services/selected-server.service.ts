import {EventEmitter, Injectable} from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {ConfigService} from '../../config.service';
import {HttpClient} from '@angular/common/http';
import {Subject} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SelectedServerService {

  private currentServer;
  public serverEmitter = new EventEmitter();
  public servers: any;

  constructor(private auth: AuthenticationService, private config: ConfigService, private http: HttpClient) {
  }

  getCurrentServer(callback) {
    if (this.currentServer === undefined) {
      this.updateCache(() => {
        this.currentServer = this.servers[0]._id;
        callback(this.currentServer);
      });
    }else{
      callback(this.currentServer);
    }
  }

  setCurrentServer(server) {
    console.log("I've updated the current server @ ss to " + server);
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

  getServers(callback) {
    if (this.servers === undefined) {
      this.updateCache(() => {
        callback(this.servers);
      });
    }else {
      callback(this.servers);
    }
  }
}
