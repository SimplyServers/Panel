import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {AuthenticationService} from "./services/authentication.service";
import {SelectedServerService} from './services/selected-server.service';


@Injectable()
export class APIInterceptor implements HttpInterceptor {
  constructor(private auth: AuthenticationService, private selectedServer: SelectedServerService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        // auto logout if 401 response returned from api

        //TODO: remove repeated code

        // remove user from local storage to log user out
        localStorage.removeItem('session');
        this.auth.clearUser();

        //Make sure we clear the server on logout
        this.selectedServer.servers = undefined;
        this.selectedServer.setCurrentServer(undefined, false);
        location.reload(true);
      }

      const error = err.error.msg || err.statusText;
      return throwError(error);
    }))
  }
}
