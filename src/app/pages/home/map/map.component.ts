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
import {LoaderService} from '../../../services/loader.service';

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
  date: string;
  featureGroup: any = L.featureGroup();
  infobox: any;
  activeCountry = {
    name: '',
    description: '',
    flag: ''
  };

  constructor(private http: HttpClient,
              private data: DataService,
              private countryService: CountryService,
              private stateService: StateService,
              private mapService: MapService,
              private areaService: AreaService,
              private loaderService: LoaderService) {
    self = this;
  }

  ngOnInit() {
    this.loadData();
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

    this.infobox = new L.Control();

    this.infobox.onAdd = function () {
      this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
      this.update();
      return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    this.infobox.update = function (country) {
      this._div.innerHTML = '<h4>US Population Density</h4>' +  (country ?
        '<img style="height: 70px; width: 100px" src="' + country.flag + '">'
        : 'Hover over a state');
    };
    this.infobox.addTo(this.map);
  }

  loadData () {
    this.loaderService.loadAll().then(
      () => {
        this.getData();
      }
    );
  }

  getData() {
    this.countries = this.countryService.getCountries();
    this.states = this.stateService.getStates();
    this.areas = this.areaService.getAreas();
  }

  showStatesByDate() {
    this.featureGroup.clearLayers();
    const stateAreas = this.stateService.getStatesByCountryAndDate(this.countries, this.date, this.areas);
    const polygons = this.mapService.buildMainMapPolygons(stateAreas, this.states, this.countries);
    for (let i = 0; i < polygons.length; i++) {
      polygons[i].on('click', function (e) {
        self.activeCountry = e.target.country;
        self.map.fitBounds(e.target.getBounds());
      }).on('mouseover', function (e) {
        self.infobox.update(e.target.country);
      }).on('mouseout', function (e) {
        self.infobox.update();
      });
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
