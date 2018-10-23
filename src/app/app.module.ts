import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NotfoundComponent } from './controllers/notfound/notfound.component';
import { HomeComponent } from './controllers/home/home.component';
import { NavbarComponent } from './controllers/navbar/navbar.component';
import { LoginComponent } from './controllers/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    NotfoundComponent,
    HomeComponent,
    NavbarComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
