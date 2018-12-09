import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotfoundComponent } from './controllers/notfound/notfound.component';
import { HomeComponent } from './controllers/home/home.component';
import { NavbarComponent } from './controllers/navbar/navbar.component';
import { LoginComponent } from './controllers/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { RegisterComponent } from './controllers/register/register.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {HttpModule} from "@angular/http";
import {HttpClientModule} from "@angular/common/http";
import { LogoutComponent } from './controllers/logout/logout.component';
import { APIInterceptor } from "./core/apiinterceptor";
import {AuthenticationService} from "./core/services/authentication.service";
import {SSAnalyticsService} from "./core/services/ssanalytics.service";
import { PanelHomeComponent } from './controllers/panel/panel-home/panel-home.component';
import { PanelCreateComponent } from './controllers/panel/panel-create/panel-create.component';
import { PanelSidebarComponent } from './controllers/panel/panel-sidebar/panel-sidebar.component';
import { PanelServerselectorComponent } from './controllers/panel/panel-serverselector/panel-serverselector.component';

export function init_app(onLoad: SSAnalyticsService) {
  return () => onLoad.onLoad();
}

@NgModule({
  declarations: [
    AppComponent,
    NotfoundComponent,
    HomeComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
    PanelHomeComponent,
    PanelCreateComponent,
    PanelSidebarComponent,
    PanelServerselectorComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpModule,
    HttpClientModule
  ],
  providers: [AuthenticationService, APIInterceptor, { provide: APP_INITIALIZER, useFactory: init_app, deps: [SSAnalyticsService], multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
