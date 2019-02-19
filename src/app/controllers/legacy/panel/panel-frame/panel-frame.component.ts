import {Component} from '@angular/core';
import {NavigationEnd} from '@angular/router';
import {Subject} from 'rxjs';
import {ResponsiveServerPage} from '../../../panel-controller.serverpage';

@Component({
  selector: 'app-panel-frame',
  templateUrl: './panel-frame.component.html',
  styleUrls: ['./panel-frame.component.scss']
})
export class PanelFrameComponent extends ResponsiveServerPage {

  sidebarDisplayed = true;
  currentUrl: string;

  servers: any;
  isMinecraft = false;
  isOwner = false;
  hidePlugins = false;
  motd = '';

  constructor() {
    super();
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.currentUrl = e.url;
      }
    });
  }

  loadData = async (): Promise<void> => {
    // Typescript can be super dumb sometimes
    const views = <any>(await this.currentServer.getCurrentServer()).details.preset.special.views;
    this.isMinecraft = views.indexOf('minecraft') > -1;
    this.hidePlugins = views.indexOf('no_plugin_viewer') > -1;
    this.isOwner = this.currentServer.ownsOne;
  };

  updateListing = async (): Promise<void> => {
    this.servers = await this.currentServer.getServers();
  };

  update = async (server) => {
    this.currentServer.currentServer = await this.currentServer.servers.find(serverData => serverData._id === server);
  };

  toggleSidebar() {
    this.sidebarDisplayed = !this.sidebarDisplayed;
  }

}
