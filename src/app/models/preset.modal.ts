export interface PresetDetails {
  name: string;
  game: string;
  autoShutdown: boolean;
  maxPlayers: number;
  build: {
    mem: number,
    io: number,
    cpu: number
  };
  special?: {
    fs?: object,
    views?: object
  };
  preinstalledPlugins: object;
  allowSwitchingTo: Array<PresetDetails>;
  creditsPerDay: number;
  maxPlugins: number;
  _id: string;
}
