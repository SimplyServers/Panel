import {Component, Injectable, OnDestroy, OnInit} from '@angular/core';
import {ServerSocketManagerService} from '../../../core/services/server-socket-manager.service';
import {SelectedServerService} from '../../../core/services/selected-server.service';

@Injectable({
  providedIn: 'root'
})

@Component({
  selector: 'app-panel-serverselector',
  templateUrl: './panel-serverstatus.component.html',
  styleUrls: ['./panel-serverstatus.component.scss']
})
export class PanelServerstatusComponent implements OnInit {

  status: 'Running' | 'Stopped' | 'Stopping' | 'Crashed' | 'Starting' | 'Loading' = 'Loading';

  constructor(private serverSocket: ServerSocketManagerService, private selectedServer: SelectedServerService) {}

  updateStatus(){
    console.log("using default status: " + this.serverSocket.lastStatus);
    this.status = this.serverSocket.lastStatus;
    this.selectedServer.getCurrentServer(server => {
      console.log("status: ct: " + server);
      this.serverSocket.getSocket(server);
    });
    this.serverSocket.statusEmitter.subscribe(data => {
      console.log("Got new status from event emitter: " + data);
      this.status = data;
    });
  }

  ngOnInit() {
    this.updateStatus();
    this.selectedServer.serverEmitter.subscribe(() => {
      this.updateStatus();
    });
  }
}
