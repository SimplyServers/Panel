import {Component, OnDestroy, OnInit} from '@angular/core';
import {ServerSocketManagerService} from '../../../core/services/server-socket-manager.service';
import {SelectedServerService} from '../../../core/services/selected-server.service';
import {ServerDetails} from '../../../core/models/server-details';
import {NavigationEnd, Router} from '@angular/router';
import {Subject} from 'rxjs';
import {SSAnalyticsService} from '../../../core/services/ssanalytics.service';

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
  hidePlugins = false;

  currentUrl: string;

  selectedServerEmitter: Subject<any>;
  serverCacheEmitter: Subject<any>;
  statusEmitter: Subject<any>;

  motd = '';

  constructor(private serverSocket: ServerSocketManagerService, public selectedServer: SelectedServerService, private router: Router, private analytics: SSAnalyticsService) {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.currentUrl = e.url;
      }
    });
  }

  updateStatus(){
    console.log(this.selectedServer.servers);
    if(Object.keys(this.selectedServer.servers).length < 1){
      this.router.navigateByUrl('/panel/create');
      return;
    } else {
      console.log('everything is ok');
    }

    this.currentServer = this.selectedServer.getCurrentServer();
    this.status = this.serverSocket.lastStatus;
    this.serverSocket.getSocket(this.currentServer._id);

    //Typescript can be super dumb sometimes
    const views = <any>this.currentServer.preset.special.views;
    this.isMinecraft = views.indexOf("minecraft") > -1;
    this.hidePlugins = views.indexOf("no_plugin_viewer") > -1;
    this.isOwner = this.currentServer.isOwner;
  }

  updateDropdown() {
    this.servers = this.selectedServer.getServers();
  }

  ngOnInit() {
    this.motd = this.analytics.loadData.motd;
    this.updateStatus();
    this.updateDropdown();

    this.statusEmitter = this.serverSocket.statusEmitter.subscribe(data => {
      this.status = data;
    });

    this.serverCacheEmitter = this.selectedServer.serverCacheEmitter.subscribe(() => {
      this.updateDropdown();
    });

    this.selectedServerEmitter = this.selectedServer.serverUpdateEmitter.subscribe(() => {
      this.serverSocket.cacheConsole('');
      this.updateStatus();
    });
  }

  ngOnDestroy() {
    if(this.statusEmitter !== undefined)
      this.statusEmitter.unsubscribe();
    if(this.selectedServerEmitter !== undefined)
      this.selectedServerEmitter.unsubscribe();
    if (this.serverCacheEmitter !== undefined)
      this.serverCacheEmitter.unsubscribe();
  }

  update(server) {
    this.selectedServer.setCurrentServer(this.selectedServer.servers.find(serverData => serverData._id === server));
    this.currentServer = server;
  }

  toggleSidebar(){
    this.sidebarDisplayed = !this.sidebarDisplayed;
  }

}
