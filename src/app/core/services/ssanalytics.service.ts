import { Injectable } from '@angular/core';
import {ConfigService} from "../../config.service";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SSAnalyticsService {

  public loadData: string;

  constructor(private http: HttpClient, private config: ConfigService) {}

  onLoad(){
    this.http.get<any>(this.config.getAPIURL() + "analytics/load").subscribe(data => {
      console.log("SSAnalytics loaded.");
      console.log("API build name is: " + data.codename);
      this.loadData = data;
    })
  }
}
