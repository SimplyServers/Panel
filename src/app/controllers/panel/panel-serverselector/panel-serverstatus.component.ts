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
export class PanelServerstatusComponent implements OnInit, OnDestroy {

  status: 'Running' | 'Stopped' | 'Stopping' | 'Crashed' | 'Starting' | 'Loading' = 'Loading';

  constructor(private serverSocket: ServerSocketManagerService, private selectedServer: SelectedServerService) {
  }

  ngOnDestroy() {
  }

  ngOnInit() {
    this.status = this.serverSocket.lastStatus;
    this.selectedServer.getCurrentServer(server => {
      console.log('got current server');
      this.serverSocket.getSocket(server);
      this.serverSocket.statusEmitter.subscribe(data => {
        console.log("emitted! " + data);
        this.status = data;
      });
    });
  }
}
