import {Component, OnDestroy, OnInit} from '@angular/core';
import {ServerDetails} from '../../../core/models/server-details';
import {Subject} from 'rxjs';
import {FileDetails} from '../../../core/models/file-details';
import {SelectedServerService} from '../../../core/services/selected-server.service';
import {AuthenticationService} from '../../../core/services/authentication.service';

import * as path from 'path-browserify';
import {NotifierService} from 'angular-notifier';
import {ServerSocketManagerService} from '../../../core/services/server-socket-manager.service';

@Component({
  selector: 'app-panel-files',
  templateUrl: './panel-files.component.html',
  styleUrls: ['./panel-files.component.scss']
})
export class PanelFilesComponent implements OnInit, OnDestroy {

  currentServer: ServerDetails;
  selectedServerEmitter: Subject<any>;

  filesList: any;
  currentPath: string;

  loading = false;

  constructor(private selectedServer: SelectedServerService, private auth: AuthenticationService, private notify: NotifierService, private serverSocket: ServerSocketManagerService) {
  }

  ngOnInit() {
    this.currentPath = '/';
    this.updateFiles();

    //On server update
    this.selectedServerEmitter = this.selectedServer.serverUpdateEmitter.subscribe(() => {
      this.updateFiles();
    });
  }

  ngOnDestroy() {
    if (this.selectedServerEmitter !== undefined)
      this.selectedServerEmitter.unsubscribe();
  }

  updateFiles() {
    this.currentServer = this.selectedServer.getCurrentServer();
    this.updateListing();
  }

  updateListing() {
    this.loading = true;
    if (this.serverSocket.lastBlocked) {
      console.log('block detected');
      this.notify.notify('error', 'Cannot get directory listing when the server is blocked.');
      return;
    }

    this.auth.listDir(this.currentServer._id, this.currentPath).subscribe(data => {
      this.loading = false;
      this.filesList = data;
    }, (err) => {
      this.notify.notify('error', 'Failed to get server files; ' + err);
    });
  }

  onClick(file: FileDetails) {
    if (file.isDir)
      this.currentPath = path.join(this.currentPath, file.name);
    this.updateListing();
  }

  goUp() {
    this.currentPath = path.join(this.currentPath, '../');
    this.updateListing();
  }

  getSize(bytes: number) {
    const kb = bytes * 0.001;
    const mb = bytes * 0.000001;

    if (bytes < 1000)
      return Math.round(bytes * 100) / 100 + 'B';
    else if (kb < 1000)
      return Math.round(kb * 100) / 100 + 'KB';
    else
      return Math.round(mb * 100) / 100 + 'MB';
  }

}
