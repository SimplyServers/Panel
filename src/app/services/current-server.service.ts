import {EventEmitter, Injectable} from '@angular/core';
import {ServerNotFoundError} from '../errors/server.not.found.error';
import {AuthenticationService} from './legacy/authentication.service';
import {HttpClient} from '@angular/common/http';
import {ConfigStorageService} from './config-storage.service';
import {Server} from '../models/server.model';

@Injectable({
  providedIn: 'root'
})
export class CurrentServerService {
  get servers(): any {
    return this._servers;
  }

  set servers(value: any) {
    this.serverCacheEmitter.emit();
    this._servers = value;
  }

  set currentServer(value: Server) {
    this.serverUpdateEmitter.emit();
    this._currentServer = value;
  }

  get ownsOne(): boolean {
    return this._ownsOne;
  }

  set ownsOne(value: boolean) {
    this._ownsOne = value;
  }

  private _currentServer: Server;
  public serverCacheEmitter = new EventEmitter();
  public serverUpdateEmitter = new EventEmitter();
  private _servers: any;

  private _ownsOne = false;

  constructor(
    private auth: AuthenticationService,
    private config: ConfigStorageService,
    private http: HttpClient
  ) { }


  // OOF https://github.com/Microsoft/TypeScript/issues/14982
  public getCurrentServer = async (useCache?: boolean): Promise<Server> => {
    if ((!this.currentServer && !this.servers) || useCache) {
      await this.updateCache();

      // Check to see if the server list is empty. If it is return not found
      if (Object.keys(this.servers < 1)) { throw new ServerNotFoundError(); }

      // Update the current server
      this.currentServer = this.servers[0];
    }
    return this.currentServer;
  };

  public updateCache = async (): Promise<void> => {
    this.servers = (await this.http.get<any>(
      this.config.config.endpoints.api + 'user/getServers',
      {headers: {Authorization: 'Token ' + this.auth.getUser().token}}).toPromise()).servers;

    // Check to see if the person owns a server
    this.ownsOne = false;
    this.servers.forEach(server => {
      if (server.isOwner) {  this.ownsOne = true; }
    });
  };
}
