import { Component, OnInit } from '@angular/core';
import {ServerSocketManagerService} from '../../../core/services/server-socket-manager.service';
import {SelectedServerService} from '../../../core/services/selected-server.service';

@Component({
  selector: 'app-panel-frame',
  templateUrl: './panel-frame.component.html',
  styleUrls: ['./panel-frame.component.scss']
})
export class PanelFrameComponent implements OnInit {

  sidebarDisplayed = true;
  status: 'Running' | 'Stopped' | 'Stopping' | 'Crashed' | 'Starting' | 'Loading' = 'Loading';
  servers: object;
  currentServer: string;

  constructor(private serverSocket: ServerSocketManagerService, private selectedServer: SelectedServerService) {}

  updateStatus(){
    console.log("using default status: " + this.serverSocket.lastStatus);
    this.status = this.serverSocket.lastStatus;
    this.selectedServer.getCurrentServer(server => {
      console.log("status: ct: " + server);
      this.serverSocket.getSocket(server);
    });
  }

  ngOnInit() {
    this.selectedServer.getServers(servers => {
      this.servers = servers;
      this.selectedServer.getCurrentServer((server) => {
        this.currentServer = server;
      });
      console.log("servers:"  + servers)
    });

    this.updateStatus();

    this.serverSocket.statusEmitter.subscribe(data => {
      console.log("Got new status from event emitter: " + data);
      this.status = data;
    });

    this.selectedServer.serverEmitter.subscribe(() => {
      this.updateStatus();
    });
  }

  update(server) {
    console.log("updating server to: " + server);
    this.selectedServer.setCurrentServer(server);
    this.currentServer = server;
  }

  toggleSidebar(){
    this.sidebarDisplayed = !this.sidebarDisplayed;
    console.log("sidebar: " + this.sidebarDisplayed);
  }

}
