import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  apiEndpoint: string = 'http://10.1.1.238:8080/api/v1/';
  socketEndpoint: string = 'http://10.1.1.238:8080/';
  ver: string = 'rel-1.0';

  getAPIURL(){
    return this.apiEndpoint;
  }
  getVer(){
    return this.ver;
  }

}
