import { Component, OnInit } from '@angular/core';
import {ConsoleSocketService} from '../../../core/services/console-socket.service';
import {ServerControlService} from '../../../core/services/server-control.service';
import {Subject} from 'rxjs';

import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-panel-home',
  templateUrl: './panel-home.component.html',
  styleUrls: ['./panel-home.component.scss']
})
export class PanelHomeComponent implements OnInit {

  consoleSocket: Subject<any>;
  consoleHistory: string;

  constructor(private consoleWs: ConsoleSocketService, serverControl: ServerControlService) {
    serverControl.getCurrentServer((server) => {
      this.consoleSocket = <Subject<any>>consoleWs.connect(server).pipe(map(response => {
        return response;
      }));

      this.consoleSocket.subscribe(data => {
        this.consoleHistory = this.consoleHistory + data.line;
      })

    });
    
  }

  ngOnInit() {
  }

}
