import {HttpClient} from '@angular/common/http';
import {AuthService, UserProfile} from '../services/auth.service';
import {PresetDetails} from './preset.modal';

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
  _nodeInstalled: string; // TODO: This isn't populated in our case (hopefully!)
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
    console.log('server instianted')
    this.serverDetails = server;
    console.log('details: ' + JSON.stringify(server));
  }

  get details(): ServerDetails {
    return this.serverDetails;
  }
}
