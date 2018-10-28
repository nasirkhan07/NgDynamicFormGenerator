import { Injectable } from '@angular/core';
import {Http} from '@angular/http'
@Injectable()
export class SharedService {

  constructor(private http:Http) { }
  public httpGet(uri) {
        return this.http.get(uri);
    };

    public httpPost(uri, data) {
        return this.http.post(uri, data);
    }

}
