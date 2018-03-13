import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class DataService {

  env: string = 'http://192.168.0.109:1337';

  constructor(private http: HttpClient) { }

  load(tableName) {
    const query = this.env + '/' + tableName;
    return this.http.get(query);
  }

  create(tableName, data) {
    const query = this.env + '/' + tableName;
    return this.http.post(query, data);
  }

}
