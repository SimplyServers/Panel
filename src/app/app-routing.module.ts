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
    data: {title: "Log out"},
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
