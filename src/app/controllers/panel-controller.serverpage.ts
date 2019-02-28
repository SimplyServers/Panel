import {NotifierService} from 'angular-notifier';
import {Subject, Subscription} from 'rxjs';
import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {CurrentServerService} from '../services/current-server.service';
import {AuthService} from '../services/auth.service';
import {ServerSocketIOService} from '../services/server-socket-io.service';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder} from '@angular/forms';

@Injectable()
export abstract class ResponsiveServerPage {
  private selectedServerEmitter: Subscription;
  private serverCacheUpdateEmitter: Subscription;

  constructor(
    public auth: AuthService,
    public currentServer: CurrentServerService,
    public notify: NotifierService,
    public serverSocket: ServerSocketIOService,
    public router: Router,
    public formBuilder: FormBuilder,
    public activatedRoute: ActivatedRoute,
  ) { };

  onFirstInit = async (): Promise<void> => {
  };
  updateListing = async (): Promise<void> => {
  };
  loadData = async (): Promise<void> => {
  };
  onUnload = async (): Promise<void> => {
  };

 async ngUnload () {
    if (!this.selectedServerEmitter) {
      this.selectedServerEmitter.unsubscribe();
    }
    if (!this.serverCacheUpdateEmitter) {
      this.serverCacheUpdateEmitter.unsubscribe();
    }
    this.onUnload();
  };

  async ngInit (): Promise<void> {
    console.log("works!");
    // First init
    await this.onFirstInit();

    // When the server list is updated, refire updateListing
    this.serverCacheUpdateEmitter = this.currentServer.serverList.subscribe(() => {
      if (!this.currentServer.serverList.value) { return; }
      this.updateListing();
    });

    // When the server is changed, refire loadData
    this.selectedServerEmitter = this.currentServer.selectedServer.subscribe(() => {
      if (!this.currentServer.selectedServer.value) { return; }
      this.loadData();
    });
  }
}
