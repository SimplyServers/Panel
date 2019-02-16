import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ConfigStorage} from '../config-storage.service';

@Injectable({
  providedIn: 'root'
})
export class SSAnalyticsService {

  public loadData: any;

  constructor(
    private http: HttpClient,
  ) {}

  onLoad() {
    this.http.get<any>(ConfigStorage.config.endpoints.api + 'analytics/load').subscribe(data => {
      console.log('SSAnalytics loaded.');
      console.log('API build name is: ' + data.codename);
      this.loadData = data;
    });
  }
}
