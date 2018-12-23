import {PresetDetails} from './preset-details';

export interface ServerPayload {
  preset: string,
  motd: string,
  name: string,
  captcha: string
}
