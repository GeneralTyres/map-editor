import { Injectable } from '@angular/core';
import {DataService} from './data.service';
import {BaseService} from './base.service';

@Injectable()
export class PathTypeService {

  constructor(private data: DataService,
              private base: BaseService) { }

  pathTypes: any;

  loadPathTypes() {
    return new Promise((resolve, reject) =>
      this.data.load('pathTypes', 0, null).subscribe(
        value => {
          this.pathTypes = value;
          resolve();
        }
      ));
  }

  savePathType(pathType) {
    if (pathType.id) {
      return this.data.update('pathTypes', pathType);
    } else {
      return this.data.create('pathTypes', pathType);
    }
  }

  getPathTypes() {
    return this.pathTypes.slice();
  }

  getPathTypeByPathTypeId(pathTypeId: number) {
    const pathTypes = this.base.getObjectsWhereKeysHaveValues(this.pathTypes, {id: pathTypeId});
    return pathTypes[0];
  }

  getPathTypesByIds(pathTypeIds: number[]) {
    return this.base.getObjectsWherePropertyHasValues(this.pathTypes, 'id', pathTypeIds);
  }

  addPathType(pathType) {
    this.pathTypes.push(pathType);
  }

  getPathTypesByDate(date: number) {
    const filteredPathTypes = [];
    for (let i = 0; i < this.pathTypes.length; i++) {
      if (this.pathTypes[i].fromDate <= date && this.pathTypes[i].toDate < date) {
        filteredPathTypes.push(this.pathTypes[i]);
      }
    }
    return filteredPathTypes;
  }

}
