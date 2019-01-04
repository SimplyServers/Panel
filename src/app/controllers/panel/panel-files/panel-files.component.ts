import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ServerDetails} from '../../../core/models/server-details';
import {Subject} from 'rxjs';
import {FileDetails} from '../../../core/models/file-details';
import {SelectedServerService} from '../../../core/services/selected-server.service';
import {AuthenticationService} from '../../../core/services/authentication.service';

import * as path from 'path-browserify';
import {NotifierService} from 'angular-notifier';
import {ServerSocketManagerService} from '../../../core/services/server-socket-manager.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-panel-files',
  templateUrl: './panel-files.component.html',
  styleUrls: ['./panel-files.component.scss']
})
export class PanelFilesComponent implements OnInit, OnDestroy {
  @ViewChild('addModal', {read: ElementRef}) addModal: ElementRef;

  currentServer: ServerDetails;
  selectedServerEmitter: Subject<any>;

  filesList: any;
  currentPath: string;

  loading = false;
  blocked = false;

  addForm: FormGroup;
  addLoading = false;
  addSubmitted = false;
  error: string;

  constructor(private selectedServer: SelectedServerService,
              private auth: AuthenticationService,
              private notify: NotifierService,
              public serverSocket: ServerSocketManagerService,
              private router: Router,
              private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.addForm = this.formBuilder.group({
      path: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
    });

    this.currentPath = '/';

    //We cannot view files while the server is blocked.
    if (this.serverSocket.lastBlocked) {
      this.blocked = true;
      return;
    }

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
    else if (file.edible && file.isFile) {
      this.router.navigateByUrl('/panel/files/edit?f=' + path.join(this.currentPath, file.name));
      return;
    } else {
      return;
    }
    this.updateListing();
  }

  goUp() {
    this.currentPath = path.join(this.currentPath, '../');
    this.updateListing();
  }

  goToRoot() {
    this.currentPath = '/';
    this.updateListing();
  }

  remove(file: FileDetails) {
    if (file.isDir) {
      this.auth.removeFolder(this.currentServer._id, path.join(this.currentPath, file.name)).subscribe(data => {
        this.updateListing();
      }, () => {
        this.notify.notify('error', 'Failed to remove folder. (is it not empty?)');
      });
    } else if (file.isFile) {
      this.auth.removeFile(this.currentServer._id, path.join(this.currentPath, file.name)).subscribe(data => {
        this.updateListing();
      }, () => {
        this.notify.notify('error', 'Failed to remove file.');
      });
    } else {

    }
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

  onAdd() {
    this.addSubmitted = true;
    if (this.addForm.invalid) {
      return;
    }
    this.addLoading = true;

    const targetPath = path.join(this.currentPath, this.addForm.controls.path.value);

    this.auth.checkAllowed(this.currentServer._id, targetPath).subscribe(data => {
      if (data) {
        this.addModal.nativeElement.click();
        this.router.navigateByUrl('/panel/files/edit?f=' + targetPath);
      } else {
        this.error = 'File path not supported.';
      }
      this.addLoading = false;
    }, (err) => {
      this.error = err;
      this.addLoading = false;
    });
  }

}
