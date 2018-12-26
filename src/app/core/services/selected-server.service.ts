import {EventEmitter, Injectable} from '@angular/core';
import {AuthenticationService} from './authentication.service';
import {ConfigService} from '../../config.service';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SelectedServerService {
  private currentServer;
  public serverCacheEmitter = new EventEmitter();
  public serverUpdateEmitter = new EventEmitter();
  public servers: any;

  ownsOne = false;

  constructor(private auth: AuthenticationService, private config: ConfigService, private http: HttpClient) {
  }

  getCurrentServer() {
    if (this.currentServer === undefined) {
      if(this.servers === undefined){
        this.currentServer = undefined;
        return this.currentServer;
      }
      if(Object.keys(this.servers).length >= 1){
        this.currentServer = this.servers[0];
      }else {
        this.currentServer = undefined;
      }
    }
    return this.currentServer;
  }

  resetCurrentServer(){
    this.setCurrentServer(this.servers[0], true)
  }

  setCurrentServer(server, emit?) {
    this.currentServer = server;
    if(emit === undefined){
      this.serverUpdateEmitter.emit(); //Emit by default
    }else{
      if(emit){
        this.serverUpdateEmitter.emit();
      }
    }
  }

  reloadCurrentServer(){
    const servers = <any> this.servers;
    let updatedServer = servers.find(server => server._id === this.currentServer._id);
    if(updatedServer === undefined){
      this.setCurrentServer(this.getCurrentServer(), true);
    }else {
      this.setCurrentServer(updatedServer, true);
    }
  }

  updateCache(emit, callback?) {
    console.log('updating server cache...');
    this.http.get<any>(this.config.getAPIURL() + 'user/getServers', {headers: {Authorization: 'Token ' + this.auth.getUser().token}})
      .pipe(map(data => {
        return data.servers;
      })).subscribe(data => {
      this.servers = data;

      this.ownsOne = false;
      this.servers.map(server => {
        if(server.isOwner){
          this.ownsOne = true;
        }
      });

      console.log('cache updated.');

      //The callback is supposed to be first. We may need to execute some important action in it.
      if(callback)
        callback();
      if(emit){
        this.serverCacheEmitter.emit();
      }
    });
  }

  getServers() {
    return this.servers;
  }
}
