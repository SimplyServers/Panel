import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../core/services/authentication.service';
import {ServerSocketManagerService} from '../../../core/services/server-socket-manager.service';
import {ServerDetails} from '../../../core/models/server-details';
import {SelectedServerService} from '../../../core/services/selected-server.service';
import {Subject} from 'rxjs';
import {NotifierService} from 'angular-notifier';
import {Router} from '@angular/router';

@Component({
  selector: 'app-panel-settings',
  templateUrl: './panel-settings.component.html',
  styleUrls: ['./panel-settings.component.scss']
})
export class PanelSettingsComponent implements OnInit, OnDestroy {
  currentServer: ServerDetails;
  selectedServerEmitter: Subject<any>;

  loading = true;

  constructor(private auth: AuthenticationService, public serverSocket: ServerSocketManagerService, private selectedServer: SelectedServerService, private notify: NotifierService, private router: Router) { }

  updateServer(){
    this.currentServer = this.selectedServer.getCurrentServer();

    if(!this.currentServer.isOwner){
      this.router.navigateByUrl('/panel');
    }

    this.loading = false;
  }

  ngOnInit() {
    if(this.selectedServer.getCurrentServer() !== undefined) {
      this.updateServer();

      //On server update
      this.selectedServerEmitter = this.selectedServer.serverEmitter.subscribe(() => {
        this.updateServer();
      });
    }
  }

  ngOnDestroy() {
    if(this.selectedServerEmitter !== undefined)
      this.selectedServerEmitter.unsubscribe();
  }

  removeServer(){
    if (this.serverSocket.lastStatus !== 'Stopped')
      return;
    this.auth.removeServer(this.currentServer._id).subscribe(() => {
      this.selectedServer.updateCache(true, () => {
        this.selectedServer.resetCurrentServer();
      });
    }, (err) => {
      this.notify.notify('error', 'Failed to reinstall server; ' + err);
    });
  }

}
