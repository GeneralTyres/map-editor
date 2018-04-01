import { Injectable } from '@angular/core';
import 'leaflet';
import {DataService} from './data.service';

@Injectable()
export class MapService {

  constructor(private data: DataService) { }

  convertLeafletPolygonToString(polygon: any) {
    const proPolygon = [];
    let polygonString: string;
    polygon = polygon.getLatLngs()[0];
    for (let i = 0; i < polygon.length; i++) {
      proPolygon.push([polygon[i].lat, polygon[i].lng]);
    }
    polygonString = JSON.stringify(proPolygon);
    return polygonString;
  }

  saveArea(area) {
    if (area.id) {
      return this.data.update('areas', area);
    } else {
      return this.data.create('areas', area);
    }
  }

}
