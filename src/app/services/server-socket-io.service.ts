import {EventEmitter, Injectable} from '@angular/core';
import {CurrentServerService} from './current-server.service';
import * as io from 'socket.io-client';
import {ConfigStorage} from './config-storage.service';
import {AuthService} from './auth.service';
import {BehaviorSubject, Subject} from 'rxjs';
import {ServiceLocator} from '../service.injector';

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
  get statusSource(): BehaviorSubject<ServerStatus> {
    return this._statusSource;
  }

  set statusSource(value: BehaviorSubject<ServerStatus>) {
    this._statusSource = value;
  }

  get consoleSource(): BehaviorSubject<string> {
    return this._consoleSource;
  }

  set consoleSource(value: BehaviorSubject<string>) {
    this._consoleSource = value;
  }

  get blockedSource(): BehaviorSubject<boolean> {
    return this._blockedSource;
  }

  set blockedSource(value: BehaviorSubject<boolean>) {
    this._blockedSource = value;
  }

  get installedSource(): BehaviorSubject<boolean> {
    return this._installedSource;
  }

  set installedSource(value: BehaviorSubject<boolean>) {
    this._installedSource = value;
  }

  get announceSource(): Subject<string> {
    return this._announceSource;
  }

  set announceSource(value: Subject<string>) {
    this._announceSource = value;
  }

  private auth: AuthService;
  private currentServer: CurrentServerService;

  private _statusSource: BehaviorSubject<ServerStatus> = new BehaviorSubject(ServerStatus.LOADING);
  private _consoleSource: BehaviorSubject<string> = new BehaviorSubject('');
  private _blockedSource: BehaviorSubject<boolean> = new BehaviorSubject(true);
  private _installedSource: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private _announceSource: Subject<string> = new Subject();

  private ioSocket;

  constructor(
  ) {
    // The fuck?
    this.auth = ServiceLocator.injector.get(AuthService);
    this.currentServer = ServiceLocator.injector.get(CurrentServerService);

    this.loadSocket().then(() => {
      console.debug('Connected to ss socket');
    })
  }

  private loadSocket = async () => {
      // Disconnect from the socket if we're connected
      if (this.ioSocket) {
        this.ioSocket.disconnect();
      }

      this.ioSocket = io(ConfigStorage.config.endpoints.socket + 'console', {
        path: '/s/',
        query: {
          server: this.currentServer.selectedServer.value
        }
      });

      await new Promise((resolve) => {
        this.ioSocket.on('connect', () => {
          this.ioSocket.emit('authenticate', {
            token: this.auth.user.token
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

  private handleAnnounce = (data: string) => {
    this.announceSource.next(data);
    this.consoleSource.next(this.consoleSource.value + '\n➤ [Manager daemon] ' + data)
  };

  private handleBlock = (data: boolean) => {
    this.blockedSource.next(data);
  };

  private handleInstalled = (data: boolean) => {
    this.installedSource.next(data);
  };

  private handleConsole = (data: ConsoleLog): void => {
    this.consoleSource.next(this.consoleSource.value + '\n' + data)
  };

  private handleInitial = (data: InitialStatus) => {
      this.handleStatus(data.status);
      this.handleBlock(data.blocked);
      this.handleInstalled(data.installed);
    };

  private handleStatus = (data: string): void => {
    switch (data) {
      case 'Starting':
        this.statusSource.next(ServerStatus.STARTING);
        break;
      case 'Stopping':
        this.statusSource.next(ServerStatus.STOPPING);
        break;
      case 'Running':
        this.statusSource.next(ServerStatus.RUNNING);
        break;
      case 'Off':
        this.statusSource.next(ServerStatus.STOPPED);
        break;
      case 'Crashed':
        this.statusSource.next(ServerStatus.CRASHED);
        break;
      default:
        this.statusSource.next(ServerStatus.LOADING);
        break;
    }
    this.consoleSource.next(this.consoleSource.value +
      '\n➤ [Status update] Status updated to ' +
      this.statusSource.value.toString().toLocaleUpperCase())
  };
}
