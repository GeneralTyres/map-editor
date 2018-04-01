import { Component, OnInit } from '@angular/core';
import 'leaflet';
import 'leaflet-editable';
import {HttpClient} from '@angular/common/http';
import {DataService} from '../services/data.service';
import {CountryService} from '../services/country.service';
import {StateService} from '../services/state.service';
import {CountryModel} from '../models/country.model';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  map: any;
  areas: any;
  states: any;
  poly: any;
  countries: CountryModel[];
  maps: any[];
  date: string;

  constructor(private http: HttpClient,
              private data: DataService,
              private countryService: CountryService,
              private stateService: StateService) { }

  ngOnInit() {
    const osmUrl = 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      osm = L.tileLayer(osmUrl, {
        maxZoom: 18,
        attribution: osmAttrib
      });

    // initialize the map on the "map" div with a given center and zoom
    this.map = L.map('map', {editable: true}).setView([43.1, 1.2], 12).addLayer(osm);

    this.map.on('editable:editing', function (e) {
      console.log(e);
    });

    this.loadData();
  }

  loadData () {
    this.countryService.loadCountries().subscribe(
      response => {
        console.log('response ::', response);
        this.countries = response;
      }
    );
    this.data.load('areas').subscribe(
      data => {
        console.log('data ::', data);
        this.areas = data;
      }
    );
    this.stateService.loadStates().subscribe(
      data => {
        console.log('data ::', data);
        this.states = data;
      }
    );
  }

  showStatesByDate() {
    console.log('ping')
    const areas = this.stateService.getStatesByCountryAndDate(this.countries, this.date, this.areas, this.states);
    console.log('areas ::', areas)
    for (let i = 0; i < areas.length; i++) {
      this.poly = L.polygon(JSON.parse(areas[i].polygon)).addTo(this.map);
    }

  }

}
