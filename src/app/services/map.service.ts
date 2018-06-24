import { Injectable } from '@angular/core';
import 'leaflet';
import {DataService} from './data.service';
import {BaseService} from './base.service';
import {AreaService} from './area.service';
import {CountryService} from './country.service';
import {TerritoryService} from './territory.service';
import {StateService} from './state.service';

@Injectable()
export class MapService {
  style: any;

  constructor( private areaService: AreaService,
               private baseService: BaseService,
               private countryService: CountryService,
               private data: DataService,
               private stateService: StateService,
               private territoryService: TerritoryService) { }

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

  highlightFeature(e) {
    const layer = e.target;
    this.style = { ...layer.options };

    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.5
    });
  }

  resetFeature(e) {
    const layer = e.target;

    layer.setStyle({
      weight: this.style.weight,
      color: this.style.color,
      dashArray: this.style.dashArray,
      fillOpacity: this.style.fillOpacity
    });
  }

  getCountryAndState(areaId, date) {
    const activeTerritory = this.territoryService.getTerritoryByAreaId(areaId);
    let activeCountry = this.countryService.getCountryById(activeTerritory.countryId);
    activeCountry = this.stateService.getStatesByCountryAndDate([activeCountry], date);
    activeCountry = activeCountry[0];
    activeCountry.territory = activeTerritory;
    return activeCountry;
  }

  getAreasForMap(date: number) {
    // Get current countries
    const currentCountries = this.countryService.getCountriesByDate(date);
    // Kry land ids
    const landIds = this.baseService.getPropertyValuesFromArray(currentCountries, 'id');
    // Kry die gebiede
    const landGebiede = this.territoryService.getTerritoriesByCountryIdAndDate(landIds, date);
    // Kry die areaIds vir die gebiede
    const gebiedAreaIds = this.baseService.getPropertyValuesFromArray(landGebiede, 'areaId');
    // Kry die areas vir die gebiede
    return this.areaService.getAreasByIds(gebiedAreaIds);
  }

  buildAreaPolygonsWithObjectAttached(objects) {
    for (let i = 0; i < objects.length; i++) {
      const area = this.areaService.getAreaByAreaId(objects[i].areaId);
      const polygon: any = L.polygon(JSON.parse(area.polygon),
        {fillColor: area.colour,
          weight: 2,
          opacity: 0.6,
          color: 'white',
          dashArray: '3',
          fillOpacity: 0.2
        }).on({
        mouseover: this.highlightFeature,
        mouseout: this.resetFeature
      });
    }
  }

  saveArea(area) {
    if (area.id) {
      return this.data.update('areas', area);
    } else {
      return this.data.create('areas', area);
    }
  }

}
