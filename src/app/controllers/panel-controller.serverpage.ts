import {NotifierService} from 'angular-notifier';
import {Router} from '@angular/router';
import {Subject} from 'rxjs';
import {OnDestroy, OnInit} from '@angular/core';
import {CurrentServerService} from '../services/current-server.service';
import {AuthService} from '../services/auth.service';
import {ServiceLocator} from '../service.injector';

export class ResponsiveServerPage implements OnInit, OnDestroy {
  private selectedServerEmitter: Subject<any>;

  private auth: AuthService;
  private currentServer: CurrentServerService;
  private notify: NotifierService;
  private router: Router;

  constructor() {
    this.auth = ServiceLocator.injector.get(AuthService);
    this.currentServer = ServiceLocator.injector.get(CurrentServerService);
    this.notify = ServiceLocator.injector.get(NotifierService);
    this.router = ServiceLocator.injector.get(Router);
  };

  loadData = (): void => {};

  public ngOnDestroy = (): void => {
    if (!this.selectedServerEmitter) { this.selectedServerEmitter.unsubscribe(); }
  };

  public ngOnInit = (): void => {
    if (!this.currentServer.ownsOne) {
      this.router.navigateByUrl('/panel/create');
      return;
    }

    this.selectedServerEmitter = this.currentServer.serverUpdateEmitter.subscribe(() => {
      this.loadData();
    });
  };

}
