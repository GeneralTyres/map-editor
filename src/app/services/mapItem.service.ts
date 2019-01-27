import { Injectable } from '@angular/core';
import {DataService} from './data.service';
import {BaseService} from './base.service';
import {MapItemModel} from '../models/mapItem.model';

@Injectable()
export class MapItemService {

  constructor(private data: DataService,
              private base: BaseService) { }

  mapItems: any;

  loadMapItems() {
    return new Promise((resolve, reject) =>
      this.data.load('mapItems', 0, null).subscribe(
        value => {
          this.mapItems = value;
          resolve();
        }
      ));
  }

  saveMapItem(mapItem) {
    if (mapItem.id) {
      return this.data.update('mapItems', mapItem);
    } else {
      return this.data.create('mapItems', mapItem);
    }
  }

  getMapItems() {
    return this.mapItems.slice();
  }

  getMapItemByMapItemId(mapItemId: number) {
    const mapItems = this.base.getObjectsWhereKeysHaveValues(this.mapItems, {id: mapItemId});
    return mapItems[0];
  }

  getMapItemsByIds(mapItemIds: number[]) {
    return this.base.getObjectsWherePropertyHasValues(this.mapItems, 'id', mapItemIds);
  }

  addMapItem(mapItem) {
    this.mapItems.push(mapItem);
  }

  getMapItemsByDate(date: number) {
    const filteredMapItems = [];
    for (let i = 0; i < this.mapItems.length; i++) {
      if (this.mapItems[i].toDate > date) {
      }
      if (this.mapItems[i].fromDate <= date && this.mapItems[i].toDate > date) {
        filteredMapItems.push(this.mapItems[i]);
      }
    }
    return filteredMapItems;
  }

  deteleMapItem(mapItem: MapItemModel) {
    return this.data.delete('mapItems', mapItem);
  }

}
