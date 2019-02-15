import {EventEmitter, Injectable} from '@angular/core';
import {ConfigService} from '../config.service';
import {AuthenticationService} from './authentication.service';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ServerSocketManagerService {

  currentSocketServer = '';
  private socket;
  lastStatus: 'Running' | 'Stopped' | 'Stopping' | 'Crashed' | 'Starting' | 'Loading' = 'Loading';
  lastInstalled: boolean;
  lastBlocked: boolean;
  statusEmitter = new EventEmitter();
  consoleEmitter = new EventEmitter();
  announceEmitter = new EventEmitter();
  private cachedConsole = '';

  constructor(private config: ConfigService, private auth: AuthenticationService) {
  }

  getSocket(server, callback?) {
    if (server !== this.currentSocketServer) {
      if (callback) {
        this.updateSocket(server, callback);
      } else {
        this.updateSocket(server);
      }
    } else {
      if (callback) {
        callback();
      }
    }
  }

  cacheConsole(consoleText) {
    this.cachedConsole = consoleText;
  }

  getConsole() {
    return this.cachedConsole;
  }

  private handleStatus(data) {
    // Added support for old version of manager
    if (Number.isInteger(data)) {
      this.handleStatusOld(data);
    } else {
      this.handleStatusNew(data);
    }

    this.statusEmitter.emit(this.lastStatus);
  }

  private handleStatusNew = (status: string) => {
    switch (status) {
      case 'Starting':
        this.lastStatus = 'Starting';
        break;
      case 'Stopping':
        this.lastStatus = 'Stopping';
        break;
      case 'Running':
        this.lastStatus = 'Running';
        break;
      case 'Off':
        this.lastStatus = 'Stopped';
        break;
      case 'Crashed':
        this.lastStatus = 'Crashed';
        break;
      default:
        console.log('got unknown status:' + status);
        this.lastStatus = 'Loading';
        break;
    }
  };

  private handleStatusOld = (status: number) => {
    switch (status) {
      case 0:
        this.lastStatus = 'Starting';
        break;
      case 1:
        this.lastStatus = 'Stopping';
        break;
      case 2:
        this.lastStatus = 'Running';
        break;
      case 3:
        this.lastStatus = 'Stopped';
        break;
      case 4:
        this.lastStatus = 'Crashed';
        break;
      default:
        console.log('got unknown status:' + status);
        this.lastStatus = 'Loading';
        break;
    }
  };

  private updateSocket(server, callback?) {
    this.currentSocketServer = server;

    if (this.socket !== undefined) {
      this.socket.disconnect();
      this.socket = undefined;
    }

    this.socket = io(this.config.socketEndpoint + 'console', {path: '/s/', query: {server: server}});
    this.socket.on('connect', () => {
      this.socket.emit('authenticate', {token: this.auth.getUser().token}).on('authenticated', () => {
        this.socket.on('initialStatus', (data) => {
          this.handleStatus(data.status);
          this.lastInstalled = data.installed;
          this.lastBlocked = data.blocked;
        }).on('statusUpdate', (data) => {
          this.handleStatus(data);
        }).on('console', (data) => {
          this.consoleEmitter.emit(data.line);
        }).on('announcement', data => {
          this.announceEmitter.emit(data);
        }).on('block', data => {
          this.lastBlocked = data;
        }).on('installed', data => {
          this.lastInstalled = data;
        });
        if (callback) {
          callback();
        }
      });
    });
  }
}
