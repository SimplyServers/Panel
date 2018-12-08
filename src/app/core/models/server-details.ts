export interface ServerDetails {
  owner?: string,
  sub_owners?: object,
  preset: string,
  timeOnline?: number,
  motd: string,
  nodeInstalled?: string,
  online?: boolean,
  name: string,
  port?: number,
  special?: {
    minecraftPlugins?: object
  }
}
