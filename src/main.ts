import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

console.log(`%c                                    ________________________________________
                                  Want to help change the way game servers work?
                                       < https://simplyservers.io/apply >
                                    ________________________________________
                     .__               .__                                                           .__        
                _____|__| _____ ______ |  | ___.__. ______ ______________  __ ___________  ______    |__| ____  
               /  ___/  |/     \\\\____ \\|  |<   |  |/  ___// __ \\_  __ \\  \\/ // __ \\_  __ \\/  ___/    |  |/  _ \\ 
               \\___ \\|  |  Y Y  \\  |_> >  |_\\___  |\\___ \\\\  ___/|  | \\/\\   /\\  ___/|  | \\/\\___ \\     |  (  <_> )
              /____  >__|__|_|  /   __/|____/ ____/____  >\\___  >__|    \\_/  \\___  >__|  /____  > /\\ |__|\\____/ 
                   \\/         \\/|__|        \\/         \\/     \\/                 \\/           \\/  \\/            
                
                
                `, "font-family:monospace");
console.log("This is a feature intended for web developers. If someone told you to copy-paste something in here for \"hacks\" or something like that, you are being scammed. https://en.wikipedia.org/wiki/Self-XSS");

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
