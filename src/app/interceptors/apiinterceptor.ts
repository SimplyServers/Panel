import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {CurrentServerService} from '../services/current-server.service';
import {AuthService} from '../services/auth.service';


@Injectable()
export class APIInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService,
    private currentServer: CurrentServerService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('kms: ' + next);
    return next.handle(request).pipe(catchError(err => {
      if (err.status === 401) {
        // auto logout if 401 response returned from api

        // TODO: remove repeated code

        // remove user from local storage to log user out
        localStorage.removeItem('session');
        this.auth.user = undefined;

        // Make sure we clear the server on logout
        this.currentServer.serverList.next(undefined);
        this.currentServer.updateServer(undefined);
        location.reload(true);
      }

      const error = err.error.msg || err.statusText;
      return throwError(error);
    }));
  }
}
