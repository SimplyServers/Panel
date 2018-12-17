import {Component, OnDestroy, OnInit} from '@angular/core';
import {ServerSocketManagerService} from '../../../core/services/server-socket-manager.service';
import {SelectedServerService} from '../../../core/services/selected-server.service';
import {ServerDetails} from '../../../core/models/server-details';
import {NavigationEnd, Router} from '@angular/router';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-panel-frame',
  templateUrl: './panel-frame.component.html',
  styleUrls: ['./panel-frame.component.scss']
})
export class PanelFrameComponent implements OnInit, OnDestroy {

  sidebarDisplayed = true;
  status: 'Running' | 'Stopped' | 'Stopping' | 'Crashed' | 'Starting' | 'Loading' = 'Loading';
  servers: object;
  currentServer: ServerDetails;

  isMinecraft = false;
  isOwner = false;

  currentUrl: string;

  selectedServerEmitter: Subject<any>;
  statusEmitter: Subject<any>;

  constructor(private serverSocket: ServerSocketManagerService, public selectedServer: SelectedServerService, private router: Router) {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.currentUrl = e.url;
      }
    });
  }

  updateStatus(){
    if(Object.keys(this.selectedServer.servers).length < 1){
      this.router.navigateByUrl('/panel/create');
    }

    this.currentServer = this.selectedServer.getCurrentServer();
    this.servers = this.selectedServer.getServers();
    this.status = this.serverSocket.lastStatus;
    this.serverSocket.getSocket(this.currentServer._id);

    //Typescript can be super dumb sometimes
    const views = <any>this.currentServer.preset.special.views;
    this.isMinecraft = views.indexOf("minecraft") > -1;
    this.isOwner = this.currentServer.isOwner;
  }

  ngOnInit() {
    this.updateStatus();

    this.statusEmitter = this.serverSocket.statusEmitter.subscribe(data => {
      this.status = data;
    });

    this.selectedServerEmitter = this.selectedServer.serverEmitter.subscribe(() => {
      this.serverSocket.cacheConsole('');
      this.updateStatus();
    });
  }

  ngOnDestroy() {
    if(this.statusEmitter !== undefined)
      this.statusEmitter.unsubscribe();
    if(this.selectedServerEmitter !== undefined)
      this.selectedServerEmitter.unsubscribe();
  }

  update(server) {
    this.selectedServer.setCurrentServer(this.selectedServer.servers.find(serverData => serverData._id === server));
    this.currentServer = server;
  }

  toggleSidebar(){
    this.sidebarDisplayed = !this.sidebarDisplayed;
  }

}
