import {EventEmitter, Injectable} from '@angular/core';
import {ServerNotFoundError} from '../errors/server.not.found.error';
import {HttpClient} from '@angular/common/http';
import {Server} from '../models/server.model';
import {AuthService} from './auth.service';
import {ConfigStorage} from './config-storage.service';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CurrentServerService {
  private _selectedServerSource: BehaviorSubject<Server> = new BehaviorSubject(undefined);
  private _serverCacheSource: BehaviorSubject<Array<Server>> = new BehaviorSubject([]);
  private _ownsOne = false;

  get ownsOne(): boolean {
    return this._ownsOne;
  }

  set ownsOne(value: boolean) {
    this._ownsOne = value;
  }

  set selectedServer(src: BehaviorSubject<Server>) {
    this._selectedServerSource = src;
  }

  get selectedServer(): BehaviorSubject<Server> {
    return this._selectedServerSource;
  }

  set serverList(src: BehaviorSubject<Array<Server>>) {
    this._serverCacheSource = src;
  }

  get serverList(): BehaviorSubject<Array<Server>> {
    return this._serverCacheSource;
  }

  constructor(
    private auth: AuthService,
    private http: HttpClient
  ) {}

  updateCache = async () => {
    const serverList = (await this.http.get<any>(
      ConfigStorage.config.endpoints.api + 'profile/servers',
      {headers: {Authorization: 'Token ' + this.auth.user.token}}).toPromise()).servers;

    const serverArr = [];
    serverList.forEach(serverRaw => {
      serverArr.push(new Server(serverRaw));
    });

    console.log("pulled list: " + JSON.stringify(serverList));

    this.ownsOne = serverList.find(server => server._owner._id === this.auth.user.id) !== undefined;
    console.log("owns one: " + this.ownsOne);
    this._serverCacheSource.next(serverArr);

    if (this.selectedServer.value === undefined){
      console.log("fixing current server... updating value to " + JSON.stringify(this.serverList.value[0]))
      this.selectedServer.next(this.serverList.value[0]);
    }
  };

  reloadCurrentServer = () => {
    if (this.selectedServer.value === undefined) {
      this.selectedServer.next(this.serverList.value[0]);
      return;
    }
    const oldServer: Server = this.selectedServer.value;
    let newServer = this.serverList.value.find(serverInList => serverInList.details._id === oldServer.details._id);
    if (!newServer) { newServer = this.serverList.value[0]; }
    this.selectedServer.next(newServer);
  };

  updateServer = (server: Server) => {
    this._selectedServerSource.next(server);
  }
}
