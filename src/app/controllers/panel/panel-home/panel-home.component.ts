import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {interval, Subject} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ResponsiveServerPage} from '../../panel-controller.serverpage';
import {ServerStatus} from '../../../services/server-socket-io.service';
import {Server} from '../../../models/server.model';

@Component({
  selector: 'app-panel-home',
  templateUrl: './panel-home.component.html',
  styleUrls: ['./panel-home.component.scss']
})
export class PanelHomeComponent extends ResponsiveServerPage implements AfterViewInit {
  @ViewChild('textAreaElement', {read: ElementRef}) textAreaElement: ElementRef;

  serverDetails: any;

  commandForm: FormGroup;
  commandLoading = false;
  commandSubmitted = false;

  update = false;

  announceEmitter: Subject<any>;
  consoleEmitter: Subject<any>;
  statusEmitter: Subject<any>;

  constructor(private formBuilder: FormBuilder) {
    super();
  }

  onFirstInit = async (): Promise<void> => {
    this.consoleEmitter = this.serverSocket.consoleEmitter.subscribe(data => {
      this.serverSocket.cachedConsole = this.serverSocket.cachedConsole + data;
      this.update = true;
    });
    this.announceEmitter = this.serverSocket.announceEmitter.subscribe(data => {
      this.serverSocket.cachedConsole = this.serverSocket.cachedConsole + '➤ [Manager daemon] ' + data + '\n';
      this.update = true;
    });
    this.statusEmitter = this.serverSocket.statusEmitter.subscribe(data => {
      this.serverSocket.cachedConsole = this.serverSocket.cachedConsole + '➤ [Status update] Status updated to ' + data + '\n';
      this.update = true;
    });

    // Read scroll() todo.
    interval(500).subscribe(() => {
      if (this.update) {
        this.update = false;
        this.textAreaElement.nativeElement.scrollTop = this.textAreaElement.nativeElement.scrollHeight + 2;
      }
    });
  };

  ngAfterViewInit() {
    if (this.textAreaElement) {
      this.update = false; // This is so the console will scroll
    }
  }

  onUnload = async (): Promise<void> => {
    if (this.announceEmitter !== undefined) {
      this.announceEmitter.unsubscribe();
    }
    if (this.consoleEmitter !== undefined) {
      this.consoleEmitter.unsubscribe();
    }
    if (this.statusEmitter !== undefined) {
      this.statusEmitter.unsubscribe();
    }
  };

  loadData = async (): Promise<void> => {
    this.commandForm = this.formBuilder.group({
      command: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
    });
    const server: Server = await this.currentServer.getCurrentServer();
    this.serverDetails = server.details;
  };

  private serverOn = async (): Promise<void> => {
    if (this.serverSocket.serverStatus !== ServerStatus.STOPPED) {
      return;
    }

    const server: Server = await this.currentServer.getCurrentServer();
    try {
      await server.startPower();
    } catch (e) {
      this.notify.notify('error', 'Failed to turn the server on; ' + e);
    }
  };

  private serverOff = async (): Promise<void> => {
    if (this.serverSocket.serverStatus !== ServerStatus.RUNNING) {
      return;
    }

    const server: Server = await this.currentServer.getCurrentServer();
    try {
      await server.offPower();
    } catch (e) {
      this.notify.notify('error', 'Failed to turn the server off; ' + e);
    }
  };

  private serverKill = async (): Promise<void> => {
    if (this.serverSocket.serverStatus !== ServerStatus.RUNNING &&
      this.serverSocket.serverStatus !== ServerStatus.STARTING &&
      this.serverSocket.serverStatus !== ServerStatus.STOPPING) {
      return;
    }

    const server: Server = await this.currentServer.getCurrentServer();
    try {
      await server.killPower();
    } catch (e) {
      this.notify.notify('error', 'Failed to kill the server; ' + e);
    }
  };

  private installServer = async (): Promise<void> => {
    if (this.serverSocket.serverStatus !== ServerStatus.STOPPED) {
      return;
    }

    const server: Server = await this.currentServer.getCurrentServer();
    try {
      await server.install();
    } catch (e) {
      this.notify.notify('error', 'Failed to install server; ' + e);
    }
  };

  private reinstallServer = async (): Promise<void> => {
    if (this.serverSocket.serverStatus !== ServerStatus.STOPPED) {
      return;
    }

    const server: Server = await this.currentServer.getCurrentServer();
    try {
      await server.reinstall();
    } catch (e) {
      this.notify.notify('error', 'Failed to reinstall server; ' + e);
    }
  };

  private onCommand = async (): Promise<void> => {
    this.commandSubmitted = true;

    if (this.commandForm.invalid) {
      return;
    }

    if (this.serverSocket.serverStatus !== ServerStatus.RUNNING) {
      return;
    }

    this.commandLoading = true;

    const server: Server = await this.currentServer.getCurrentServer();
    try {
      await server.submitCommand(this.commandForm.controls.command.value);
    } catch (e) {
      this.notify.notify('error', 'Failed to reinstall server; ' + e);
    }

    this.commandForm.controls.command.setValue('');
    this.commandLoading = false;
  };

}
