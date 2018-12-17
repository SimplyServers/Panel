import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {interval, Subject} from 'rxjs';
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

  groupAnnounce = false;
  update = false;

  announceEmitter: Subject<any>;
  consoleEmitter: Subject<any>;
  selectedServerEmitter: Subject<any>;

  constructor(public serverSocket: ServerSocketManagerService,
              private selectedServer: SelectedServerService,
              private formBuilder: FormBuilder,
              private auth: AuthenticationService,
              private notify: NotifierService) {
  }

  ngOnInit() {
    if(this.selectedServer.getCurrentServer() !== undefined) {
      this.updateServer();
      this.consoleEmitter = this.serverSocket.consoleEmitter.subscribe(data => {
        if(this.groupAnnounce) {
          this.consoleHistory = this.consoleHistory + '\n\n------------\n\n' + data;
        }else{
          this.consoleHistory = this.consoleHistory + data;
        }
        this.groupAnnounce = false;
        this.scroll();
      });
      this.announceEmitter = this.serverSocket.announceEmitter.subscribe(data => {
        if(!this.groupAnnounce && this.consoleHistory !== ''){
          this.consoleHistory = this.consoleHistory + '\n\n------------\n\n[SS MANAGER] ' + data + "\n";
        }else{
          this.consoleHistory = this.consoleHistory + '\n[SS MANAGER] ' + data;
        }
        this.groupAnnounce = true;
        this.scroll();
      });

      //On server update
      this.selectedServerEmitter = this.selectedServer.serverEmitter.subscribe(() => {
        this.updateServer();
      });
    }

    //Read scroll() todo.
    interval(500).subscribe(() => {
      if(this.update){
        this.update = false;
        this.textAreaElement.nativeElement.scrollTop = this.textAreaElement.nativeElement.scrollHeight + 2;
      }
    })
  }

  scroll() {
    //TODO: this could be better. Basically instead of doing this every time the console is updated, constantly check every .5 seconds to see if there is new text, if there is, scroll down.
    //this.textAreaElement.nativeElement.scrollTop = this.textAreaElement.nativeElement.scrollHeight + 2;
    //console.log(this.textAreaElement.nativeElement.scrollHeight);
    this.update = true;
  }

  ngAfterViewInit() {
    if (this.textAreaElement) {
      this.scroll(); //This is so the console will scroll
    }
  }

  ngOnDestroy() {
    this.serverSocket.cacheConsole(this.consoleHistory);
    if(this.announceEmitter !== undefined)
      this.announceEmitter.unsubscribe();
    if(this.consoleEmitter !== undefined)
      this.consoleEmitter.unsubscribe();
    if(this.selectedServerEmitter !== undefined)
      this.selectedServerEmitter.unsubscribe();
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
      this.notify.notify('error', 'Failed to turn the server on; ' + err);
    });
  }

  serverOff() {
    if (this.serverSocket.lastStatus !== 'Running')
      return;
    this.auth.stopServer(this.currentServer._id).subscribe(() => {

    }, (err) => {
      this.notify.notify('error', 'Failed to turn the server off; ' + err);
    });
  }

  serverKill() {
    if (this.serverSocket.lastStatus !== 'Running' && this.serverSocket.lastStatus !== 'Starting' && this.serverSocket.lastStatus !== 'Stopping')
      return;
    this.auth.killServer(this.currentServer._id).subscribe(() => {

    }, (err) => {
      this.notify.notify('error', 'Failed to kill server; ' + err);
    });
  }

  installServer() {
    if (this.serverSocket.lastStatus !== 'Stopped')
      return;
    this.auth.installServer(this.currentServer._id).subscribe(() => {

    }, (err) => {
      this.notify.notify('error', 'Failed to install server; ' + err);
    });
  }

  reinstallServer() {
    if (this.serverSocket.lastStatus !== 'Stopped')
      return;
    this.auth.reinstallServer(this.currentServer._id).subscribe(() => {

    }, (err) => {
      this.notify.notify('error', 'Failed to reinstall server; ' + err);
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
      this.notify.notify('error', 'Failed to submit command; ' + err);
    });
  }

}
