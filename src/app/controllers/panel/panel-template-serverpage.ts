import {AuthenticationService} from '../../core/services/legacy/authentication.service';
import {NotifierService} from 'angular-notifier';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {OnDestroy, OnInit} from '@angular/core';
import {CurrentServerService} from '../../core/services/current-server.service';
import {Server} from '../../core/models/server.model';

class ResponsiveSereverPage implements OnInit, OnDestroy {
  private selectedServerEmitter: Subject<any>;

  constructor(private auth: AuthenticationService,
              private selectedServer: CurrentServerService,
              private notify: NotifierService,
              private router: Router) {};

  private getServer = (): Server => {
    return this.selectedServer.currentServer;
  };

  private loadData = (): void => {};

  public ngOnDestroy = (): void => {
    if (!this.selectedServerEmitter) { this.selectedServerEmitter.unsubscribe(); }
  };

  public ngOnInit = (): void => {
    this.selectedServerEmitter = this.selectedServer.serverUpdateEmitter.subscribe(() => {
      this.loadData();
    });
  };

}
