import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  apiEndpoint: string = 'http://127.0.0.1:8080/api/v1/';
  ver: string = 'rel-1.0';

  getAPIURL(){
    return this.apiEndpoint;
  }
  getVer(){
    return this.ver;
  }

}
