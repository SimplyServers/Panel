import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthenticationService} from '../../../core/services/authentication.service';
import {ServerSocketManagerService} from '../../../core/services/server-socket-manager.service';
import {ServerDetails} from '../../../core/models/server-details';
import {SelectedServerService} from '../../../core/services/selected-server.service';
import {Subject} from 'rxjs';
import {NotifierService} from 'angular-notifier';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, NgModel, Validators} from '@angular/forms';

@Component({
  selector: 'app-panel-settings',
  templateUrl: './panel-settings.component.html',
  styleUrls: ['./panel-settings.component.scss']
})
export class PanelSettingsComponent implements OnInit, OnDestroy {
  @ViewChild('changeModal', {read: ElementRef}) changeModal: ElementRef;

  currentServer: ServerDetails;
  selectedServerEmitter: Subject<any>;

  loading = true;
  error: string;

  changeLoading = false;
  changeSubmitted = false;
  nothingToChange = false;
  presetList: any;

  changeForm: FormGroup;

  constructor(private auth: AuthenticationService, public serverSocket: ServerSocketManagerService, private selectedServer: SelectedServerService, private notify: NotifierService, private router: Router, private formBuilder: FormBuilder) {
  }

  updateServer() {
    this.currentServer = this.selectedServer.getCurrentServer();

    if (Object.keys(this.currentServer.preset.allowSwitchingTo).length < 1)
      this.nothingToChange = true;

    if (!this.currentServer.isOwner) {
      this.router.navigateByUrl('/panel');
    }

    this.loading = false;
    this.presetList = this.currentServer.preset.allowSwitchingTo;
  }

  ngOnInit() {
    this.changeForm = this.formBuilder.group({
      preset: ['', Validators.compose([Validators.required, Validators.maxLength(30)])]
    });

    if (this.selectedServer.getCurrentServer() !== undefined) {
      this.updateServer();

      //On server update
      this.selectedServerEmitter = this.selectedServer.serverEmitter.subscribe(() => {
        this.updateServer();
      });
    }
  }

  ngOnDestroy() {
    if (this.selectedServerEmitter !== undefined)
      this.selectedServerEmitter.unsubscribe();
  }

  removeServer() {
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

  updatePlan() {
    this.changeSubmitted = true;
    if (this.changeForm.invalid) {
      return;
    }
    this.changeLoading = true;

    //WTF BROWSERS ARE LITERALLY HORRIBLE
    //This needs to set to a empty array to actually sync the actual value of the option dropdown with the one that is displayed
    this.presetList = [];

    this.auth.changePreset(this.currentServer._id, this.changeForm.controls.preset.value).subscribe(() => {
      this.selectedServer.updateCache(true, () => {
        this.selectedServer.reloadCurrentServer();
        this.changeSubmitted = false;
        this.changeLoading = false;
        this.changeModal.nativeElement.click();
        this.changeForm.controls.preset.setValue(undefined);
      });
    }, (err) => {
      this.error = err;
      this.changeLoading = false;
      this.changeSubmitted = false;
    });
  }

}
