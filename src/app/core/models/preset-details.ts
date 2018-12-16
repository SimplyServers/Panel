export interface PresetDetails {
  name: string,
  game: string,
  autoShutdown: boolean,
  maxPlayers: number,
  build: {
    mem: number,
    io: number,
    cpu: number
  },
  special?: {
    fs?: object,
    views?: object
  },
  preinstalledPlugins: object,
  allowSwitchingTo: object,
  creditsPerDay: number,
  maxPlugins: number
  _id: string
}
