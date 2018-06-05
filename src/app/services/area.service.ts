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
        console.log('value ::', value)
        this.areas = value;
      }
    );
  }

  getAreas() {
    return this.areas.slice();
  }

  getAreaByAreaId(areaId: number) {
    console.log('areaId ::', areaId)
    console.log('this.areas ::', this.areas)
    const areas = this.base.getObjectsWhereKeysHaveValues(this.areas, {id: areaId});
    console.log('areas ::', areas)
    return areas[0];
  }

}
