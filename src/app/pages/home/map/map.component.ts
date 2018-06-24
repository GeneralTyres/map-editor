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
  // Variables for map
  displayedCountries: any[];
  displayStates: any[];
  displayedTerritories: any[];
  date: number;
  featureGroup: any = L.featureGroup();
  infobox: any;
  activeCountry: any;

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
  }

  ngOnInit() {
    this.getData();
    this.loadMap();
  }

  loadMap() {
    // const osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
    // const satiliteUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    const satiliteUrl = 'https://mt0.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
      osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      osm = L.tileLayer(satiliteUrl, {
        maxZoom: 18,
        attribution: osmAttrib
      });

    // initialize the map on the "map" div with a given center and zoom
    this.map = L.map('map').setView([43.1, 1.2], 5).addLayer(osm);

    const entityIcon = new L.DivIcon({
      className: '',
      html: '<img src="../../../../assets/images/emblem.svg" style="margin: auto; display: block">',
      iconSize: [50, 50],
      iconAnchor: [25, 50]
    });

    const marker = L.marker([39.959882, 4.277765],
      {icon: entityIcon}).addTo(this.map);

    this.infobox = new L.Control();

    this.infobox.onAdd = function () {
      this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
      this.update();
      return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    this.infobox.update = function (country) {
      this._div.innerHTML = (country ?
        '<h4>' + country.name + '</h4><img style="height: 70px; width: 100px" src="' + country.flag + '">'
        : 'Hover over a state');
    };
    this.infobox.addTo(this.map);

    const imageUrl = '../../../../assets/images/Map_Battle_of_Stalingrad-vi.svg',
      imageBounds = new L.LatLngBounds([[50.158220, 39.611708], [46.493444, 46.862684]]);
    L.imageOverlay(imageUrl, imageBounds).addTo(this.map);

    const imageUrl2 = '../../../../assets/images/testCar.svg',
      imageBounds2 = new L.LatLngBounds([[51.350012, 4.054811], [49.587958, 7.194893]]);
    L.imageOverlay(imageUrl2, imageBounds2).addTo(this.map);
  }

  eventHandler(event) {
    if (event.keyCode === 13) {
      this.showYear();
    }
  }

  getData() {
    this.countries = this.countryService.getCountries();
    this.states = this.stateService.getStates();
    this.areas = this.areaService.getAreas();
  }

  getCountryAndState(areaId) {
    // self.activeCountry = e.target.country;
    // self.activeState = e.target.state;
  }

  showYear() {
    this.featureGroup.clearLayers();
    const countries = this.countryService.getCountriesByDate(this.date);
    const countryIds = this.baseService.getPropertyValuesFromArray(countries, 'id');
    this.displayedTerritories = this.territoryService.getTerritoriesByCountryIdAndDate(countryIds, this.date);
    const areaIds = this.baseService.getPropertyValuesFromArray(this.displayedTerritories, 'areaId');
    const areas = this.areaService.getAreasByIds(areaIds);
    const polygons = this.leafletService.buildPolygonsFromAreas(areas);
    for (let i = 0; i < polygons.length; i++) {
      polygons[i].on('click', function (e) {
        self.activeCountry = self.mapService.getCountryAndState(e.target.area.id, self.date);
        self.map.fitBounds(e.target.getBounds());
      });
      //   .on('mouseover', function (e) {
      //   self.infobox.update(e.target.country);
      // }).on('mouseout', function (e) {
      //   self.infobox.update();
      // });
    }
    this.featureGroup = L.featureGroup(polygons);
    this.featureGroup.addTo(this.map);
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
