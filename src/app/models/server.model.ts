import {PresetDetails} from './legacy/preset-details';
import {HttpClient} from '@angular/common/http';
import {AuthService} from '../services/auth.service';
import {ConfigStorage} from '../services/config-storage.service';

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

export interface ServerDetails {
  owner: string;
  sub_owners: object;
  preset: PresetDetails;
  timeOnline?: number;
  motd: string;
  nodeInstalled: string;
  online?: boolean;
  name: string;
  port: number;
  special: {
    minecraftPlugins: object;
  };
  isOwner?: boolean;
  _id: string;
}

export class Server {
  private serverDetails: ServerDetails;

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private storage: ConfigStorage
  ) {
  }

  get details(): ServerDetails {
    return this.serverDetails;
  }

  public listDir = async (path: string): Promise<FileDetails[]> => {
    return (await this.http.post<any>(
      this.storage.config.endpoints.api + 'server/' + this.serverDetails._id + '/fs/directory',
      {
        path
      },
      this.auth.authOptions
    ).toPromise()).files;
  };

  public getFileContents = async (path: string): Promise<string> => {
    return (await this.http.post<any>(
      this.storage.config.endpoints.api + 'server/' + this.serverDetails._id + '/fs/contents',
      {
        path
      },
      this.auth.authOptions
    ).toPromise()).content;
  };

  public checkAllowed = async (path: string): Promise<boolean> => {
    return (await this.http.post<any>(
      this.storage.config.endpoints.api + 'server/' + this.serverDetails._id + '/fs/checkAllowed',
      {
        path
      },
      this.auth.authOptions
    ).toPromise()).allowed;
  };

  public writeContents = async (path: string, contents: string): Promise<void> => {
    return (await this.http.post<any>(
      this.storage.config.endpoints.api + 'server/' + this.serverDetails._id + '/fs/checkAllowed',
      {
        path,
        contents
      },
      this.auth.authOptions
    ).toPromise());
  };

  public removeFile = async (path: string): Promise<void> => {
    return (await this.http.post<any>(
      this.storage.config.endpoints.api + 'server/' + this.serverDetails._id + '/fs/removeFile',
      {
        path,
      },
      this.auth.authOptions
    ).toPromise());
  };

  public removeFolder = async (path: string): Promise<void> => {
    return (await this.http.post<any>(
      this.storage.config.endpoints.api + 'server/' + this.serverDetails._id + '/fs/removeFolder',
      {
        path,
      },
      this.auth.authOptions
    ).toPromise());
  };

  public remove = async (): Promise<void> => {
    return (await this.http.get<any>(
      this.storage.config.endpoints.api + 'server/' + this.serverDetails._id + '/fs/remove',
      this.auth.authOptions
    ).toPromise());
  };

}
