import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigStorageService} from './config-storage.service';
import {Token} from '@angular/compiler';
import {PresetDetails} from '../models/preset.modal';
import {Server} from '../models/server.model';

export interface UserTokenDetails {
  username: string;
  email: string;
  exp: number;
  iat: number
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
  group: string;
}

export interface TokenPayload {
  password: string;
  email: string;
  username?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  get user(): UserDetails {
    if (!this._user) {
      this._user = JSON.parse(localStorage.getItem('session'));
    }
    return;
  }

  set user(value: UserDetails) {
    this._user = value;
  }

  private _user: UserDetails;

  constructor(
    private http: HttpClient,
    private config: ConfigStorageService
  ) {
  };

  public authorize = async (token: TokenPayload): Promise<UserDetails> => {
    this.user = (await this.http.post<any>(
      this.config.config.endpoints.api + 'auth/login',
      token).toPromise()).user;
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

  public get authOptions() {
    if (!this.user || !this.user.token) {
      return {};
    }
    return {headers: {Authorization: 'Token ' + this.user.token}};
  }

  // ---------------*
  public register = async (newUser: TokenPayload): Promise<UserDetails> => {
    return (await this.http.post<any>(
      this.config.config.endpoints.api + 'auth/register',
      JSON.stringify(newUser)
    ).toPromise()).user;
  };

  public changePassoword = async (existingPassword: string, newPassword: string): Promise<void> => {
    return (await this.http.post<any>(
      this.config.config.endpoints.api + 'auth/changePassword',
      {
        newPassword,
        existingPassword
      },
      this.authOptions
    ).toPromise());
  };

  public getPresets = async (): Promise<PresetDetails[]> => {
    return (await this.http.get<any>(
      this.config.config.endpoints.api + 'profile/getPresets',
      this.authOptions
    ).toPromise()).presets;
  };

  public createServer = async (newServer: ServerPayload): Promise<Server> => {
    return (await this.http.post<any>(
      this.config.config.endpoints.api + 'server/create',
      newServer,
      this.authOptions
    ).toPromise()).server;
  };

  public getUserProfile = async (): Promise<any> => {
    return (await this.http.get<any>(
      this.config.config.endpoints.api + 'profile',
      this.authOptions
    ).toPromise()).user;
  };

}
