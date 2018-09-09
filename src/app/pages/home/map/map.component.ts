import { Component, OnInit } from '@angular/core';
import 'leaflet';
import 'leaflet-editable';
import {HttpClient} from '@angular/common/http';
import {DataService} from '../../../services/data.service';
import {CountryService} from '../../../services/country.service';
import {StateService} from '../../../services/state.service';
import {CountryModel} from '../../../models/country.model';
import {MapService} from '../../../services/map.service';
import {AreaService} from '../../../services/area.service';
import {TerritoryService} from '../../../services/territory.service';
import {BaseService} from '../../../services/base.service';
import {LeafletService} from '../../../services/leaflet.service';
import {Subject} from 'rxjs/index';
import {MapItemModel} from '../../../models/mapItem.model';

let self;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  map: any;
  areas: any;
  states: any;
  countries: CountryModel[];
  displayedTerritories: any[];
  date: number;
  mapItemFeatureGroup: any = L.featureGroup();
  mapPathFeatureGroup: any = L.featureGroup();
  featureGroup: any = L.featureGroup();
  infoBox: any;
  activeCountry: CountryModel;
  activeState: any;
  activeMapItem: MapItemModel;

  constructor(private http: HttpClient,
              private data: DataService,
              private countryService: CountryService,
              private stateService: StateService,
              private mapService: MapService,
              private areaService: AreaService,
              private territoryService: TerritoryService,
              private baseService: BaseService,
              private leafletService: LeafletService) {
    self = this;
    this.mapService.componentMethodCalled$.subscribe(
      (value) => {
        self.activeCountry = null;
        this.activeMapItem = value;
      }
    );
  }

  ngOnInit() {
    this.getData();
    this.loadMap();
    this.date = Math.floor(Math.random() * 2000) + 1;
    this.showYear(this.date);
  }

  loadMap() {
    // const osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
    // const satiliteUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    // const satiliteUrl = 'https://mt0.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    //   osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    //   osm = L.tileLayer(satiliteUrl, {
    //     maxZoom: 18,
    //     attribution: osmAttrib
    //   });
    const terrain = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaXNhd255dSIsImEiOiJBWEh1dUZZIn0.SiiexWxHHESIegSmW8wedQ', {
      attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
      maxZoom: 10,
      id: 'isawnyu.map-knmctlkh',
      accessToken: 'pk.eyJ1IjoiaXNhd255dSIsImEiOiJBWEh1dUZZIn0.SiiexWxHHESIegSmW8wedQ'
    });
    // const roads = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaXNhd255dSIsImEiOiJBWEh1dUZZIn0.SiiexWxHHESIegSmW8wedQ', {
    //   attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    //   maxZoom: 10,
    //   id: 'isawnyu.awmc-roads',
    //   accessToken: 'pk.eyJ1IjoiaXNhd255dSIsImEiOiJBWEh1dUZZIn0.SiiexWxHHESIegSmW8wedQ'
    // });
    // const water = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaXNhd255dSIsImEiOiJBWEh1dUZZIn0.SiiexWxHHESIegSmW8wedQ', {
    //   attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    //   maxZoom: 10,
    //   id: 'isawnyu.awmc-inland-water',
    //   accessToken: 'pk.eyJ1IjoiaXNhd255dSIsImEiOiJBWEh1dUZZIn0.SiiexWxHHESIegSmW8wedQ'
    // });
    // const river = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoiaXNhd255dSIsImEiOiJBWEh1dUZZIn0.SiiexWxHHESIegSmW8wedQ', {
    //   attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    //   maxZoom: 10,
    //   id: 'isawnyu.9e3lerk9',
    //   accessToken: 'pk.eyJ1IjoiaXNhd255dSIsImEiOiJBWEh1dUZZIn0.SiiexWxHHESIegSmW8wedQ'
    // });
    // initialize the map on the "map" div with a given center and zoom
    this.map = L.map('map').setView([43.1, 1.2], 5).addLayer(terrain);
    this.map.on('zoomend', function() {
      self.refreshMapItems();
    });
    // this.map.addLayer(roads);
    // this.map.addLayer(water);
    // this.map.addLayer(river);

    // var baseMaps = {
    //   "roads": roads,
    //   // "water": water,
    //   // "river": river
    // };
    //
    // L.control.layers(baseMaps, []).addTo(this.map);

    const entityIcon = new L.DivIcon({
      className: '',
      html: '<img src="../../../../assets/images/emblem.svg" style="margin: auto; display: block">',
      iconSize: [50, 50],
      iconAnchor: [25, 50]
    });

    // const marker = L.marker([39.959882, 4.277765],
    //   {icon: entityIcon}).addTo(this.map);

    this.infoBox = new L.Control();

    this.infoBox.onAdd = function () {
      this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
      this.update();
      return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    this.infoBox.update = function (country) {
      this._div.innerHTML = (country ?
        '<h4>' + country.name + '</h4><img style="height: 70px; width: 100px" src="' + country.flag + '">'
        : 'Hover over a state');
    };
    // this.infoBox.addTo(this.map);

    // const imageUrl = '../../../../assets/images/Map_Battle_of_Stalingrad-vi.svg',
    //   imageBounds = new L.LatLngBounds([[50.158220, 39.611708], [46.493444, 46.862684]]);
    // L.imageOverlay(imageUrl, imageBounds).addTo(this.map);
  }

  eventHandler(event) {
    if (event.keyCode === 13) {
      this.showYear(this.date);
    }
  }

  getData() {
    this.countries = this.countryService.getCountries();
    this.states = this.stateService.getStates();
    this.areas = this.areaService.getAreas();
  }

  showYear(date) {
    if (this.baseService.isNotEmpty(date)) {
      this.date = Number(date);
    }
    this.featureGroup.clearLayers();
    // Get current countries
    const countries = this.countryService.getCountriesByDate(this.date);
    // Get the ids for later use
    const countryIds = this.baseService.getPropertyValuesFromArray(countries, 'id');
    // Kry al die gebiede
    this.displayedTerritories = this.territoryService.getTerritoriesByCountryIdAndDate(countryIds, this.date);
    const areaIds = this.baseService.getPropertyValuesFromArray(this.displayedTerritories, 'areaId');
    const areas = this.areaService.getAreasByIds(areaIds);
    const polygons = this.leafletService.buildPolygonsFromAreas(areas);
    for (let i = 0; i < polygons.length; i++) {
      polygons[i].on('click', function (e) {
        self.activeMapItem = null;
        self.activeCountry = self.mapService.getCountryForDashboard(e.target.area.id, self.date);
        self.activeState = self.activeCountry.activeState;
        self.map.fitBounds(e.target.getBounds(), {paddingBottomRight: [300, 0]});
      });
      //   .on('mouseover', function (e) {
      //   self.infoBox.update(e.target.country);
      // }).on('mouseout', function (e) {
      //   self.infoBox.update();
      // });
    }
    this.activeCountry = null;
    this.activeMapItem = null;
    this.featureGroup = L.featureGroup(polygons);
    this.featureGroup.addTo(this.map);
    this.refreshMapItems();
    this.refreshMapPaths();
  }

  /**
   * Refreshes all the map items (markers)
   */
  refreshMapItems() {
    // Add die map items
    this.mapItemFeatureGroup.clearLayers();
    this.mapItemFeatureGroup = L.featureGroup(this.mapService.getMapItemLayer(this.date, this.map.getZoom()));
    this.mapItemFeatureGroup.addTo(this.map);
  }

  refreshMapPaths() {
    // Add die map paths
    this.mapPathFeatureGroup.clearLayers();
    this.mapPathFeatureGroup = L.featureGroup(this.mapService.getPathLayer(this.date, this.map.getZoom()));
    this.mapPathFeatureGroup.addTo(this.map);
  }
}
// -----------------------------//
// getAreas (e) {
//   this.data.locate({lat: e.latlng.lat, lng: e.latlng.lng}).subscribe(
//     value => {
//       console.log('value ::', value);
//     }
//   );
// }
// this.map.on('click', function(e) {
//     this.getAreas(e.target);
//   }
// );

// this.data.locate().subscribe(
//   value => {
//     console.log('value ::', value)
//   }
// )
