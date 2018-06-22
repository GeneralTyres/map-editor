import { Injectable } from '@angular/core';
import {DataService} from './data.service';
import {BaseService} from './base.service';

@Injectable()
export class AreaService {

  constructor(private data: DataService,
              private base: BaseService) { }

  areas: any;

  loadAreas () {
    return this.data.load('areas', 0).subscribe(
      value => {
        this.areas = value;
      }
    );
  }

  getAreas() {
    return this.areas.slice();
  }

  getAreaByAreaId(areaId: number) {
    const areas = this.base.getObjectsWhereKeysHaveValues(this.areas, {id: areaId});
    return areas[0];
  }

  getAreasByIds(areaIds: number[]) {
    return this.base.getObjectsWherePropertyHasValues(this.areas, 'id', areaIds);
  }

}
