import {EventEmitter, Injectable} from '@angular/core';
import {ServerNotFoundError} from '../errors/server.not.found.error';
import {HttpClient} from '@angular/common/http';
import {Server} from '../models/server.model';
import {AuthService} from './auth.service';
import {ConfigStorage} from './config-storage.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentServerService {

  public serverCacheEmitter = new EventEmitter();
  public serverUpdateEmitter = new EventEmitter();

  constructor(
    private auth: AuthService,
    private http: HttpClient
  ) {
  }

  private _currentServer: Server;

  set currentServer(value: Server) {
    this.serverUpdateEmitter.emit();
    this._currentServer = value;
  }

  private _servers: any;

  set servers(value: any) {
    this.serverCacheEmitter.emit();
    this._servers = value;
  }

  private _ownsOne = false;

  get ownsOne(): boolean {
    return this._ownsOne;
  }

  set ownsOne(value: boolean) {
    this._ownsOne = value;
  }

  // OOF https://github.com/Microsoft/TypeScript/issues/14982
  public getCurrentServer = async (useCache?: boolean): Promise<Server> => {
    if ((!this.currentServer && !this.servers) || useCache) {
      await this.updateCache();

      // Check to see if the server list is empty. If it is return not found
      if (Object.keys(this.servers < 1)) {
        throw new ServerNotFoundError();
      }

      // Update the current server
      this.currentServer = this.servers[0];
    }
    return this.currentServer;
  };

  public updateCurrentServerData = async (): Promise<void> => {
    const oldServer: Server = await this.getCurrentServer();
    await this.updateCache();
    this.currentServer = this.servers.find(server => server.details._id === oldServer.details._id);
  };

  public getServers = async (): Promise<void> => {
    if (!this._servers) {
      await this.updateCache(true);
    } // TODO: decide if hiding the change is a good idea or not
    return this._servers;
  };

  public updateCache = async (hideChange?: boolean): Promise<void> => {
    const serverList = (await this.http.get<any>(
      ConfigStorage.config.endpoints.api + 'user/getServers',
      {headers: {Authorization: 'Token ' + this.auth.user.token}}).toPromise()).servers;

    // If we want to hide the change, simply bypass the getter/setter functions
    if (hideChange) {
      this._servers = serverList;
    } else {
      this.servers = serverList;
    }

    // Check to see if the person owns a server
    this.ownsOne = false;
    this.servers.forEach(server => {
      if (server.isOwner) {
        this.ownsOne = true;
      }
    });
  };
}
