import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

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
import {AuthenticationService} from './services/legacy/authentication.service';
import {SSAnalyticsService} from './services/legacy/ssanalytics.service';
import {PanelHomeComponent} from './controllers/legacy/panel/panel-home/panel-home.component';
import {PanelCreateComponent} from './controllers/legacy/panel/panel-create/panel-create.component';
import {PanelMinecraftPluginsComponent} from './controllers/legacy/panel/panel-minecraft-plugins/panel-minecraft-plugins.component';
import {NotifierModule, NotifierOptions} from 'angular-notifier';
import {PanelFrameComponent} from './controllers/legacy/panel/panel-frame/panel-frame.component';
import {AppLoadService} from './services/legacy/app-load.service';
import {PanelSettingsComponent} from './controllers/legacy/panel/panel-settings/panel-settings.component';
import {PanelPluginsComponent} from './controllers/legacy/panel/panel-plugins/panel-plugins.component';
import {PanelSubownersComponent} from './controllers/legacy/panel/panel-subowners/panel-subowners.component';
import {RecaptchaModule} from 'ng-recaptcha';
import {RecaptchaFormsModule} from 'ng-recaptcha/forms';
import {ProfileComponent} from './controllers/main/profile/profile.component';
import {ChangePasswordComponent} from './controllers/main/change-password/change-password.component';
import {PanelFilesComponent} from './controllers/legacy/panel/panel-files/panel-files.component';
import {PanelFileEditorComponent} from './controllers/legacy/panel/panel-file-editor/panel-file-editor.component';

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
  providers: [AuthenticationService, {
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
}
