import {Component, OnInit} from '@angular/core';
import {ServerControlService} from '../../../core/services/server-control.service';

@Component({
  selector: 'app-panel-serverselector',
  templateUrl: './panel-serverselector.component.html',
  styleUrls: ['./panel-serverselector.component.scss']
})
export class PanelServerselectorComponent implements OnInit {

  servers: object;

  constructor(private serverControl: ServerControlService) {
    this.serverControl.getServers(servers => {
      this.servers = servers;
    });
  }

  ngOnInit() {
  }

  update(server) {
    this.serverControl.setCurrentServer(server);
  }

}
