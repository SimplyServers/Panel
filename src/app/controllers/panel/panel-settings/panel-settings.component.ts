import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ResponsiveServerPage} from '../../panel-controller.serverpage';
import {Server} from '../../../models/server.model';
import {ServerStatus} from '../../../services/server-socket-io.service';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-panel-settings',
  templateUrl: './panel-settings.component.html',
  styleUrls: ['./panel-settings.component.scss']
})
export class PanelSettingsComponent extends ResponsiveServerPage implements OnInit, OnDestroy{
  @ViewChild('changeModal', {read: ElementRef}) changeModal: ElementRef;
  error: string;
  changeLoading = false;
  changeSubmitted = false;
  nothingToChange = false;
  presetList: any;
  changeForm: FormGroup;

  ngOnInit(): void {
    super.ngInit();
  }
  ngOnDestroy(): void {
    super.ngUnload();
  }

  loadData = async (): Promise<void> => {
    this.changeForm = this.formBuilder.group({
      preset: ['', Validators.compose([Validators.required, Validators.maxLength(30)])]
    });

    if (Object.keys(this.currentServer.selectedServer.value.details._preset._allowSwitchingTo).length < 1) {
      this.nothingToChange = true;
    }

    if (this.currentServer.selectedServer.value.details._owner._id !== this.auth.user.id) {
      this.router.navigateByUrl('/panel');
    }

    this.presetList = this.currentServer.selectedServer.value.details._preset._allowSwitchingTo;
  };

  private removeServer = async (): Promise<void> => {
    if (this.serverSocket.statusSource.value !== ServerStatus.STOPPED) {
      return;
    }

    try {
      await this.currentServer.selectedServer.value.remove();
      await this.currentServer.updateCache();

      if (Object.keys(this.currentServer.serverList.value).length >= 1) {
        await this.currentServer.reloadCurrentServer();
      } else {
        this.currentServer.updateServer(undefined);
        this.serverSocket.consoleSource.next('');
        this.router.navigateByUrl('/panel/create');
      }
    } catch (e) {
      this.notify.notify('error', 'Failed to reinstall server; ' + e);
    }
  };

  private updatePlan = async (): Promise<void> => {
    this.changeSubmitted = true;
    if (this.changeForm.invalid) {
      return;
    }
    this.changeLoading = true;

    // WTF BROWSERS ARE LITERALLY HORRIBLE
    // This needs to set to a empty array to actually sync the actual value of the option dropdown with the one that is displayed
    this.presetList = [];

    try {
      await this.currentServer.selectedServer.value.changePreset(this.changeForm.controls.preset.value);
      await this.currentServer.reloadCurrentServer();
      this.changeModal.nativeElement.click();
    } catch (e) {
      this.error = e;
    }

    this.changeLoading = false;
    this.changeForm.controls.preset.setValue(undefined);
  };

}
