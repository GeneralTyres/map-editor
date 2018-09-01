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
import {MapItemService} from './mapItem.service';
import {MapItemTypeService} from './mapItemType.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Subject} from 'rxjs/index';

let self;

@Injectable()
export class MapService {
  style: any;
  icon = L.icon({
    iconUrl: '../../../../../assets/images/icons/torch.svg',

    iconSize:     [38, 95], // size of the icon
    iconAnchor:   [20, 50], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
  });

  // Observable string sources
  private componentMethodCallSource = new Subject<any>();
  // Observable string streams
  componentMethodCalled$ = this.componentMethodCallSource.asObservable();

  constructor( private areaService: AreaService,
               private baseService: BaseService,
               private countryService: CountryService,
               private data: DataService,
               private stateService: StateService,
               private territoryService: TerritoryService,
               private traitsService: TraitService,
               private mapItemService: MapItemService,
               private mapItemTypeService: MapItemTypeService,
               private modalService: NgbModal) {
    self = this;
  }

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

  getMapItemLayer(date, zoomLevel) {
    const mapItems = this.mapItemService.getMapItemsByDate(date);
    const itemMarkers = [];
    for (let i = 0; i < mapItems.length; i++) {
      if (this.baseService.isNotEmptyOrZero(mapItems[i].latitude) &&
        this.baseService.isNotEmptyOrZero(mapItems[i].longitude)) {
        const mapType = this.mapItemTypeService.getMapItemTypeByMapItemTypeId(mapItems[i].itemType);

        if (mapType.zoomLevel <= zoomLevel) {
          // Create divIcon with item name
          const divIcon = new L.DivIcon({
            className: 'map-item-marker',
            html: '<div class="row map-item-marker"><div class="col-md-3">' +
            '<img class="map-item-icon float-left" src="' + mapType.icon + '"/></div>' +
            '<div class="col-md-8"><p class="map-item-label">' + mapItems[i].name + '</p></div></div>'
          });
          const newLatLng = new L.LatLng(mapItems[i].latitude, mapItems[i].longitude);
          const marker: any = L.marker(newLatLng, {icon: divIcon});
          marker.mapItem = mapItems[i];
          marker.on('click', this.openMapItemModal);
          itemMarkers.push(marker);
        }
      }
    }
    return itemMarkers;
  }

  openMapItemModal(e) {
    self.componentMethodCallSource.next(e.target.mapItem);
    // self.parentScope.ge;
    // const mapItem = e.target.mapItem;
    // const modalRef = self.modalService.open(MapItemModalComponent, { size: 'lg', beforeDismiss: () => false });
    // modalRef.componentInstance.activeMapItem = mapItem;
    // modalRef.result.then(value => {
    //   // Doen iets na modal toe is
    // });
  }

  getCountryLayer(date: number) {
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
