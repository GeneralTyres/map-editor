import { Injectable } from '@angular/core';
import {DataService} from './data.service';
import {BaseService} from './base.service';

@Injectable()
export class MapItemTypeService {

  constructor(private data: DataService,
              private base: BaseService) { }

  mapItemTypes: any;

  loadMapItemTypes() {
    return new Promise((resolve, reject) =>
      this.data.load('mapItemTypes', 0).subscribe(
        value => {
          this.mapItemTypes = value;
          resolve();
        }
      ));
  }

  saveMapItemType(mapItemType) {
    if (mapItemType.id) {
      return this.data.update('mapItemTypes', mapItemType);
    } else {
      return this.data.create('mapItemTypes', mapItemType);
    }
  }

  getMapItemTypes() {
    return this.mapItemTypes.slice();
  }

  getMapItemTypeByMapItemTypeId(mapItemTypeId: number) {
    const mapItemTypes = this.base.getObjectsWhereKeysHaveValues(this.mapItemTypes, {id: mapItemTypeId});
    return mapItemTypes[0];
  }

  getMapItemTypesByIds(mapItemTypeIds: number[]) {
    return this.base.getObjectsWherePropertyHasValues(this.mapItemTypes, 'id', mapItemTypeIds);
  }

  addMapItemType(mapItemType) {
    this.mapItemTypes.push(mapItemType);
  }

  getMapItemTypesByDate(date: number) {
    const filteredMapItemTypes = [];
    for (let i = 0; i < this.mapItemTypes.length; i++) {
      if (this.mapItemTypes[i].fromDate <= date && this.mapItemTypes[i].toDate < date) {
        filteredMapItemTypes.push(this.mapItemTypes[i]);
      }
    }
    return filteredMapItemTypes;
  }

}
