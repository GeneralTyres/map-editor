import { Component, OnInit, AfterContentInit } from '@angular/core';
import 'leaflet';
import 'leaflet-editable';
import {HttpClient} from '@angular/common/http';
import {DataService} from '../services/data.service';
import {CountryService} from '../services/country.service';
import {StateService} from '../services/state.service';
import {CountryModel} from '../models/country.model';
import {MapService} from '../services/map.service';
import {AreaService} from '../services/area.service';
import {LoaderService} from '../services/loader.service';

let self;
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterContentInit() {

  map: any;
  areas: any;
  states: any;
  countries: CountryModel[];
  date: string;
  featureGroup: any = L.featureGroup();
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

  // getAreas (e) {
  //   this.data.locate({lat: e.latlng.lat, lng: e.latlng.lng}).subscribe(
  //     value => {
  //       console.log('value ::', value);
  //     }
  //   );
  // }

  ngOnInit() {
    // const osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png';
    // const satiliteUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    const satiliteUrl = 'https://mt0.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
      osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      osm = L.tileLayer(satiliteUrl, {
        maxZoom: 18,
        attribution: osmAttrib
      });

    // initialize the map on the "map" div with a given center and zoom
    this.map = L.map('map', {editable: true}).setView([43.1, 1.2], 5).addLayer(osm);

    this.loadData();

    // this.map.on('click', function(e) {
    //     this.getAreas(e.target);
    //   }
    // );

    // this.data.locate().subscribe(
    //   value => {
    //     console.log('value ::', value)
    //   }
    // )
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
    const stateAreas = this.stateService.getStatesByCountryAndDate(this.countries, this.date, this.areas, this.states);
    const polygons = this.mapService.buildMainMapPolygons(stateAreas, this.states, this.countries);
    for (let i = 0; i < polygons.length; i++) {
      polygons[i].on('click', function (e) {
        self.activeCountry = e.target.country;
      });
    }
    this.featureGroup = L.featureGroup(polygons);
    // for (let i = 0; i < areas.length; i++) {
    //   // areas.push();
    //   const polygon = L.polygon(JSON.parse(areas[i].polygon), {color: areas[i].colour});
    //   this.featureGroup.addLayer();
    // }
     this.featureGroup.addTo(this.map);
  }

}
