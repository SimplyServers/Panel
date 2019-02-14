import { Injectable } from '@angular/core';

export interface IConfig {
  endpoints: {
    socket: string;
    api: string;
  }
}

@Injectable({
  providedIn: 'root'
})
export class ConfigStorageService {

  constructor() { }

  public getConfig = (): IConfig => {
    return {
      endpoints: {
        socket: 'http://10.1.1.238:8080/',
        api: 'http://10.1.1.238:8080/api/v1/'
      }
    }
  }

}
