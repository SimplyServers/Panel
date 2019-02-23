import {Injectable} from '@angular/core';
import {CurrentServerService} from '../current-server.service';
import {AuthService} from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppLoadService {

  constructor(
    private currentServer: CurrentServerService,
    private auth: AuthService
  ) {
  }

  public initializeApp = async (): Promise<any> => {
    if (this.auth.checkLoggedIn()) {
      await this.currentServer.updateCache(true);
    }
  };
}
