import {EventEmitter, Injectable} from '@angular/core';
import {ConfigService} from '../../config.service';
import {AuthenticationService} from './authentication.service';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ServerSocketManagerService {

  currentSocketServer: string;
  private socket;
  lastStatus: 'Running' | 'Stopped' | 'Stopping' | 'Crashed' | 'Starting' | 'Loading' = 'Loading';
  statusEmitter = new EventEmitter();
  consoleEmitter = new EventEmitter();

  constructor(private config: ConfigService, private auth: AuthenticationService) {
  }

  getSocket(server) {
    console.log("getting socket: status rn: " + this.lastStatus);
    if (server !== this.currentSocketServer) {
      this.updateSocket(server);
    }
  }

  private handleStatus(data) {
    switch (data) {
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
        console.log('got unknown status:' + data.status);
        this.lastStatus = 'Loading';
        break;
    }
    console.log("emitted status: " + this.lastStatus);
    this.statusEmitter.emit(this.lastStatus);
  }

  private updateSocket(server) {
    this.currentSocketServer = server;
    this.socket = io(this.config.socketEndpoint + 'console', {path: '/s/', query: {server: server}});
    this.socket.on('connect', () => {
      this.socket.emit('authenticate', {token: this.auth.getUser().token}).on('authenticated', () => {
        console.log('ws connected');
        this.socket.on('initialStatus', (data) => {
          console.log('got initial status (' + JSON.stringify(data));
          this.handleStatus(data);
        }).on('statusUpdate', (data) => {
          console.log('on status update: ' + JSON.stringify(data));
          this.handleStatus(data);
        }).on('console', (data) => {
          console.log('on console: ' + JSON.stringify(data));
          this.consoleEmitter.emit(data.line);
        });
      });
    });
  }
}
