import { Injectable } from '@angular/core';
import 'leaflet';
import {DataService} from './data.service';
import {BaseService} from './base.service';
import {AreaService} from './area.service';
import {CountryService} from './country.service';
import {TerritoryService} from './territory.service';
import {StateService} from './state.service';
import {TraitService} from './trait.service';
import {isString} from 'util';

@Injectable()
export class MapService {
  style: any;

  constructor( private areaService: AreaService,
               private baseService: BaseService,
               private countryService: CountryService,
               private data: DataService,
               private stateService: StateService,
               private territoryService: TerritoryService,
               private traitsService: TraitService) { }

  convertLeafletPolygonToString(polygon: any) {
    // Polygon wat ge-save gaan word
    const proPolygon = [];
    // Stringified polygon wat ge-save word
    let polygonString: string;
    polygon = polygon.getLatLngs();
    // Kyk of dit 'n multi polygon is
    if (polygon.length > 1) {
      // Gaan deur alle polygons
      for (let i = 0; i < polygon.length; i++) {
        if (polygon[i][0].length > 3) {
          proPolygon.push([[]]);
          // Gaan deur alle punte van polygon
          for (let s = 0; s < polygon[i][0].length; s++) {
            proPolygon[i][0].push([polygon[i][0][s].lat, polygon[i][0][s].lng]);
          }
        } else {
          polygon.splice(i, 1);
          i--;
        }
      }
    } else {
      // Gaan deur alle punte van polygon
      for (let s = 0; s < polygon[0].length; s++) {
        proPolygon.push([polygon[0][s].lat, polygon[0][s].lng]);
      }
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

  getCountryForDashboard(areaId, date) {
    const activeTerritory = this.territoryService.getTerritoryByAreaId(areaId);
    const activeCountry = this.countryService.getCountryById(activeTerritory.countryId);
    activeCountry.activeState = this.stateService.getStateByCountryIdAndDate(activeCountry.id, date);
    console.log('activeCountry.activeState ::', activeCountry.activeState)
    // Check of iets gesave is voor json.parse en check of dit nie al klaar geparse is nie
    if (this.baseService.isNotEmpty(activeCountry.activeState)) {
      if (activeCountry.activeState.traits.length > 0 &&
        isString(activeCountry.activeState.traits)) {
        activeCountry.activeState.traits = JSON.parse(activeCountry.activeState.traits);
        activeCountry.activeState.traits = this.traitsService.getTraitsByIds(activeCountry.activeState.traits);
      } else if (isString(activeCountry.activeState.traits)) {
        // As dit nog 'n string is dan is dit nog nie geparse nie
        activeCountry.activeState.traits = [];
      }
    }
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

}
