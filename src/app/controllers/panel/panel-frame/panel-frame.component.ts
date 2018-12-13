import { Component, OnInit } from '@angular/core';
import {ServerSocketManagerService} from '../../../core/services/server-socket-manager.service';
import {SelectedServerService} from '../../../core/services/selected-server.service';
import {ServerDetails} from '../../../core/models/server-details';
import {NavigationEnd, Router} from '@angular/router';

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

  isMinecraft = false;

  currentUrl: string;

  constructor(private serverSocket: ServerSocketManagerService, private selectedServer: SelectedServerService, private router: Router) {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.currentUrl = e.url;
      }
    });
  }

  updateStatus(){
    this.currentServer = this.selectedServer.getCurrentServer();
    this.servers = this.selectedServer.getServers();
    this.status = this.serverSocket.lastStatus;
    this.serverSocket.getSocket(this.currentServer._id);

    //Typescript can be super dumb sometimes
    const views = <any>this.currentServer.preset.special.views;
    this.isMinecraft = views.indexOf("minecraft") > -1;
  }

  ngOnInit() {
    if(Object.keys(this.selectedServer.servers).length < 1){
      this.router.navigateByUrl('/panel/create');
    }

    this.updateStatus();

    this.serverSocket.statusEmitter.subscribe(data => {
      this.status = data;
    });

    this.selectedServer.serverEmitter.subscribe(() => {
      this.serverSocket.cacheConsole('');
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
