import {PresetDetails} from './preset-details';

export interface ServerDetails {
  owner: string,
  sub_owners: object,
  preset: PresetDetails,
  timeOnline?: number,
  motd: string,
  nodeInstalled: string,
  online?: boolean,
  name: string,
  port: number,
  special: {
    minecraftPlugins: object
  }
  isOwner?: boolean
  _id: string
}
