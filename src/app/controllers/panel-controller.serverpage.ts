import {NotifierService} from 'angular-notifier';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {OnDestroy, OnInit} from '@angular/core';
import {CurrentServerService} from '../services/current-server.service';
import {AuthService} from '../services/auth.service';
import {ServiceLocator} from '../service.injector';
import {ServerSocketIOService} from '../services/server-socket-io.service';

export class ResponsiveServerPage implements OnInit, OnDestroy {
  public auth: AuthService;
  public currentServer: CurrentServerService;
  public notify: NotifierService;
  public serverSocket: ServerSocketIOService;
  private selectedServerEmitter: Subject<any>;
  private serverCacheUpdateEmitter: Subject<any>;

  constructor() {
    this.auth = ServiceLocator.injector.get(AuthService);
    this.currentServer = ServiceLocator.injector.get(CurrentServerService);
    this.notify = ServiceLocator.injector.get(NotifierService);
    this.serverSocket = ServiceLocator.injector.get(ServerSocketIOService);
  };

  onFirstInit = async (): Promise<void> => {
  };
  updateListing = async (): Promise<void> => {
  };
  loadData = async (): Promise<void> => {
  };
  onUnload = async (): Promise<void> => {
  };

  public ngOnDestroy = (): void => {
    if (!this.selectedServerEmitter) {
      this.selectedServerEmitter.unsubscribe();
    }
    if (!this.serverCacheUpdateEmitter) {
      this.serverCacheUpdateEmitter.unsubscribe();
    }
    this.onUnload();
  };

  public ngOnInit = async (): Promise<void> => {
    // First init
    await this.onFirstInit();

    // Load data initially
    await this.loadData();

    // When the server list is updated, refire updateListing
    this.serverCacheUpdateEmitter = this.currentServer.serverCacheEmitter.subscribe(() => {
      this.updateListing();
    });

    // When the server is changed, refire loadData
    this.selectedServerEmitter = this.currentServer.serverUpdateEmitter.subscribe(() => {
      this.loadData();
    });
  };

}
