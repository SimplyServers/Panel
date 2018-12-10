import { Injectable } from '@angular/core';
import {SelectedServerService} from './selected-server.service';
import {AuthenticationService} from './authentication.service';

@Injectable({
  providedIn: 'root'
})
export class AppLoadService {

  constructor(private selectedServer: SelectedServerService, private auth: AuthenticationService) { }

  initializeApp(): Promise<any> {
    return new Promise((resolve, reject) => {
      if(this.auth.isLoggedIn()) {
        this.selectedServer.updateCache((err) => {
          if (err) reject(err);
          else resolve();
        })
      }else{
        resolve();
      }
    });
  }
}
