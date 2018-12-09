import { Component, OnInit } from '@angular/core';
import {Subject} from 'rxjs';
import {ServerSocketManagerService} from '../../../core/services/server-socket-manager.service';
import {SelectedServerService} from '../../../core/services/selected-server.service';

@Component({
  selector: 'app-panel-home',
  templateUrl: './panel-home.component.html',
  styleUrls: ['./panel-home.component.scss']
})
export class PanelHomeComponent implements OnInit {

  consoleHistory = '';

  constructor(private serverSocket: ServerSocketManagerService, private selectedServer: SelectedServerService) {}

  ngOnInit() {
    this.selectedServer.getCurrentServer(server => {
      console.log("got current server");

      this.serverSocket.getSocket(server);
      this.serverSocket.consoleEmitter.subscribe(data => {
        this.consoleHistory = this.consoleHistory + data;
      })
    });
  }

}
