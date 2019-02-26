import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Token} from '@angular/compiler';
import {PresetDetails} from '../models/preset.modal';
import {Server} from '../models/server.model';
import {ConfigStorage} from './config-storage.service';

export interface UserTokenDetails {
  username: string;
  email: string;
  exp: number;
  iat: number
}

export interface GroupDetails {
  _id: string;
  color: string;
  name: string;
  displayName: string;
  isAdmin: boolean;
  isStaff: boolean;
  presetsAllowed: string[];
}

export interface ServerPayload {
  preset: string;
  motd: string;
  name: string;
  captcha: string;
}

export interface UserDetails {
  token: string;
  email: string;
  username: string;
  mcUUID: string;
  id: string;
  credits: number;
  group: GroupDetails;
}

export interface TokenPayload {
  password: string;
  email: string;
  username?: string;
}

export interface UserProfile {
  _id: string;

  _group?: GroupDetails;
  account_info: {
    username: string;
    email: string;
    primaryName?: string;
    accountVerify: {
      accountVerified?: boolean;
      verifyKey?: string;
    };
  };

  game_info?: {
    minecraft?: {
      uuid?: string;
      username?: string;
      boughtPlugins?: string[];
    };
    steam?: {
      steamID?: string;
      username?: string;
    };
  }

  balance: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private http: HttpClient
  ) {
  };

  private _user: UserDetails;

  get user(): UserDetails {
    if (!this._user) {
      this._user = JSON.parse(localStorage.getItem('session'));
    }
    return this._user;
  }

  set user(value: UserDetails) {
    this._user = value;
    localStorage.setItem('session', JSON.stringify(value));
  }

  public get authOptions() {
    if (!this.user || !this.user.token) {
      return {};
    }
    return {headers: {Authorization: 'Token ' + this.user.token}};
  }

  public authorize = async (token: TokenPayload): Promise<UserDetails> => {
    console.log("authorize here... posting to: " + ConfigStorage.config.endpoints.api + 'auth/login');
    this.user = (await this.http.post<any>(
      ConfigStorage.config.endpoints.api + 'auth/login',
      token).toPromise()).user;
    console.log("got user (" + JSON.stringify(this.user) + ")!");
    return this.user;
  };

  public updateShards = (shards: number) => {
    const user = this.user;
    user.credits = shards;
    localStorage.setItem('session', JSON.stringify(user));
  };

  public checkLoggedIn = (): boolean => {
    const user = this.user;
    if (user) {
      const payload = user.token.split('.')[1];
      const validatedPayload: UserTokenDetails = JSON.parse(window.atob(payload));
      return validatedPayload.exp > Date.now() / 1000;
    } else {
      return false;
    }
  };

  // ---------------*

  public register = async (newUser: TokenPayload): Promise<UserDetails> => {
    return (await this.http.post<any>(
      ConfigStorage.config.endpoints.api + 'auth/register',
      newUser
    ).toPromise()).user;
  };

  public changePassword = async (existingPassword: string, newPassword: string): Promise<void> => {
    return (await this.http.post<any>(
      ConfigStorage.config.endpoints.api + 'auth/changePassword',
      {
        newPassword,
        existingPassword
      },
      this.authOptions
    ).toPromise());
  };

  public getPresets = async (): Promise<PresetDetails[]> => {
    return (await this.http.get<any>(
      ConfigStorage.config.endpoints.api + 'profile/presets',
      this.authOptions
    ).toPromise()).presets;
  };

  public createServer = async (newServer: ServerPayload): Promise<Server> => {
    return (await this.http.post<any>(
      ConfigStorage.config.endpoints.api + 'server/add',
      newServer,
      this.authOptions
    ).toPromise()).server;
  };

  public getUserProfile = async (): Promise<UserProfile> => {
    return (await this.http.get<any>(
      ConfigStorage.config.endpoints.api + 'profile',
      this.authOptions
    ).toPromise()).user;
  };

}
