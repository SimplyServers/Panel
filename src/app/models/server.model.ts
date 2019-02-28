import {HttpClient} from '@angular/common/http';
import {AuthService, UserProfile} from '../services/auth.service';
import {ConfigStorage} from '../services/config-storage.service';
import {PresetDetails} from './preset.modal';
import {Http} from '@angular/http';
import {StaticInjector} from '@angular/core/src/di/injector';
import {ServiceLocator} from '../service.injector';

export interface FileDetails {
  name: string;
  created: string;
  modified: string;
  size: number;
  symlink: boolean;
  isDir: boolean;
  isFile: boolean;
  edible: boolean;
}

export interface MinecraftPlugin {
  _id: string;
  name: string;
  games: any;
  credits: number;
  reloadRequired: boolean;
  description: string;
}

export interface ServerDetails {
  _owner: UserProfile;
  sub_owners: object;
  _preset: PresetDetails;
  timeOnline?: number;
  motd: string;
  _nodeInstalled: string; //TODO: This isn't populated in our case (hopefully!)
  online?: boolean;
  name: string;
  port: number;
  _minecraftPlugins: Array<MinecraftPlugin>
  _id: string;
}

export class Server {
  private serverDetails: ServerDetails;

  private http: HttpClient;
  private auth: AuthService;

  constructor(
    server: ServerDetails
  ) {
    console.log("server instianted")
    this.serverDetails = server;
    console.log("details: " + JSON.stringify(server));
    this.http = ServiceLocator.injector.get(HttpClient);
    this.auth = ServiceLocator.injector.get(AuthService);
  }

  get details(): ServerDetails {
    return this.serverDetails;
  }

  public submitCommand = async (command: String): Promise<void> => {
    return (await this.http.post<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.serverDetails._id + '/control/command',
      {
        command
      },
      this.auth.authOptions
    ).toPromise());
  };

  public install = async (): Promise<void> => {
    return (await this.http.get<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.serverDetails._id + '/control/install',
      this.auth.authOptions
    ).toPromise());
  };

  public reinstall = async (): Promise<void> => {
    return (await this.http.get<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.serverDetails._id + '/control/reinstall',
      this.auth.authOptions
    ).toPromise());
  };

  public killPower = async (): Promise<void> => {
    return (await this.http.get<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.serverDetails._id + '/power/kill',
      this.auth.authOptions
    ).toPromise());
  };

  public startPower = async (): Promise<void> => {
    return (await this.http.get<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.serverDetails._id + '/power/on',
      this.auth.authOptions
    ).toPromise());
  };

  public offPower = async (): Promise<void> => {
    return (await this.http.get<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.serverDetails._id + '/power/off',
      this.auth.authOptions
    ).toPromise());
  };

  public addSubuser = async (email: String): Promise<void> => {
    return (await this.http.post<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.serverDetails._id + '/addSubuser',
      {
        email
      },
      this.auth.authOptions
    ).toPromise());
  };

  public removeSubuser = async (id: String): Promise<void> => {
    return (await this.http.post<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.serverDetails._id + '/removeSubuser',
      {
        id
      },
      this.auth.authOptions
    ).toPromise());
  };

  public changePreset = async (preset: string): Promise<void> => {
    return (await this.http.post<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.serverDetails._id + '/changePreset',
      {
        preset
      },
      this.auth.authOptions
    ).toPromise());
  };

  public listDir = async (path: string): Promise<FileDetails[]> => {
    return (await this.http.post<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.serverDetails._id + '/fs/directory',
      {
        path
      },
      this.auth.authOptions
    ).toPromise()).files;
  };

  public getFileContents = async (path: string): Promise<string> => {
    return (await this.http.post<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.serverDetails._id + '/fs/contents',
      {
        path
      },
      this.auth.authOptions
    ).toPromise()).content;
  };

  public checkAllowed = async (path: string): Promise<boolean> => {
    return (await this.http.post<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.serverDetails._id + '/fs/checkAllowed',
      {
        path
      },
      this.auth.authOptions
    ).toPromise()).allowed;
  };

  public writeContents = async (path: string, contents: string): Promise<void> => {
    return (await this.http.post<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.serverDetails._id + '/fs/checkAllowed',
      {
        path,
        contents
      },
      this.auth.authOptions
    ).toPromise());
  };

  public removeFile = async (path: string): Promise<void> => {
    return (await this.http.post<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.serverDetails._id + '/fs/removeFile',
      {
        path,
      },
      this.auth.authOptions
    ).toPromise());
  };

  public removeFolder = async (path: string): Promise<void> => {
    return (await this.http.post<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.serverDetails._id + '/fs/removeFolder',
      {
        path,
      },
      this.auth.authOptions
    ).toPromise());
  };

  public remove = async (): Promise<void> => {
    return (await this.http.get<any>(
      ConfigStorage.config.endpoints.api + 'server/' + this.serverDetails._id + '/fs/remove',
      this.auth.authOptions
    ).toPromise());
  };

}
