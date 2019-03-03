import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';

import * as path from 'path-browserify';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ResponsiveServerPage} from '../../panel-controller.serverpage';
import {FileDetails, Server} from '../../../models/server.model';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-panel-files',
  templateUrl: './panel-files.component.html',
  styleUrls: ['./panel-files.component.scss']
})
export class PanelFilesComponent extends ResponsiveServerPage implements OnInit, OnDestroy {
  @ViewChild('addModal', {read: ElementRef}) addModal: ElementRef;
  filesList: any;
  currentPath: string;
  loading = false;
  addForm: FormGroup = this.formBuilder.group({
    path: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
  });
  addLoading = false;
  addSubmitted = false;
  error: string;

  ngOnInit(): void {
    super.ngInit();
  }
  ngOnDestroy(): void {
    super.ngUnload();
  }
  loadData = async (): Promise<void> => {
    this.currentPath = '/';

    // Make sure the server isn't blocked
    if (this.serverSocket.blockedSource.value) {
      return;
    }

    await this.updateListing();
  };

  updateListing = async (): Promise<void> => {
    this.loading = true;

    try {
      this.filesList = await this.serverActions.listDir(this.currentPath);
    } catch (e) {
      this.notify.notify('error', 'Failed to get server files; ' + e);
    }

    this.loading = false;
  };

  private onClick = async (file: FileDetails): Promise<void> => {
    if (file.isDir) {
      this.currentPath = path.join(this.currentPath, file.name);
    } else if (file.edible && file.isFile) {
      this.router.navigateByUrl('/panel/files/edit?f=' + path.join(this.currentPath, file.name));
      return;
    } else {
      return;
    }

    await this.updateListing();
  };

  private goUp = async (): Promise<void> => {
    this.currentPath = path.join(this.currentPath, '../');
    await this.updateListing();
  };

  private goToRoot = async (): Promise<void> => {
    this.currentPath = '/';
    await this.updateListing();
  };

  private remove = async (file: FileDetails): Promise<void> => {
    if (file.isDir) {
      try {
        await this.serverActions.removeFolder(path.join(this.currentPath, file.name));
        await this.updateListing();
      } catch (e) {
        this.notify.notify('error', 'Failed to remove folder. (is it not empty?)');
      }
    } else if (file.isFile) {
      try {
        await this.serverActions.removeFile(path.join(this.currentPath, file.name));
        await this.updateListing();
      } catch (e) {
        this.notify.notify('error', 'Failed to remove file.');
      }
    }
  };

  private getSize = (bytes: number): String => {
    const kb = bytes * 0.001;
    const mb = bytes * 0.000001;

    if (bytes < 1000) {
      return Math.round(bytes * 100) / 100 + 'B';
    } else if (kb < 1000) {
      return Math.round(kb * 100) / 100 + 'KB';
    } else {
      return Math.round(mb * 100) / 100 + 'MB';
    }
  };

  private onAdd = async (): Promise<void> => {
    this.addSubmitted = true;
    if (this.addForm.invalid) {
      return;
    }
    this.addLoading = true;

    const targetPath = path.join(this.currentPath, this.addForm.controls.path.value);

    try {
      const checkOk = await this.serverActions.checkAllowed(targetPath);
      if (checkOk) {
        this.addModal.nativeElement.click();
        this.router.navigateByUrl('/panel/files/edit?f=' + targetPath);
      } else {
        this.error = 'File path not supported.';
      }
    } catch (e) {
      this.error = e;
    }

    this.addLoading = false;
  };

}
