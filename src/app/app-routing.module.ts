import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NotfoundComponent} from "./controllers/notfound/notfound.component";
import {HomeComponent} from "./controllers/home/home.component";
import {LoginComponent} from "./controllers/login/login.component";
import {RegisterComponent} from "./controllers/register/register.component";
import {DeauthGuardService} from "./core/services/deauth-guard.service";
import {AuthGuardService} from "./core/services/auth-guard.service";
import {LogoutComponent} from "./controllers/logout/logout.component";
import {PanelHomeComponent} from "./controllers/panel/panel-home/panel-home.component";
import {PanelCreateComponent} from './controllers/panel/panel-create/panel-create.component';
import {PanelMinecraftPluginsComponent} from './controllers/panel/panel-minecraft-plugins/panel-minecraft-plugins.component';
import {PanelPluginsComponent} from './controllers/panel/panel-plugins/panel-plugins.component';
import {PanelSubownersComponent} from './controllers/panel/panel-subowners/panel-subowners.component';
import {PanelSettingsComponent} from './controllers/panel/panel-settings/panel-settings.component';
import {ProfileComponent} from './controllers/profile/profile.component';
import {ChangePasswordComponent} from './controllers/change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {title: "Home"}
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {title: "Login"},
    canActivate: [DeauthGuardService]
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {title: "Register"},
    canActivate: [DeauthGuardService]
  },
  {
    path: 'logout',
    component: LogoutComponent,
    data: {title: 'Logout'},
    canActivate: [AuthGuardService]
  },
  {
    path: 'account',
    component: ProfileComponent,
    data: {title: 'My Account'},
    canActivate: [AuthGuardService]
  },
  {
    path: 'password/change',
    component: ChangePasswordComponent,
    data: {title: 'Change Password'},
    canActivate: [AuthGuardService]
  },
  {
    path: 'panel',
    component: PanelHomeComponent,
    data: {title: "Your Servers"},
    canActivate: [AuthGuardService]
  },
  {
    path: 'panel/create',
    component: PanelCreateComponent,
    data: {title: "Create Server"},
    canActivate: [AuthGuardService]
  },
  {
    path: 'panel/minecraft/plugins',
    component: PanelMinecraftPluginsComponent,
    data: {title: "Browse plugins"},
    canActivate: [AuthGuardService]
  },
  {
    path: 'panel/plugins',
    component: PanelPluginsComponent,
    data: {title: "Browse plugins"},
    canActivate: [AuthGuardService]
  },
  {
    path: 'panel/subusers',
    component: PanelSubownersComponent,
    data: {title: "Server Sub-users"},
    canActivate: [AuthGuardService]
  },
  {
    path: 'panel/settings',
    component: PanelSettingsComponent,
    data: {title: "Server Settings"},
    canActivate: [AuthGuardService]
  },
  {
    path: '**',
    component: NotfoundComponent,
    data: {title: "Route not found"}
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
