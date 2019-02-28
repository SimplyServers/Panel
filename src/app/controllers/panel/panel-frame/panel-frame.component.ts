import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {ResponsiveServerPage} from '../../panel-controller.serverpage';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-panel-frame',
  templateUrl: './panel-frame.component.html',
  styleUrls: ['./panel-frame.component.scss']
})
export class PanelFrameComponent extends ResponsiveServerPage implements OnInit, OnDestroy{
  loaded = false;
  sidebarDisplayed = true;
  currentUrl: string;
  servers: any;
  isMinecraft = false;
  isOwner = false;
  hidePlugins = false;
  motd = '';
  routerWatcher: Subscription;

  ngOnInit(): void {
    super.ngInit();
  }
  ngOnDestroy(): void {
    super.ngUnload();
  }

  onFirstInit = async () => {
    this.routerWatcher = this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        this.currentUrl = e.url;
      }
    });
  };

  onUnload = async () => {
    if (this.routerWatcher) {
      this.routerWatcher.unsubscribe();
    }
  };

  loadData = async (): Promise<void> => {
    this.loaded = true;
    // Typescript can be super dumb sometimes
    const views = <any>this.currentServer.selectedServer.value.details._preset.special.views;
    this.isMinecraft = views.indexOf('minecraft') > -1;
    this.hidePlugins = views.indexOf('no_plugin_viewer') > -1;
    this.isOwner = this.currentServer.ownsOne;
  };

  update = async (server: string) => {
    this.currentServer.updateServer(this.currentServer.serverList.value.find(serverData => serverData.details._id === server));
  };

  toggleSidebar() {
    this.sidebarDisplayed = !this.sidebarDisplayed;
  }

}
