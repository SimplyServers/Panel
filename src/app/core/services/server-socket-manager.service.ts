import {EventEmitter, Injectable} from '@angular/core';
import {ConfigService} from '../../config.service';
import {AuthenticationService} from './authentication.service';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class ServerSocketManagerService {

  currentSocketServer = '';
  private socket;
  lastStatus: 'Running' | 'Stopped' | 'Stopping' | 'Crashed' | 'Starting' | 'Loading' = 'Loading';
  statusEmitter = new EventEmitter();
  consoleEmitter = new EventEmitter();
  announceEmitter = new EventEmitter();
  private cachedConsole = '';

  constructor(private config: ConfigService, private auth: AuthenticationService) {
  }

  getSocket(server, callback?) {
    if (server !== this.currentSocketServer) {
      console.log("reloading socket due to server change");
      if(callback){
        this.updateSocket(server, callback);
      }else{
        this.updateSocket(server);
      }
    }else{
      if(callback)
        callback();
    }
  }

  cacheConsole(consoleText){
    this.cachedConsole = consoleText;
  }

  getConsole(){
    return this.cachedConsole;
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
    console.log("Emitting status: " + this.lastStatus);
    this.statusEmitter.emit(this.lastStatus);
  }

  private updateSocket(server, callback?) {
    this.currentSocketServer = server;
    console.log("updating socket server to: " + server);

    if(this.socket !== undefined){
      console.log("closing old socket");
      this.socket.disconnect();
      this.socket = undefined;
    }

    this.socket = io(this.config.socketEndpoint + 'console', {path: '/s/', query: {server: server}});
    this.socket.on('connect', () => {
      this.socket.emit('authenticate', {token: this.auth.getUser().token}).on('authenticated', () => {
        console.log('ws connected');

        if(callback)
          callback();

        this.socket.on('initialStatus', (data) => {
          this.handleStatus(data);
        }).on('statusUpdate', (data) => {
          this.handleStatus(data);
        }).on('console', (data) => {
          this.consoleEmitter.emit(data.line);
        }).on('announcement', data => {
          this.announceEmitter.emit(data);
        });
      });
    });
  }
}
