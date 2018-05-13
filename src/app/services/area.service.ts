import { Injectable } from '@angular/core';
import {DataService} from './data.service';
import {BaseService} from './base.service';

@Injectable()
export class AreaService {

  constructor(private data: DataService,
              private base: BaseService) { }

  areas: any;

  loadAreas () {
    return this.data.load('areas').subscribe(
      value => {
        this.areas = value;
      }
    );
  }

  getAreas() {
    return this.areas.slice();
  }

  getAreaByAreaId(areaId: number) {
    let areas = this.base.getObjectsWhereKeysHaveValues(this.areas, {id: areaId});
    return areas[0];
  }

}
