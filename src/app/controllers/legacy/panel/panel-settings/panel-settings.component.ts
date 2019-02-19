import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ResponsiveServerPage} from '../../../panel-controller.serverpage';
import {Server} from '../../../../models/server.model';
import {ServerStatus} from '../../../../services/server-socket-io.service';

@Component({
  selector: 'app-panel-settings',
  templateUrl: './panel-settings.component.html',
  styleUrls: ['./panel-settings.component.scss']
})
export class PanelSettingsComponent extends ResponsiveServerPage {
  @ViewChild('changeModal', { read: ElementRef }) changeModal: ElementRef;

  error: string;

  changeLoading = false;
  changeSubmitted = false;
  nothingToChange = false;
  presetList: any;

  changeForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  loadData = async (): Promise<void> =>  {
    this.changeForm = this.formBuilder.group({
      preset: ['', Validators.compose([Validators.required, Validators.maxLength(30)])]
    });

    const server: Server = await this.currentServer.getCurrentServer();
    if (Object.keys(server.details.preset.allowSwitchingTo).length < 1) {
      this.nothingToChange = true;
    }

    if (!server.details.isOwner) {
      this.router.navigateByUrl('/panel');
    }

    this.presetList = server.details.preset.allowSwitchingTo;
  };

  private removeServer = async (): Promise<void> => {
    if (this.serverSocket.serverStatus !== ServerStatus.STOPPED) {
      return;
    }

    const server: Server = await this.currentServer.getCurrentServer();
    try {
      await server.remove();
      await this.currentServer.updateCache(false);

      if (Object.keys(this.currentServer.servers).length >= 1) {
        await this.currentServer.updateCurrentServerData();
      } else {
        this.currentServer.currentServer = undefined;
        this.serverSocket.cachedConsole = '';
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

    const server: Server = await this.currentServer.getCurrentServer();

    // WTF BROWSERS ARE LITERALLY HORRIBLE
    // This needs to set to a empty array to actually sync the actual value of the option dropdown with the one that is displayed
    this.presetList = [];

    try {
      await server.changePreset(this.changeForm.controls.preset.value);
      await this.currentServer.updateCurrentServerData();
      this.changeModal.nativeElement.click();
    } catch (e) {
      this.error = e;
    }

    this.changeLoading = false;
    this.changeForm.controls.preset.setValue(undefined);
  }

}
