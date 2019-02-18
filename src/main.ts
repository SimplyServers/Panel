import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';
// Override bug
import {RecaptchaComponent} from 'ng-recaptcha';

console.log('This is a feature intended for web developers. If someone told you to copy-paste something in here for "hacks" or something like that, you are being scammed. https://en.wikipedia.org/wiki/Self-XSS');

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));

RecaptchaComponent.prototype.ngOnDestroy = function () {
  if (this.subscription) {
    this.subscription.unsubscribe();
  }
};
