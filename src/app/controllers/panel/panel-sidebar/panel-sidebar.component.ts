import { Component, OnInit } from '@angular/core';
import {SelectedServerService} from '../../../core/services/selected-server.service';

@Component({
  selector: 'app-panel-sidebar',
  templateUrl: './panel-sidebar.component.html',
  styleUrls: ['./panel-sidebar.component.scss']
})
export class PanelSidebarComponent implements OnInit {

  servers: object;

  constructor(private selectedServer: SelectedServerService) {
  }

  ngOnInit() {
    this.selectedServer.getServers(servers => {
      this.servers = servers;
      console.log("servers:"  + servers)
    });
  }

  update(server) {
    this.selectedServer.setCurrentServer(server);
  }

}
