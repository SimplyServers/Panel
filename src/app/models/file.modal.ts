export interface FileModal {
  name: string;
  created: string;
  modified: string;
  size: number;
  symlink: boolean;
  isDir: boolean;
  isFile: boolean;
  edible: boolean;
}
