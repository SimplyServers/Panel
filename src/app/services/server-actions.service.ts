import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {AuthService} from './auth.service';
import {ConfigStorage} from './config-storage.service';
import {FileDetails} from '../models/server.model';
import {CurrentServerService} from './current-server.service';

@Injectable({
  providedIn: 'root'
})
export class ServerActionsService {

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private currentServer: CurrentServerService
  ) {}

  public submitCommand = async (command: String): Promise<void> => {
    return (await this.http.post<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.currentServer.selectedServer.value.details._id + '/control/command',
      {
        command
      },
      this.auth.authOptions
    ).toPromise());
  };

  public install = async (): Promise<void> => {
    return await this.http.get<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.currentServer.selectedServer.value.details._id + '/control/install',
      this.auth.authOptions
    ).toPromise();
  };

  public reinstall = async (): Promise<void> => {
    return (await this.http.get<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.currentServer.selectedServer.value.details._id + '/control/reinstall',
      this.auth.authOptions
    ).toPromise());
  };

  public killPower = async (): Promise<void> => {
    return (await this.http.get<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.currentServer.selectedServer.value.details._id + '/power/kill',
      this.auth.authOptions
    ).toPromise());
  };

  public startPower = async (): Promise<void> => {
    return (await this.http.get<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.currentServer.selectedServer.value.details._id + '/power/on',
      this.auth.authOptions
    ).toPromise());
  };

  public offPower = async (): Promise<void> => {
    return (await this.http.get<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.currentServer.selectedServer.value.details._id + '/power/off',
      this.auth.authOptions
    ).toPromise());
  };

  public addSubuser = async (email: String): Promise<void> => {
    return (await this.http.post<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.currentServer.selectedServer.value.details._id + '/addSubuser',
      {
        email
      },
      this.auth.authOptions
    ).toPromise());
  };

  public removeSubuser = async (id: String): Promise<void> => {
    return (await this.http.post<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.currentServer.selectedServer.value.details._id + '/removeSubuser',
      {
        id
      },
      this.auth.authOptions
    ).toPromise());
  };

  public changePreset = async (preset: string): Promise<void> => {
    return (await this.http.post<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.currentServer.selectedServer.value.details._id + '/changePreset',
      {
        preset
      },
      this.auth.authOptions
    ).toPromise());
  };

  public listDir = async (path: string): Promise<FileDetails[]> => {
    return (await this.http.post<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.currentServer.selectedServer.value.details._id + '/fs/directory',
      {
        path
      },
      this.auth.authOptions
    ).toPromise()).files;
  };

  public getFileContents = async (path: string): Promise<string> => {
    return (await this.http.post<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.currentServer.selectedServer.value.details._id + '/fs/contents',
      {
        path
      },
      this.auth.authOptions
    ).toPromise()).content;
  };

  public checkAllowed = async (path: string): Promise<boolean> => {
    return (await this.http.post<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.currentServer.selectedServer.value.details._id + '/fs/checkAllowed',
      {
        path
      },
      this.auth.authOptions
    ).toPromise()).allowed;
  };

  public writeContents = async (path: string, contents: string): Promise<void> => {
    return (await this.http.post<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.currentServer.selectedServer.value.details._id + '/fs/checkAllowed',
      {
        path,
        contents
      },
      this.auth.authOptions
    ).toPromise());
  };

  public removeFile = async (path: string): Promise<void> => {
    return (await this.http.post<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.currentServer.selectedServer.value.details._id + '/fs/removeFile',
      {
        path,
      },
      this.auth.authOptions
    ).toPromise());
  };

  public removeFolder = async (path: string): Promise<void> => {
    return (await this.http.post<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.currentServer.selectedServer.value.details._id + '/fs/removeFolder',
      {
        path,
      },
      this.auth.authOptions
    ).toPromise());
  };

  public remove = async (): Promise<void> => {
    return (await this.http.get<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.currentServer.selectedServer.value.details._id + '/fs/remove',
      this.auth.authOptions
    ).toPromise());
  };
  
}
