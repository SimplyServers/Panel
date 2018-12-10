import { Component, OnInit } from '@angular/core';
import {ServerSocketManagerService} from '../../../core/services/server-socket-manager.service';
import {SelectedServerService} from '../../../core/services/selected-server.service';
import {ServerDetails} from '../../../core/models/server-details';
import {Router} from '@angular/router';

@Component({
  selector: 'app-panel-frame',
  templateUrl: './panel-frame.component.html',
  styleUrls: ['./panel-frame.component.scss']
})
export class PanelFrameComponent implements OnInit {

  sidebarDisplayed = true;
  status: 'Running' | 'Stopped' | 'Stopping' | 'Crashed' | 'Starting' | 'Loading' = 'Loading';
  servers: object;
  currentServer: ServerDetails;

  constructor(private serverSocket: ServerSocketManagerService, private selectedServer: SelectedServerService, private router: Router) {}

  updateStatus(){
    this.currentServer = this.selectedServer.getCurrentServer();
    this.servers = this.selectedServer.getServers();
    this.status = this.serverSocket.lastStatus;
    this.serverSocket.getSocket(this.currentServer._id);
  }

  ngOnInit() {
    if(Object.keys(this.selectedServer.servers).length < 1){
      this.router.navigateByUrl('/panel/create');
    }else{
    }

    this.updateStatus();

    this.serverSocket.statusEmitter.subscribe(data => {
      this.status = data;
    });

    this.selectedServer.serverEmitter.subscribe(() => {
      this.updateStatus();
    });
  }

  update(server) {
    this.selectedServer.setCurrentServer(server);
    this.currentServer = server;
  }

  toggleSidebar(){
    this.sidebarDisplayed = !this.sidebarDisplayed;
  }

}
