import {PresetDetails} from './legacy/preset-details';
import {AuthenticationService} from '../services/legacy/authentication.service';

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
 constructor(auth: AuthenticationService) {}

 public getDetails = (): ServerDetails => {
   return this.serverDetails;
 }
}
