import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class DataService {

  // Word gestoor in die environment.ts file
  env = environment.apiUrl;
  // env = 'http://192.168.1.12:1337';
  // env = 'http://127.0.0.1:1337';

  constructor(private http: HttpClient) { }

  load(tableName, limit, whereClause) {
    let query =
      this.env + '/' + tableName;
    if (whereClause) {
      whereClause = JSON.stringify(whereClause);
      query += '?where=' + whereClause;
    } else {
      query += '?limit=' + (limit ? limit : 1000);
    }
    return this.http.get(query);
  }

  create(tableName, data) {
    delete data.id;
    const query = this.env + '/' + tableName;
    return this.http.post(query, data);
  }

  update(tableName, data) {
    const query = this.env + '/' + tableName + '/' + data.id;
    return this.http.patch(query, data);
  }

  delete(tableName, data) {
    const query = this.env + '/' + tableName + '/' + data.id;
    return this.http.delete(query, data);
  }

  locate(point) {
    const query = this.env + '/locate';
    return this.http.post(query, point);
  }

}
