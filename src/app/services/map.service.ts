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

  buildMainMapPolygons(areas, states, countries) {
    const polygons = [];
    for (let i = 0; i < areas.length; i++) {
      for (let s = 0; s < states.length; s++) {
        if (areas[i].id === states[s].areaId) {
          for (let c = 0; c < countries.length; c++) {
            if (countries[c].id === states[s].countryId) {
              const polygon = L.polygon(JSON.parse(areas[i].polygon), {color: areas[i].colour});
              // class FatPolygon {
              //   constructor(public leafletPolygon: any, public country: any)
              //   {}
              // }
              // const statePolygon = new FatPolygon(polygon, countries[c]);
              polygon.country = countries[c];
              polygons.push(polygon);
            }
          }
        }
      }
    }
    return polygons;
  }

  saveArea(area) {
    if (area.id) {
      return this.data.update('areas', area);
    } else {
      return this.data.create('areas', area);
    }
  }

}
