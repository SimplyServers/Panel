import {EventEmitter, Injectable} from '@angular/core';
import {CurrentServerService} from './current-server.service';
import * as io from 'socket.io-client';
import {ConfigStorageService} from './config-storage.service';
import {AuthenticationService} from './legacy/authentication.service';

export enum ServerStatus {
  RUNNING = 'Running',
  STOPPED = 'Stopped',
  STOPPING = 'Stopping',
  CRASHED = 'Crashed',
  STARTING = 'Starting',
  LOADING = 'Loading'
}

export interface InitialStatus {
  status: string,
  installed: boolean,
  blocked: boolean
}

export interface ConsoleLog {
  line: string
}

@Injectable({
  providedIn: 'root'
})

export class ServerSocketIOService {
  get serverStatus(): ServerStatus {
    return this._serverStatus;
  }

  set serverStatus(value: ServerStatus) {
    this._serverStatus = value;
  }

  get installed(): boolean {
    return this._installed;
  }

  set installed(value: boolean) {
    this._installed = value;
  }

  get blocked(): boolean {
    return this._blocked;
  }

  set blocked(value: boolean) {
    this._blocked = value;
  }

  get cachedConsole(): string {
    return this._cachedConsole;
  }

  set cachedConsole(value: string) {
    this._cachedConsole = value;
  }

  private _serverStatus: ServerStatus;
  private _installed: boolean;
  private _blocked: boolean;
  private _cachedConsole: string;

  statusEmitter = new EventEmitter();
  consoleEmitter = new EventEmitter();
  announceEmitter = new EventEmitter();

  private ioSocket;

  constructor(
    private currentServer: CurrentServerService,
    private config: ConfigStorageService,
    private auth: AuthenticationService
  ) {
    this._serverStatus = ServerStatus.LOADING;
    this._installed = false;
    this._blocked = true;
    this._cachedConsole = '';


    // Load the socket on init (so its not undefined)
    this.loadSocket().then(() => {
      console.debug('Connected to initial socket.');
    });

    // Reload the socket when the server is updated
    this.currentServer.serverUpdateEmitter.subscribe(() => {
      this.loadSocket().then(() => {
        console.debug('Connected to socket.');
      });
    });
  }

  private handleAnnounce = (data: string) => {
    this.announceEmitter.emit(data);
  };

  private handleBlock = (data: boolean) => {
    this._blocked = data;
  };

  private handleInstalled = (data: boolean) => {
    this._installed = data;
  };

  private handleConsole = (data: ConsoleLog): void => {
    this.consoleEmitter.emit(data);
  };

  private handleStatus = (data: string): void => {
    switch (status) {
      case 'Starting':
        this._serverStatus = ServerStatus.STARTING;
        break;
      case 'Stopping':
        this._serverStatus = ServerStatus.STOPPING;
        break;
      case 'Running':
        this._serverStatus = ServerStatus.RUNNING;
        break;
      case 'Off':
        this._serverStatus = ServerStatus.STOPPED;
        break;
      case 'Crashed':
        this._serverStatus = ServerStatus.CRASHED;
        break;
      default:
        this._serverStatus = ServerStatus.LOADING;
        break;
    }
    this.statusEmitter.emit(this._serverStatus);
  };

  private handleInitial = (data: InitialStatus) => {
    this.handleStatus(data.status);
    this.blocked = data.blocked;
    this.installed = data.installed;
  };

  private loadSocket = async (): Promise<void> => {
    // Disconnect from the socket if we're connected
    if (!this.ioSocket) {
      this.ioSocket.disconnect();
    }

    this.ioSocket = io(this.config.getConfig().endpoints.socket + 'console', {
      path: '/s/',
      query: {
        server: this.currentServer.currentServer.getDetails()._id
      }
    });

    await new Promise((resolve) => {
      this.ioSocket.on('connect', () => {
        this.ioSocket.emit('authenticate', {
          token: this.auth.getUser().token
        }, () => {
          this.ioSocket.on('initialStatus', this.handleInitial);
          this.ioSocket.on('statusUpdate', this.handleStatus);
          this.ioSocket.on('console', this.handleConsole);
          this.ioSocket.on('announcement', this.handleAnnounce);
          this.ioSocket.on('block', this.handleBlock);
          this.ioSocket.on('installed', this.handleInstalled);

          // We've authenticated, resolve!
          return resolve();
        });
      });
    });
  };
}
