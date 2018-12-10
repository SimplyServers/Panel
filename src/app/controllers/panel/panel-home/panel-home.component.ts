import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Subject} from 'rxjs';
import {ServerSocketManagerService} from '../../../core/services/server-socket-manager.service';
import {SelectedServerService} from '../../../core/services/selected-server.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../../core/services/authentication.service';
import {NotifierService} from 'angular-notifier';
import {ServerDetails} from '../../../core/models/server-details';

@Component({
  selector: 'app-panel-home',
  templateUrl: './panel-home.component.html',
  styleUrls: ['./panel-home.component.scss']
})
export class PanelHomeComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('textAreaElement', {read: ElementRef}) textAreaElement: ElementRef;

  currentServer: ServerDetails;
  consoleHistory = '';
  loading = true;

  commandForm: FormGroup;
  commandLoading = false;
  commandSubmitted = false;

  constructor(private serverSocket: ServerSocketManagerService,
              private selectedServer: SelectedServerService,
              private formBuilder: FormBuilder,
              private auth: AuthenticationService,
              private notify: NotifierService) {
  }

  ngOnInit() {
    if(this.selectedServer.getCurrentServer() !== undefined) {
      this.updateServer();
      this.serverSocket.consoleEmitter.subscribe(data => {
        this.consoleHistory = this.consoleHistory + data;
        this.scroll();
      });
      this.serverSocket.announceEmitter.subscribe(data => {
        this.consoleHistory = this.consoleHistory + '\n**\n[SS MANAGER] ' + data + '\n**\n';
        this.scroll();
      });

      //On server update
      this.selectedServer.serverEmitter.subscribe(() => {
        this.serverSocket.cacheConsole('');
        this.updateServer();
      });
    }
  }

  scroll() {
    this.textAreaElement.nativeElement.scrollTop = this.textAreaElement.nativeElement.scrollHeight + 2;
  }

  ngAfterViewInit() {
    if (this.textAreaElement) {
      this.scroll(); //This is so the console will scroll
    }
  }

  ngOnDestroy() {
    this.serverSocket.cacheConsole(this.consoleHistory);
  }

  updateServer() {
    this.currentServer = this.selectedServer.getCurrentServer();
    this.serverSocket.getSocket(this.currentServer._id, () => {
      this.loading = false;
    });

    this.consoleHistory = this.serverSocket.getConsole();

    this.commandForm = this.formBuilder.group({
      command: ['', Validators.compose([Validators.required, Validators.maxLength(50)])],
    });
  }

  serverOn() {
    if (this.serverSocket.lastStatus !== 'Stopped')
      return;
    this.auth.startServer(this.currentServer._id).subscribe(() => {

    }, (err) => {
      this.notify.notify('error', 'Failed to turn the server on; ' + err.error.msg);
    });
  }

  serverOff() {
    if (this.serverSocket.lastStatus !== 'Running')
      return;
    this.auth.stopServer(this.currentServer._id).subscribe(() => {

    }, (err) => {
      this.notify.notify('error', 'Failed to turn the server off; ' + err.error.msg);
    });
  }

  serverKill() {
    if (this.serverSocket.lastStatus !== 'Running' && this.serverSocket.lastStatus !== 'Starting' && this.serverSocket.lastStatus !== 'Stopping')
      return;
    this.auth.killServer(this.currentServer._id).subscribe(() => {

    }, (err) => {
      this.notify.notify('error', 'Failed to kill server; ' + err.error.msg);
    });
  }

  onCommand() {
    this.commandSubmitted = true;
    if (this.commandForm.invalid) {
      return;
    }
    if (this.serverSocket.lastStatus !== 'Running') {
      return;
    }
    this.commandLoading = true;

    this.auth.submitCommand(this.currentServer._id, this.commandForm.controls.command.value).subscribe(() => {
      this.commandForm.controls.command.setValue('');
      this.commandLoading = false;
      this.commandSubmitted = false;
    }, (err) => {
      this.commandLoading = false;
      this.commandSubmitted = false;
      this.notify.notify('error', 'Failed to submit command; ' + err.error.msg);
    });
  }

}
