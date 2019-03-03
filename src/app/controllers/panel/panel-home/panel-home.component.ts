import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {interval, Subject, Subscription} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ResponsiveServerPage} from '../../panel-controller.serverpage';
import {ServerStatus} from '../../../services/server-socket-io.service';

@Component({
  selector: 'app-panel-home',
  templateUrl: './panel-home.component.html',
  styleUrls: ['./panel-home.component.scss']
})
export class PanelHomeComponent extends ResponsiveServerPage implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('textAreaElement', {read: ElementRef}) textAreaElement: ElementRef;
  commandForm: FormGroup = this.formBuilder.group({
    command: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
  });
  commandLoading = false;
  commandSubmitted = false;
  update = false;
  consoleEmitter: Subscription;

  ngOnInit(): void {
    super.ngInit();
  }
  ngOnDestroy(): void {
    super.ngUnload();
  }

  onFirstInit = async (): Promise<void> => {
    console.log('current server via selectedServer @ home: ' + JSON.stringify(this.currentServer.selectedServer.value));
    console.log('fdswij9:' + JSON.stringify(this.currentServer.selectedServer.value.details));
    // Read scroll() todo.
    interval(500).subscribe(() => {
      if (this.update) {
        this.update = false;
        this.textAreaElement.nativeElement.scrollTop = this.textAreaElement.nativeElement.scrollHeight + 2;
      }
    });

    this.consoleEmitter = this.serverSocket.consoleSource.subscribe(() => {
      this.update = true;
    });
  };

  ngAfterViewInit() {
    if (this.textAreaElement) {
      this.update = false; // This is so the console will scroll
    }
  }

  onUnload = async (): Promise<void> => {
    if (this.consoleEmitter !== undefined) {
      this.consoleEmitter.unsubscribe();
    }
  };

  loadData = async (): Promise<void> => {
    console.log('current server via selectedServer @ home: ' + this.currentServer.selectedServer.value.details);
  };

  private serverOn = async (): Promise<void> => {
    if (this.serverSocket.statusSource.value !== ServerStatus.STOPPED) {
      return;
    }
    try {
      await this.serverActions.startPower();
    } catch (e) {
      console.error(e);
      this.notify.notify('error', 'Failed to turn the server on; ' + e);
    }
  };

  private serverOff = async (): Promise<void> => {
    if (this.serverSocket.statusSource.value !== ServerStatus.RUNNING) {
      return;
    }

    try {
      await this.serverActions.offPower();
    } catch (e) {
      console.error(e);
      this.notify.notify('error', 'Failed to turn the server off; ' + e);
    }
  };

  private serverKill = async (): Promise<void> => {
    if (this.serverSocket.statusSource.value !== ServerStatus.RUNNING &&
      this.serverSocket.statusSource.value !== ServerStatus.STARTING &&
      this.serverSocket.statusSource.value !== ServerStatus.STOPPING) {
      return;
    }

    try {
      await this.serverActions.killPower();
    } catch (e) {
      console.error(e);
      this.notify.notify('error', 'Failed to kill the server; ' + e);
    }
  };

  private installServer = async (): Promise<void> => {
    if (this.serverSocket.statusSource.value !== ServerStatus.STOPPED) {
      return;
    }

    try {
      await this.serverActions.install();
    } catch (e) {
      console.error(e);
      this.notify.notify('error', 'Failed to install server; ' + e);
    }
  };

  private reinstallServer = async (): Promise<void> => {
    if (this.serverSocket.statusSource.value !== ServerStatus.STOPPED) {
      return;
    }

    try {
      await this.serverActions.reinstall();
    } catch (e) {
      console.error(e);
      this.notify.notify('error', 'Failed to reinstall server; ' + e);
    }
  };

  private onCommand = async (): Promise<void> => {
    this.commandSubmitted = true;

    if (this.commandForm.invalid) {
      return;
    }

    if (this.serverSocket.statusSource.value !== ServerStatus.RUNNING) {
      return;
    }

    this.commandLoading = true;

    try {
      await this.serverActions.submitCommand(this.commandForm.controls.command.value);
    } catch (e) {
      console.error(e);
      this.notify.notify('error', 'Failed to reinstall server; ' + e);
    }

    this.commandForm.controls.command.setValue('');
    this.commandLoading = false;
  };

}
