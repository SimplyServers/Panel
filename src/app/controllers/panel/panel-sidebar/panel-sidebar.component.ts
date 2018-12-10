import { Component, OnInit } from '@angular/core';
import {SelectedServerService} from '../../../core/services/selected-server.service';

@Component({
  selector: 'app-panel-sidebar',
  templateUrl: './panel-sidebar.component.html',
  styleUrls: ['./panel-sidebar.component.scss']
})
export class PanelSidebarComponent implements OnInit {

  servers: object;
  currentServer: string;

  constructor(private selectedServer: SelectedServerService) {
  }

  ngOnInit() {
    this.selectedServer.getServers(servers => {
      this.servers = servers;
      this.selectedServer.getCurrentServer((server) => {
        this.currentServer = server;
      });
      console.log("servers:"  + servers)
    });
  }

  update(server) {
    console.log("updating server to: " + server);
    this.selectedServer.setCurrentServer(server);
    this.currentServer = server;
  }

}
