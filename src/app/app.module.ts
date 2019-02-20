import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, Injector, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './controllers/app.component';
import {NotfoundComponent} from './controllers/main/notfound/notfound.component';
import {HomeComponent} from './controllers/main/home/home.component';
import {NavbarComponent} from './controllers/main/navbar/navbar.component';
import {LoginComponent} from './controllers/main/login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RegisterComponent} from './controllers/main/register/register.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {LogoutComponent} from './controllers/main/logout/logout.component';
import {APIInterceptor} from './interceptors/apiinterceptor';
import {PanelHomeComponent} from './controllers/panel/panel-home/panel-home.component';
import {PanelCreateComponent} from './controllers/panel/panel-create/panel-create.component';
import {PanelMinecraftPluginsComponent} from './controllers/panel/panel-minecraft-plugins/panel-minecraft-plugins.component';
import {NotifierModule, NotifierOptions, NotifierService} from 'angular-notifier';
import {PanelFrameComponent} from './controllers/panel/panel-frame/panel-frame.component';
import {PanelSettingsComponent} from './controllers/panel/panel-settings/panel-settings.component';
import {PanelPluginsComponent} from './controllers/panel/panel-plugins/panel-plugins.component';
import {PanelSubownersComponent} from './controllers/panel/panel-subowners/panel-subowners.component';
import {RecaptchaModule} from 'ng-recaptcha';
import {RecaptchaFormsModule} from 'ng-recaptcha/forms';
import {ProfileComponent} from './controllers/main/profile/profile.component';
import {ChangePasswordComponent} from './controllers/main/change-password/change-password.component';
import {PanelFilesComponent} from './controllers/panel/panel-files/panel-files.component';
import {PanelFileEditorComponent} from './controllers/panel/panel-file-editor/panel-file-editor.component';
import {ServiceLocator} from './service.injector';
import {AuthService} from './services/auth.service';
import {CurrentServerService} from './services/current-server.service';
import {Router} from '@angular/router';
import {ServerSocketIOService} from './services/server-socket-io.service';
import {SSAnalyticsService} from './services/middleware/ssanalytics.service';
import {AppLoadService} from './services/middleware/app-load.service';

export function init_any(ssAny: SSAnalyticsService) {
  return () => ssAny.onLoad();
}

export function init_servers(appLoad: AppLoadService) {
  return () => appLoad.initializeApp();
}

const customNotifierOptions: NotifierOptions = {
  position: {
    horizontal: {
      position: 'left',
      distance: 12
    },
    vertical: {
      position: 'bottom',
      distance: 12,
      gap: 10
    }
  },
  theme: 'material',
  behaviour: {
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations: {
    enabled: true,
    show: {
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease',
      offset: 50
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

export const services: { [key: string]: { provide: any, deps: any[], useClass?: any } } = {
  'auth': {
    provide: AuthService,
    deps: []
  },
  'currentServer': {
    provide: CurrentServerService,
    deps: []
  },
  'notifier': {
    provide: NotifierService,
    deps: []
  },
  'router': {
    provide: Router,
    deps: []
  },
  'serverSocket': {
    provide: ServerSocketIOService,
    deps: []
  }
};

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
    PanelMinecraftPluginsComponent,
    PanelFrameComponent,
    PanelSettingsComponent,
    PanelPluginsComponent,
    PanelSubownersComponent,
    ProfileComponent,
    ChangePasswordComponent,
    PanelFilesComponent,
    PanelFileEditorComponent,
  ],
  imports: [
    NotifierModule.withConfig(customNotifierOptions),
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RecaptchaModule,
    RecaptchaFormsModule,
    HttpClientModule
  ],
  providers: [AuthService, {
    provide: HTTP_INTERCEPTORS,
    useClass: APIInterceptor,
    multi: true
  }, {
    provide: APP_INITIALIZER,
    useFactory: init_any,
    deps: [SSAnalyticsService],
    multi: true
  }, {provide: APP_INITIALIZER, useFactory: init_servers, deps: [AppLoadService], multi: true}],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    ServiceLocator.injector = Injector.create(
      Object.keys(services).map(key => ({
        provide: services[key].provide,
        useClass: services[key].provide,
        deps: services[key].deps
      }))
    );
  }
}
