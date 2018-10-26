import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {NotfoundComponent} from "./controllers/notfound/notfound.component";
import {HomeComponent} from "./controllers/home/home.component";
import {LoginComponent} from "./controllers/login/login.component";
import {RegisterComponent} from "./controllers/register/register.component";

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {title: "Home"}
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {title: "Login"}
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {title: "Register"}
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
