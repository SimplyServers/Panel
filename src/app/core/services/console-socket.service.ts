import { Injectable } from '@angular/core';

import {Observable, Subject} from 'rxjs';
import {ConfigService} from '../../config.service';

import * as io from 'socket.io-client';
import {AuthenticationService} from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class ConsoleSocketService {

  private socket;

  constructor(private config: ConfigService, private auth: AuthenticationService) { }

  connect(server): Subject<MessageEvent> {
    this.socket = io(this.config.socketEndpoint + "console", {path: '/s/', query: {server: server}});

    this.socket.on('connect', () => {
      this.socket.emit('authenticate', {token: this.auth.getUser().token}).on('authenticated', () => {
      });
    });

    let observable = new Observable(observer => {
      this.socket.on('console', (data) => {
        observer.next(data);
      });
      return () => {
        this.socket.disconnect();
      }
    });

    let observer = {
      next: (data: Object) => {},
    };

    return Subject.create(observer, observable);
  }

}
