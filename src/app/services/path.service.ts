import { Injectable } from '@angular/core';
import {DataService} from './data.service';
import {BaseService} from './base.service';
import {MapItemModel} from '../models/mapItem.model';

@Injectable()
export class PathService {

  constructor(private data: DataService,
              private base: BaseService) { }

  paths: any;

  loadPaths() {
    return new Promise((resolve, reject) =>
      this.data.load('paths', 0, null).subscribe(
        value => {
          this.paths = value;
          resolve();
        }
      ));
  }

  savePath(path) {
    if (path.id) {
      return this.data.update('paths', path);
    } else {
      return this.data.create('paths', path);
    }
  }

  getPaths() {
    return this.paths.slice();
  }

  getPathByPathId(pathId: number) {
    const paths = this.base.getObjectsWhereKeysHaveValues(this.paths, {id: pathId});
    return paths[0];
  }

  getPathsByIds(pathIds: number[]) {
    return this.base.getObjectsWherePropertyHasValues(this.paths, 'id', pathIds);
  }

  addPath(path) {
    this.paths.push(path);
  }

  getPathsByDate(date: number) {
    const filteredPaths = [];
    for (let i = 0; i < this.paths.length; i++) {
      if (this.paths[i].toDate > date) {
      }
      if (this.paths[i].fromDate <= date && this.paths[i].toDate > date) {
        filteredPaths.push(this.paths[i]);
      }
    }
    return filteredPaths;
  }

  detelePath(path) {
    return this.data.delete('paths', path);
  }

}
