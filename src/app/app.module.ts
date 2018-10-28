import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

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

@NgModule({
  declarations: [
    AppComponent,
    NotfoundComponent,
    HomeComponent,
    NavbarComponent,
    LoginComponent,
    RegisterComponent,
    LogoutComponent,
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
  providers: [AuthenticationService, APIInterceptor],
  bootstrap: [AppComponent]
})
export class AppModule { }
